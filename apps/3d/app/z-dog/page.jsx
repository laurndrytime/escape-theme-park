"use client";
import { useRef } from "react";
import {
  Illustration,
  Anchor,
  useRender,
  Box,
  Ellipse,
  Shape,
} from "react-zdog";

export default function Page() {
  return (
    <main className="w-full h-screen bg-red-500">
      <Illustration zoom={20} dragRotate={true}>
        <RotatingShape />
      </Illustration>
    </main>
  );
}

const RotatingShape = () => {
  const ref = useRef();

  // Use the useRender hook to continuously update the rotation
  // useRender(() => {
  //   if (ref.current) {
  //     ref.current.rotate.x += 0.03;
  //     ref.current.rotate.y += 0.03;
  //   }
  // });

  return (
    // <Ellipse ref={boxRef} width={50} height={50} depth={50} color="#4E4" />
    <Anchor ref={ref}>
      <Shape fill stroke={0.7} translate={{ x: -1, y: -1 }} color="#000" />
      <Shape fill stroke={0.7} translate={{ x: 1, y: -1 }} color="#000" />
      <Shape fill stroke={3} translate={{ z: -0.5 }} color="#fff" />
      <Ellipse
        backface="#E62"
        frontface="#A1F"
        quarters={2}
        stroke={1}
        diameter={2}
        color="#e2e2e2"
        translate={{ z: 1.2, y: 0.2 }}
        rotate={{ y: 0.5 * Math.PI, z: -1.3 * Math.PI }}
      />
    </Anchor>
  );
};
