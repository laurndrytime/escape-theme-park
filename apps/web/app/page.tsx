"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Page(): JSX.Element {
  const [scrollY, setScrollY] = useState<number>(0);
  const height = 8000;

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      console.log("sup", window.scrollY);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main className="relative w-full block overflow-auto">
      <div
        className={"w-full top-0 overflow-auto left-0 bg-purple-100"}
        style={{
          height: `${height}px`,
        }}
      >
        <div className="w-screen bg-blue-500/50 block h-screen fixed bottom-[20px] pointer-events-none">
          <div
            className="absolute p-6 bg-red-300 text-black pointer-events-auto"
            style={{
              top: "50%",
              left: `${(scrollY / height) * 50}%`,
              transform: "translate(0, -50%)",
            }}
          >
            hello
          </div>
          <div
            className="absolute p-6 bg-green-300 text-black pointer-events-auto"
            style={{ top: "50%", right: "0%", transform: "translate(0, -50%)" }}
          >
            world
          </div>
        </div>
      </div>
      <section className="bg-yellow-500 w-full h-screen">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe fugit
        provident at assumenda nobis ipsam facere, accusantium quisquam esse.
        Earum quia neque assumenda officia architecto eos facilis laborum
        dignissimos tempora.
      </section>
    </main>
  );
}
