"use client";

import classNames from "classnames";
import { useInView } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

type PostType = { id: string; name: string };
const posts: PostType[] = [
  { id: "one", name: "Title of post 1" },
  { id: "two", name: "Title of post 2" },
  { id: "three", name: "Title of post 3" },
];

export default function Page() {
  const initialViewInPost = useSearchParams().get("post") || undefined;
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [postInView, setPostInView] = useState<string | undefined>(
    initialViewInPost,
  );
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [scrollHeight, setScrollHeight] = useState<number>(99999);

  useEffect(() => {
    if (!postInView) {
      return;
    } else {
      const elem = document.getElementById(postInView);
      if (!elem) {
        return;
      }

      window.history.pushState(
        {},
        "",
        `${window.location.pathname}?post=${postInView}`,
      );
      elem.scrollIntoView({ behavior: "smooth" });
    }
  }, [postInView]);

  useEffect(() => {
    if (!scrollerRef.current) {
      return;
    }
    const handleScroll = () => {
      if (!scrollerRef.current) {
        return;
      }

      setScrollProgress(scrollerRef.current.scrollTop);
      setScrollHeight(
        scrollerRef.current.scrollHeight - scrollerRef.current.clientHeight,
      );
    };

    handleScroll();

    scrollerRef.current.addEventListener("scroll", handleScroll);

    return () => {
      scrollerRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);
  console.log(scrollProgress, scrollHeight);
  return (
    <div className="h-screen flex relative bg-slate-300 w-full">
      <Sidebar postInView={postInView} setPostInView={setPostInView} />
      <div
        id="scroller"
        ref={scrollerRef}
        className="h-screen p-4 bg-slate-500 snap-y overflow-y-scroll snap-mandatory w-full max-w-[500px] hide-scrollbar"
      >
        {posts.map((p) => {
          return (
            <Post
              postInView={postInView}
              setPostInView={setPostInView}
              key={p.id}
              post={p}
            />
          );
        })}
      </div>
      <div className="h-screen w-10 relative">
        <div
          style={{ height: `calc(${scrollProgress / scrollHeight} * 100%)` }}
          className="bg-green-100 absolute top-0 left-0 w-full"
        ></div>
      </div>
    </div>
  );
}

function Sidebar({
  postInView,
  setPostInView,
}: {
  postInView: string | undefined;
  setPostInView: Dispatch<SetStateAction<string | undefined>>;
}) {
  return (
    <div className="h-screen flex flex-col top-0 left-0 p-2 sticky w-[200px] bg-slate-300">
      {posts.map((p) => {
        return (
          <button
            className={classNames(
              postInView === p.id
                ? "bg-slate-700 hover:bg-slate-900"
                : "bg-slate-500 hover:bg-slate-700",
              "w-full p-3 text-black hover:text-white ",
            )}
            onClick={() => {
              setPostInView(p.id);
            }}
          >
            {p.name}
          </button>
        );
      })}
    </div>
  );
}

function Post({
  post,
  postInView,
  setPostInView,
}: {
  post: PostType;
  postInView: string | undefined;
  setPostInView: Dispatch<SetStateAction<string | undefined>>;
}) {
  const thisPostRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(thisPostRef);

  useEffect(() => {
    if (isInView && postInView !== post.id) {
      const timeoutId = setTimeout(() => {
        setPostInView(post.id);
      }, 400);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isInView, postInView]);

  return (
    <div
      ref={thisPostRef}
      id={post.id}
      className="h-screen scroll-mt-5 snap-start bg-slate-100 mb-10"
    >
      <h1 className="text-black">{post.name}</h1>
    </div>
  );
}
