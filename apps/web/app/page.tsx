"use client";

import classNames from "classnames";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Page(): JSX.Element {
  return (
    <main className="p-4 w-full flex">
      <div className="w-[350px] h-[450px] flex-shrink-0 border-t border-r transition-all hover:rounded-full hover:px-12 hover:py-12 rounded-se-full border-white pl-4 pr-20 py-0 hover:bg-white hover:text-black">
        <div className="border-b w-full border-white pb-4">
          <h1 className="font-mono text-2xl ">Escape Theme Park</h1>
          <p className="font-mono text-md">
            By{" "}
            <a
              className="hover:bg-black hover:text-white"
              target="_blank"
              href="https://instagram.com/bananaleow"
            >
              Lauryn Leow
            </a>{" "}
            and{" "}
            <a
              target="_blank"
              className="hover:bg-black hover:text-white"
              href="https://instagram.com/isachanjh"
            >
              Isabella Chan
            </a>
          </p>
        </div>
        <div className="py-4 font-mono">
          <p>
            Hello, welcome to Escape Theme Park! This is an experimental space
            created for us to just mess around. This space is still a wip.
            Please bear with us. Have fun looking!
          </p>
          <div className=" mt-4">
            <a
              className="hover:bg-black hover:text-white"
              target="_blank"
              href="https://github.com/laurndrytime/escape-theme-park"
            >
              Github
            </a>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="h-[450px] px-4">
          <h3 className="font-mono mb-4 text-xl">Index</h3>
          <Toggle label={"Scrollers"}>
            <Link href="/scroll/translate">Scroll Translation</Link>
            <Link href="/scroll/snap">Scroll Snap</Link>
          </Toggle>
        </div>
        <div className="h-[300px] -ml-[1px] border-b border-l rounded-es-full w-full"></div>
      </div>
    </main>
  );
}

function Toggle({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [expand, setExpand] = useState<boolean>(true);
  return (
    <div>
      <button
        onClick={() => {
          setExpand((expand) => !expand);
        }}
        className=" border-b border-white font-mont text-lg"
      >
        {label}{" "}
        <span
          className={classNames("transition-all", expand ? "" : "rotate-180")}
        >
          ↯
        </span>
      </button>
      <AnimatePresence>
        {expand && (
          <motion.div
            className="flex flex-col gap-2 py-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
