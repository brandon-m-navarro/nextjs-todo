'use client';

import React, { useRef, useState } from "react";

export default function RubiksCube() {
  const [rotation, setRotation] = useState({ x: -20, y: 20 });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;

    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setRotation((r) => ({
      x: r.x + dy * 0.5,
      y: r.y + dx * 0.5,
    }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <div
      className="animation-container mt-[24px] h-[250px] z-9 w-full relative cursor-grab select-none"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div className="cube-container">
        <div
          className="cube"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: "none",
          }}
        >
          {/* <div className="face front bg-[#009B48]"></div> */}
          <div className="face front grid grid-cols-3 grid-rows-3 gap-[2px]">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="w-full h-full bg-[#009B48] border border-[#000000]"
              />
            ))}
          </div>
          {/* <div className="face back bg-[#0045AD]"></div> */}
          <div className="face back grid grid-cols-3 grid-rows-3 gap-[2px]">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="w-full h-full bg-[#0045AD] border border-[#000000]"
              />
            ))}
          </div>
          {/* <div className="face left bg-[#FF5900]"></div> */}
          <div className="face left grid grid-cols-3 grid-rows-3 gap-[2px]">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="w-full h-full bg-[#FF5900] border border-[#000000]"
              />
            ))}
          </div>
          {/* <div className="face right bg-[#B90000]"></div> */}
          <div className="face right grid grid-cols-3 grid-rows-3 gap-[2px]">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="w-full h-full bg-[#B90000] border border-[#000000]"
              />
            ))}
          </div>
          {/* <div className="face top bg-[#FFFFFF]"></div> */}
          <div className="face top grid grid-cols-3 grid-rows-3 gap-[2px]">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="w-full h-full bg-[#FFFFFF] border border-[#000000]"
              />
            ))}
          </div>
          {/* <div className="face bottom bg-[#FFD500]"></div> */}
          <div className="face bottom grid grid-cols-3 grid-rows-3 gap-[2px]">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="w-full h-full bg-[#FFD500] border border-[#000000]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
