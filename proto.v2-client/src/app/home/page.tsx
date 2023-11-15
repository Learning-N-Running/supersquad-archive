"use client";
import LongBlueButton from "@/components/base/Button/LongBlueButton";
import BaseModal from "@/components/base/Modal/BaseModal";
import PaymentSelectModal from "@/components/common/explore/PaymentSelectModal";
import MyChallengeBlock from "@/components/common/MyChallengeBlock";
import BadgePointPannel from "@/components/common/home/BadgePointPannel";
import ChallengeHeader from "@/components/common/home/ChallengeHeader";
import CompletedChallengeBlock from "@/components/common/home/CompletedChallengeBlock";
import FeaturedChallengeBlock from "@/components/common/home/FeaturedChallengeBlock";
import WelcomeMessage from "@/components/common/home/WelcomeMessage";
import colors from "@/styles/color";
import styled from "styled-components";
import DepositChargeModal from "@/components/common/explore/DepositChargeModal";

const Home = () => {
  return (
    <Container>
      {/* <PaymentSelectModal /> */}
      <DepositChargeModal />
      <WelcomeMessage></WelcomeMessage>
      <BadgePointPannel />
      <ChallengeHeader $fontColor={colors.white}>
        Today Challenges
      </ChallengeHeader>
      <MyChallengeBlock></MyChallengeBlock>
      <CompletedChallengeBlock></CompletedChallengeBlock>
      <FeaturedChallengeBlock></FeaturedChallengeBlock>
      <div style={{ width: "100%", backgroundColor: "white" }}>
        <LongBlueButton
          margin="10 0 0 0"
          title="Explore Challenge"
          onClickHandler={() => {}}
        />
      </div>
    </Container>
  );
};
export default Home;

const Container = styled.main`
  width: 100%;
  height: auto;
  background-color: ${colors.primary};

  padding: 0 22px;
  box-sizing: border-box;
`;