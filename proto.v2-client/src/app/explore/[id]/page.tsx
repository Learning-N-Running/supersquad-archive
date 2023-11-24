"use client";
import SingleChallengeInfo from "@/components/common/explore/SingleChallengeInfo";
import DetailedChallengePage from "@/components/common/DetailedChallengePage";
import { useQuery } from "react-query";
import { getSingleChallenge } from "@/lib/api/querys/challenge/getSingleChallenge";
import { useParams, usePathname, useRouter } from "next/navigation";
import { SingleChallengeByChallengeId } from "@/types/api/Challenge";
import { DURATION } from "@/lib/protoV2Constants";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
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
import { USERID } from "@/lib/api/testdata";
import { getIsChallengeRegistered } from "@/lib/api/querys/myChallenge/getIsChallengeRegistered";
import { getUserIDState } from "@/redux/slice/authSlice";

const ExploreID = () => {
  // variables //
  const { id } = useParams<{ id: string }>();
  const challengeId: string = id as string;
  const dispatch = useDispatch();
  const modal: IModalState = useSelector(getModalState);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("crypto");
  const [deposit, setDeposit] = useState<number>(10);
  const router = useRouter();
  const userId = useSelector(getUserIDState);

  // API //
  const {
    data: isRegistered,
    error: isRegisteredError,
    isLoading: isRegisteredLoading,
  } = useQuery({
    // queryKey: [`isRegistered-${challengeId} - ${USERID}`],
    queryKey: [`isRegistered-${challengeId} - ${userId}`],
    queryFn: async () => {
      const res = await getIsChallengeRegistered({
        challengeId: challengeId,
        // userId: USERID,
        userId: userId!,
      });
      let isRegistered;
      if (res.userChallengeInfo.userChallengeId) {
        isRegistered = true;
      } else {
        isRegistered = false;
      }
      return isRegistered;
    },
    staleTime: 5000,
    cacheTime: 60 * 60 * 1000,
  });

  const {
    data: challenge,
    error,
    isLoading,
  } = useQuery<SingleChallengeByChallengeId>({
    queryKey: [`singleChallenge-${challengeId}`],
    queryFn: async () => {
      const res = await getSingleChallenge({ challengeId: challengeId });
      const challenge = res.challengeInfo;
      return challenge;
    },
    staleTime: 5000,
    cacheTime: 60 * 60 * 1000,
  });

  // useEffect //
  useEffect(() => {
    if (isRegistered) {
      dispatch(
        SET_FOOTER_BLUEBUTTON({
          blueButtonTitle: "I am in!",
          handleBlueButtonClick: () => {
            dispatch(OPEN_MODAL({ modal: "paymentSelect" }));
          },
        })
      );
    } else {
      dispatch(
        SET_FOOTER_BLUEBUTTON({
          blueButtonTitle: "You are already in",
          handleBlueButtonClick: () => {},
        })
      );
    }
  }, [id, modal.visibility, isRegistered]);

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
      {modal.activeModal === "depositCharge" && modal.visibility === true && (
        <DepositChargeModal
          paymentMethod={paymentMethod}
          challengeId={challengeId}
          deposit={deposit}
          setDeposit={setDeposit}
        />
      )}

      <DetailedChallengePage
        thumbnailUrl={challenge?.thumbnailUrl!}
        frequency={challenge?.frequency!}
        name={challenge?.name!}
        participants={challenge?.participants!}
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
