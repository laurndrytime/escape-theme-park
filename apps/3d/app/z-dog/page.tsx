"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import Zdog, { TAU } from "zdog";

const color = {
  body: "#a689c6",
  head: "#a689c6",
  ear: "#875873",
  arm: "#875873",
  leg: "#875873",
  cheek: "#ee2258",
  nose: "#ee2258",
  eye: "#170f2e",
  sparkle: "#EA0",
};

export default function Page() {
  const ref = useRef<any>();
  const leftLegRef = useRef<any>();
  const rightLegRef = useRef<any>();

  useEffect(() => {
    let illo = new Zdog.Illustration({
      element: ".zdog-canvas",
      zoom: 20,
      dragRotate: true,
    });

    // whole elephant
    var elephante = new Zdog.Anchor({
      addTo: illo,
    });

    //BODY GROUP
    const body = new Zdog.Anchor({
      addTo: elephante,
    });

    // body
    new Zdog.Shape({
      addTo: body,
      fill: true,
      stroke: 5,
      translate: { y: 2.2, z: -1.3 },
      color: color.body,
    });

    //arm
    const arm = new Zdog.Cylinder({
      addTo: body,
      fill: true,
      stroke: 0.5,
      translate: { x: -0.9, y: 2.2 },
      color: color.arm,
      rotate: { x: -0.7, y: -0.3 },
    });

    arm.copy({
      translate: { x: 0.9, y: 2.2 },
      rotate: { x: -0.7, y: Math.PI + 0.3 },
    });

    //leg
    const leftLeg = new Zdog.Cylinder({
      addTo: body,
      fill: true,
      stroke: 0.5,
      translate: { x: -1.5, y: 4, z: -0.5 },
      color: color.leg,
      rotate: { y: TAU / 1.6 },
    });

    const rightLeg = leftLeg.copy({
      translate: { x: 1.5, y: 4, z: -0.5 },
      rotate: { y: -TAU / 1.6 },
    });

    // HEAD GROUP
    const head = new Zdog.Anchor({
      addTo: elephante,
    });

    // ear
    const ear = new Zdog.Ellipse({
      addTo: head,
      quarters: 3,
      fill: true,
      stroke: 0.4,
      diameter: 3,
      color: color.ear,
      translate: { z: -0.4, y: -1.5, x: -1.5 },
      rotate: { y: TAU / 8, z: TAU / 2 },
    });

    ear.copy({
      translate: { z: -0.4, y: -1.5, x: 1.5 },
      rotate: { y: -TAU / 8 },
      scale: { y: -1 },
    });

    // head
    new Zdog.Shape({
      addTo: head,
      fill: true,
      stroke: 3,
      translate: { z: 0.5 },
      color: color.head,
    });

    const cheek = new Zdog.Shape({
      addTo: head,
      fill: true,
      stroke: 1.7,
      translate: { z: 0.6, x: 1, y: 0.6 },
      color: color.head,
    });

    const cheekRed = new Zdog.Ellipse({
      addTo: cheek,
      fill: true,
      stroke: 0.1,
      diameter: 0.8,
      translate: {
        z: 0.5,
        x: 0.5,
      },
      rotate: {
        y: -TAU / 8,
      },
      color: color.cheek,
    });

    const leftCheek = cheek.copy({
      translate: { z: 0.6, x: -1, y: 0.6 },
    });

    cheekRed.copy({
      addTo: leftCheek,
      translate: {
        z: 0.5,
        x: -0.5,
      },
      rotate: {
        y: TAU / 8,
      },
    });

    const eyeGroup = new Zdog.Group({
      addTo: head,
    });

    // eye
    const eye = new Zdog.Ellipse({
      addTo: eyeGroup,
      fill: true,
      diameter: 1,
      stroke: 0.1,
      color: color.eye,
      translate: { x: -0.7, y: -0.4, z: 1 },
      rotate: { y: TAU / 8 },
    });

    const eyeSparkle = new Zdog.Polygon({
      addTo: eye,
      radius: 0.2,
      sides: 4,
      stroke: 0.1,
      color: color.sparkle,
      translate: { x: -0.2, y: -0.2, z: 0.15 },
      fill: true,
    });

    const rightEye = eye.copy({
      rotate: { y: -TAU / 8 },
      translate: { x: 0.7, y: -0.4, z: 1 },
    });
    eyeSparkle.copy({
      addTo: rightEye,
    });

    // nose
    new Zdog.Ellipse({
      addTo: head,
      quarters: 1,
      stroke: 1.3,
      diameter: 2,
      color: color.nose,
      translate: { z: 2.5, y: -0.3 },
      rotate: { y: 0.5 * Math.PI, z: -1.1 * Math.PI },
    });

    ref.current = illo;
    leftLegRef.current = leftLeg;
    rightLegRef.current = rightLeg;
    // update & render
    function animate() {
      illo.updateRenderGraph();
      requestAnimationFrame(animate);

      leftLegRef.current.rotate.x += 0.1;
      rightLegRef.current.rotate.x += 0.1;

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
