import React, { MouseEventHandler } from "react";

interface KeyButtonProps {
  value: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const KeyButton = ({ value, onClick }: KeyButtonProps) => {
  return (
    <button
      className="h-24 m-4 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 justify-center items-center text-center"
      onClick={onClick}
    >
      <p>{value}</p>
    </button>
  );
};

export default KeyButton;
