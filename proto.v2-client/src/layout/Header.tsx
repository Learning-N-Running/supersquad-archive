const Header = () => {
  return <GoBack />;
};

export default Header;

import colors from "@/styles/color";
import styled from "styled-components";

const ServiceTitle = () => {
  return (
    <ServiceTitleContainer>
      <Title>SuperSquad</Title>
    </ServiceTitleContainer>
  );
};

const GoBack = () => {
  return (
    <GoBackContainer>
      <img src="/asset/arrow-left.svg" width={32} height={32} />
    </GoBackContainer>
  );
};

const ServiceTitleContainer = styled.header`
  width: 100%;
  height: 70px;
  margin: 0 auto;

  position: fixed;
  left: 50%;
  top: 0;
  transform: translateX(-50%);

  background-color: ${colors.primary};

  overflow: hidden;
  z-index: 99;

  display: flex;
  align-items: center;
  justify-content: center;

  box-sizing: border-box;
`;

const Title = styled.div`
  color: #fff;
  font-family: ClashDisplayVariable;
  font-size: 21px;
  font-weight: 700;
`;

const GoBackContainer = styled.header`
  width: 100%;
  height: 70px;
  margin: 0 auto;

  position: fixed;
  left: 50%;
  top: 0;
  transform: translateX(-50%);

  overflow: hidden;
  z-index: 99;

  background-color: ${colors.white};

  display: flex;
  align-items: center;

  padding-left: 22px;

  box-sizing: border-box;
`;
