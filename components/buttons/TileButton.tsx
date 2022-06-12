import { useEffect, useState } from "react";
import { TileButtonProps } from "../../utils/type";

export const TileButton = (props: TileButtonProps) => {
  const { data, tile, handleTileClick } = props;
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    setButtonDisabled(false);
  }, [data]);

  return (
    <>
      <button
        disabled={buttonDisabled}
        style={{
          cursor: "pointer",
          background: buttonDisabled ? "tomato" : "#54ad25",
          color: "aliceblue",
          border: "2px solid",
          fontSize: "20px",
        }}
        onClick={() => {
          setButtonDisabled(true);
          handleTileClick();
        }}
      >
        tile {tile.id}
      </button>
    </>
  );
};
