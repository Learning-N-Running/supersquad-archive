import FullPageModal from "@/components/base/Modal/FullPageModal";
import postPhoto from "@/lib/api/axios/verification/postPhoto";
import { snapYourScaleSrc } from "@/lib/components/fullPageModal";
import {
  CHANGE_MODAL,
  CLOSE_MODAL,
  IModalState,
  getModalState,
} from "@/redux/slice/modalSlice";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  userChallengeId: string;
};

const SnapYourScaleModal = ({ userChallengeId }: Props) => {
  // variables //
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);
  const modal: IModalState = useSelector(getModalState);
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  // handle functions //
  const handleBlueButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click(); // Trigger click on the input element
    }
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      const res = await postPhoto(userChallengeId, file);
      if (res.status === 200) {
        dispatch(CHANGE_MODAL({ modal: "congrats_status" }));
      }
      if (res === undefined || res === null || res.status === 0) {
        // router.push("/error");
        // 에러 처리
        return;
      }
    }
  };
  return (
    <FullPageModal {...snapYourScaleSrc} onClickHandler={handleBlueButtonClick}>
      <input
        ref={inputRef}
        id="file"
        accept="image/*"
        name="file"
        type="file"
        capture="environment"
        onChange={onUpload}
        style={{ display: "none" }}
      />
    </FullPageModal>
  );
};

export default SnapYourScaleModal;