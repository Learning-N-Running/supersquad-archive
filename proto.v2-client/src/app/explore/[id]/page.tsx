"use client";
import SingleChallengeInfo from "@/components/common/explore/SingleChallengeInfo";
import DetailedChallengePage from "@/components/common/DetailedChallengePage";
import { useQuery } from "react-query";
import { getSingleChallenge } from "@/lib/api/querys/challenge/getSingleChallenge";
import { useParams, usePathname, useRouter } from "next/navigation";
import { SingleChallengeByChallengeIdT } from "@/types/api/Challenge";
import { DURATION } from "@/lib/protoV2Constants";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  DEACTIVATE_FOOTER_BLUEBUTTON,
  INITIALIZE_FOOTER_BLUEBUTTON,
  SET_FOOTER_BLUEBUTTON,
  SET_HEADER_GOBACK,
} from "@/redux/slice/layoutSlice";
import {
  CLOSE_MODAL,
  IModalState,
  OPEN_MODAL,
  getModalState,
} from "@/redux/slice/modalSlice";
import styled from "styled-components";
import colors from "@/styles/color";
import PaymentSelectModal from "@/components/common/explore/PaymentSelectModal";
import DepositChargeModal from "@/components/common/explore/DepositChargeModal";
import { PaymentMethod } from "@/types/Modal";
import FullPageModal from "@/components/base/Modal/FullPageModal";
import { nowYouAreInSrc } from "@/lib/components/fullPageModal";
import { getIsChallengeRegistered } from "@/lib/api/querys/myChallenge/getIsChallengeRegistered";
import { getIsLoggedInState, getUserIDState } from "@/redux/slice/authSlice";
import Loading from "@/components/animation/Loading/Spinner/Loading";

const ExploreID = () => {
  // variables //
  const { id } = useParams<{ id: string }>();
  const challengeId: string = id as string;
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("crypto");
  const [deposit, setDeposit] = useState<number>(10);
  const router = useRouter();

  const modal: IModalState = useSelector(getModalState);
  const userId = useSelector(getUserIDState);
  const [register, setRegister] = useState(false);
  const isLoggedIn = useSelector(getIsLoggedInState);

  // API //
  const {
    data: isRegistered,
    error: isRegisteredError,
    isLoading: isRegisteredLoading,
  } = useQuery({
    queryKey: [`isRegistered-${challengeId} - ${userId}`],
    queryFn: async () => {
      if (userId) {
        const res = await getIsChallengeRegistered({
          challengeId: challengeId,
          userId: userId!,
        });
        if (res.userChallengeInfo.userChallengeId !== undefined) {
          setRegister(true);
        } else {
          setRegister(false);
        }
        return res.userChallengeInfo.userChallengeId != undefined;
      }
    },
    staleTime: 10000,
    cacheTime: 60 * 60 * 1000,
  });

  const {
    data: challenge,
    error,
    isLoading,
  } = useQuery<SingleChallengeByChallengeIdT>({
    queryKey: [`singleChallenge-${challengeId}`],
    queryFn: async () => {
      const res = await getSingleChallenge({ challengeId: challengeId });
      const challenge = res.challengeInfo;
      console.log(challenge);
      return challenge;
    },
    staleTime: 5000,
    cacheTime: 60 * 60 * 1000,
  });

  // useEffect //
  useEffect(() => {
    if (userId) {
      setRegister(isRegistered!);
    }
  }, [isRegistered]);

  useEffect(() => {
    if (isLoggedIn) {
      if (register) {
        dispatch(
          DEACTIVATE_FOOTER_BLUEBUTTON({
            blueButtonTitle: "You are already in",
            handleBlueButtonClick: () => {},
          })
        );
      } else {
        dispatch(
          SET_FOOTER_BLUEBUTTON({
            blueButtonTitle: "I am in!",
            handleBlueButtonClick: () => {
              dispatch(INITIALIZE_FOOTER_BLUEBUTTON());
              dispatch(OPEN_MODAL({ modal: "paymentSelect" }));
            },
          })
        );
      }
    } else {
      dispatch(
        DEACTIVATE_FOOTER_BLUEBUTTON({
          blueButtonTitle: "Log in First",
          handleBlueButtonClick: () => router.push("/flow/login"),
        })
      );
    }
  }, [isLoggedIn, register, dispatch, router]);

  useEffect(() => {
    dispatch(
      SET_HEADER_GOBACK({
        handleGoBackButtonClick: () => {
          router.push("/explore");
        },
      })
    );
  }, []);

  return modal.activeModal === "nowYouAreIn" && modal.visibility === true ? (
    <FullPageModal
      {...nowYouAreInSrc}
      onClickHandler={() => {
        router.push("/mychallenge");
        dispatch(CLOSE_MODAL());
      }}
      goBackButtonClickHandler={() => {
        router.push("/explore");
        dispatch(CLOSE_MODAL());
      }}
    />
  ) : (
    <Container>
      {modal.activeModal === "paymentSelect" && modal.visibility === true && (
        <PaymentSelectModal
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
      )}

      {modal.activeModal === "depositCharge" &&
        modal.visibility === true &&
        challenge?.successPoolAddress && (
          <DepositChargeModal
            paymentMethod={paymentMethod}
            challengeId={challengeId}
            deposit={deposit}
            poolAddress={challenge.successPoolAddress}
            setDeposit={setDeposit}
          />
        )}

      <DetailedChallengePage
        thumbnailUrl={challenge?.thumbnailUrl!}
        frequency={challenge?.frequency!}
        name={challenge?.name!}
        participants={challenge?.participants!}
        profileUrls={challenge?.profileUrls ? challenge?.profileUrls : []}
      >
        <SingleChallengeInfo
          title="Duration"
          content={DURATION}
          detail={challenge?.frequency!}
        />
        <SingleChallengeInfo
          title="How To"
          content={challenge?.howTo.split("*")[0]!}
          detail={challenge?.howTo.split("*")[1]!}
        />
        <SingleChallengeInfo
          title="Why this challenge?"
          content=""
          detail={challenge?.description!}
        />
      </DetailedChallengePage>
    </Container>
  );
};

export default ExploreID;

const Container = styled.main`
  width: 100%;
  height: auto;
  background-color: ${colors.white};
`;
