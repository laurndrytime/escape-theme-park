"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Zdog from "zdog";

export default function Page() {
  const ref = useRef<any>();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  useEffect(() => {
    // illustration for canvas
    let illo = new Zdog.Illustration({
      // set canvas with selector
      element: ".zdog-canvas",
      zoom: 20,
      dragRotate: true,
      // onDragMove: (pointer, moveX, moveY) => {
      //   illo.rotate.y = moveY
      //   illo.rotate.x = moveX
      // },
      // onDragStart: () => {},
      // onDragEnd: () => {
      //   ref.current.rotate.y += 0.01;
      // },
    });

    // whole elephant
    var elephante = new Zdog.Group({
      addTo: illo,
    });

    //BODY GROUP
    const body = new Zdog.Group({
      addTo: elephante,
    });

    // body
    new Zdog.Shape({
      addTo: body,
      fill: true,
      stroke: 5,
      translate: { y: 2.2, z: -1.3 },
      color: "#a689c6",
    });

    //arm
    const arm = new Zdog.Cylinder({
      addTo: body,
      fill: true,
      stroke: 0.5,
      translate: { x: -0.9, y: 2.2 },
      color: "#645c71",
      rotate: { x: -0.7, y: -0.3 },
    });

    arm.copy({
      translate: { x: 0.9, y: 2.2 },
      rotate: { x: -0.7, y: Math.PI + 0.3 },
    });

    //leg
    const leg = new Zdog.Cylinder({
      addTo: body,
      fill: true,
      stroke: 0.5,
      translate: { x: -1.5, y: 4, z: -0.5 },
      color: "#645c71",
      rotate: { y: 0.9 },
    });

    leg.copy({
      translate: { x: 1.5, y: 4, z: -0.5 },
      rotate: { y: Math.PI - 0.9 },
    });

    // HEAD GROUP
    const head = new Zdog.Group({
      addTo: elephante,
    });

    // ear
    const ear = new Zdog.Hemisphere({
      addTo: head,
      backface: "#E62",
      quarters: 1,
      stroke: 1.7,
      diameter: 2,
      fill: true,
      color: "#645c71",
      translate: { z: -1, y: -1.1, x: -2 },
      rotate: { y: -0.5 * Math.PI, z: -2 * Math.PI },
    });

    ear.copy({
      backface: "#ffef0a",
      translate: { z: -1, y: -1.3, x: 1 },
      rotate: { y: -0.5 * Math.PI, z: 1 * Math.PI },
    });
    // head
    new Zdog.Shape({
      addTo: head,
      fill: true,
      stroke: 3,
      translate: { z: -0.5 },
      color: "#e2e2e2",
    });

    const eye = new Zdog.Shape({
      addTo: head,
      fill: true,
      stroke: 1,
      translate: { x: -0.7, y: -1, z: -0.4 },
      color: "#170f2e",
    });

    const eyecopy = eye.copy({
      translate: { x: 0.7, y: -1, z: -0.4 },
    });

    const eyesparkle = new Zdog.Shape({
      addTo: eye,
      fill: true,
      stroke: 0.3,
      translate: { x: -0.3, y: -0.2 },
      color: "#fff",
    });

    eyesparkle.copy({
      addTo: eyecopy,
      translate: { x: -0.3, y: -0.2 },
    });

    // nose
    new Zdog.Ellipse({
      addTo: head,
      backface: "#ee2258",
      quarters: 1,
      stroke: 1.3,
      diameter: 2,
      color: "#b2b2b2",
      translate: { z: 1.2, y: -0.5 },
      rotate: { y: 0.5 * Math.PI, z: -1.1 * Math.PI },
    });

    ref.current = illo;

    // update & render
    function animate() {
      illo.updateRenderGraph();
      requestAnimationFrame(animate);
      ref.current.rotate.y += 0.01;
    }
    animate();
  }, []);

  return (
    <main className="w-full flex-col h-full items-center relative justify-center flex min-h-screen bg-red-500">
      <Image
        src="/images/carousel.jpeg"
        alt=""
        fill
        className="w-full h-full"
        sizes="100%"
      />
      <div className="z-10 relative flex flex-col items-center justify-center w-full h-full bg-black/60 min-h-screen">
        <canvas height="200px" width="200px" className="zdog-canvas"></canvas>
        <p>Elefante</p>
      </div>
    </main>
  );
}
