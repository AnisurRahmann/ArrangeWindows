import { useEffect, useState } from "react";
import { post } from "../pages/api";
import { WindowType } from "../utils/type";

export const MouseToCenter = ({
  activeWindow,
  data,
}: {
  activeWindow: WindowType;
  data: any;
}) => {
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    setButtonDisabled(false);
  }, [data]);

  const { top, left, width, height } = activeWindow ?? {};

  const centerOfWindow = {
    x: left + width / 2,
    y: top + height / 2,
  };

  const handleCenterMouse = () => {
    const postData = {
      windowId: activeWindow?.id,
      center: centerOfWindow,
      action: "centerMouse",
    };
    post("tile/window", postData);
  };
  return (
    <div style={{ marginTop: "20px" }}>
      <button
        disabled={buttonDisabled}
        style={{
          cursor: "pointer",
          color: "aliceblue",
          border: "2px solid",
          fontSize: "20px",
          background: buttonDisabled ? "tomato" : "#54ad25",
        }}
        onClick={() => {
          setButtonDisabled(true);
          handleCenterMouse();
        }}
      >
        Center Mouse
      </button>
    </div>
  );
};
