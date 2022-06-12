import { useDrag } from "react-dnd";
import { MonitorProps } from "../utils/type";

const Monitor = (props: MonitorProps) => {
  const { id, primary, width, height, scale, offset = { x: 0, y: 0 } } = props;

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "monitor",
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const left = props.left + offset.x / scale;
  const top = props.top + offset.y / scale;

  return (
    <div
      ref={drag}
      style={{
        position: "absolute",
        display: "flex",
        top: `${scale * top}px`,
        left: `${scale * left}px`,
        width: `${scale * width}px`,
        height: `${scale * height}px`,
        boxSizing: "border-box",
        // border: `1px ${!isDragging ? "solid" : "dashed"} #cecece`,
        border: "5px solid yellow",
        opacity: isDragging ? 0 : 1,
        background: "aliceblue",
        // margin: "250px 300px",
        margin: "22% 25%",
      }}
    >
      <div>
        <p>{id}</p>
      </div>
      {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}
    </div>
  );
};

export default Monitor;
