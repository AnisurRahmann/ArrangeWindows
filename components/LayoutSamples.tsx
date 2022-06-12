import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { LayoutSamplePropsType, SelectedLayoutType } from "../utils/type";
import { monitor } from "../utils/type";

const LayoutSamples = (props: LayoutSamplePropsType) => {
  const { index, monitor, setSelectedLayout, selectedLayout } = props;
  const [layoutImageBorder, setLayoutImageBorder] = useState(false);
  const imageRef = useRef(null);

  const handleLayoutImageClick = (e: any) => {
    setLayoutImageBorder(!layoutImageBorder);
    setSelectedLayout((prevData: SelectedLayoutType) => {
      const item = { ...prevData };
      const a = item[monitor as monitor];
      a.value = imageRef.current?.["dataset"]?.["id"] ?? "";

      return {
        ...item,
      };
    });
  };

  const isBorder = useMemo(() => {
    const currentValue = selectedLayout[monitor as monitor]?.value;

    if (currentValue === `${monitor}layout${index + 1}`) {
      return true;
    }
    return false;
  }, [selectedLayout, monitor, index]);

  return (
    <div
      ref={imageRef}
      onClick={handleLayoutImageClick}
      data-id={`${monitor}layout${index + 1}`}
      style={{
        cursor: "pointer",
        border: isBorder ? "2px solid tomato" : "none",
      }}
    >
      <Image
        src={`/layout/layout0${index + 1}.png`}
        width="100"
        height="100"
        alt={`layout0${index + 1}`}
      />
    </div>
  );
};

export default LayoutSamples;
