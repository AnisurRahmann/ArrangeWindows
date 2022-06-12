import { ApplyButtonProps } from "../../utils/type";

const ApplyButton = (props: ApplyButtonProps) => {
  return (
    <div style={{ position: "absolute", right: 0, padding: "10px" }}>
      <button
        style={{
          width: "auto",
          display: "inline-block",
          border: 0,
          padding: "10px",
          color: "white",
          fontSize: "16px",
          borderRadius: "3px",
          fontFamily: "inherit",
          marginBottom: "10px",
          backgroundColor: "#ad3d41",
          cursor: "pointer",
          marginRight: "10px",
        }}
        onClick={(e) => {
          e.preventDefault();
          props.handleCancel();
        }}
      >
        Cancel
      </button>
      <button
        style={{
          width: "auto",
          display: "inline-block",
          border: 0,
          padding: "10px",
          color: "white",
          fontSize: "16px",
          borderRadius: "3px",
          fontFamily: "inherit",
          marginBottom: "10px",
          backgroundColor: "#4abb6b",
          cursor: "pointer",
        }}
        onClick={(e) => {
          e.preventDefault();
          props.handleApply();
        }}
      >
        Apply
      </button>
    </div>
  );
};
export default ApplyButton;
