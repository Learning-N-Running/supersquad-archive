"use client";

import FlowSectionName from "@/components/common/flow/FlowSectionName";
import ImageInputCircle from "@/components/common/flow/ImageInputCircle";
import NicknameInput from "@/components/common/flow/NicknameInput";
import NicknameMessage from "@/components/common/flow/NicknameMessage";
import colors from "@/styles/color";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import styled from "styled-components";

const ProfileSetting = () => {
  const [nickname, setNickname] = useState("");

  const updateInput = (event: ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  const submitInput = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // 닉네임 제출 로직 (예: 서버로 전송)
      console.log("Submitted Nickname:", nickname);
    }
  };
  return (
    <Container>
      <FlowSectionName>Profile Setting</FlowSectionName>
      <ImageInputWrapper>
        <ImageInputCircle profileSrc="/asset/meditation.jpeg" />
      </ImageInputWrapper>
      <NicknameMessage>Nickname</NicknameMessage>
      <NicknameInput
        nickname={nickname}
        updateInput={updateInput}
        submitInput={submitInput}
      />
    </Container>
  );
};

export default ProfileSetting;

const Container = styled.main`
  width: 100%;
  height: auto;
  padding: 22px;
`;

const ImageInputWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;