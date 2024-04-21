"use client";
import { useRef } from "react";
import { Illustration, useRender, Box, Ellipse, Shape } from "react-zdog";

export default function Page() {
  return (
    <main className="w-full h-screen bg-red-500">
      <Illustration zoom={4}>
        <RotatingCube />
      </Illustration>
    </main>
  );
}

const RotatingCube = () => {
  const ref = useRef();

  // Use the useRender hook to continuously update the rotation
  useRender(() => {
    if (ref.current) {
      ref.current.rotate.x += 0.03;
      ref.current.rotate.y += 0.03;
    }
  });

  return (
    // <Ellipse ref={boxRef} width={50} height={50} depth={50} color="#4E4" />
    <Ellipse ref={ref} stroke={10} color="#" />
  );
};
