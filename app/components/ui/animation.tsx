import React from "react";

export default function SimpleAnimation() {
  return (
    <div className="animation-container mt-[24px] h-[250px] w-[250px] relative">
      <div className="z-1 absolute overflow-hidden translate-x-[-50%] left-[50%] w-[250px] h-[250px] bg-[#D1F601] rotate-x-50 rotate-z-45 rounded-[4px] border-t-[2px] border-l-[2px] border-[#000000]">
        {/* Right trapezoid prism */}
        <div className="trapezoid-r z-2 w-[150px] h-[50px] absolute right-[0px]">
          {/*top*/}{" "}
          <div className="bg-[#000000] z-5 absolute rounded-[0px 0px 0px 4px] w-[100px] h-[50px]"></div>
          {/*left*/}{" "}
          <div className="skewed-45 bg-[#FFFFFF] absolute top-[50px] right-[24px] border-t-[0px] border-r-[0px] border-[#000000] border-[2px] h-[52px] w-[100px] rotate-z-45"></div>
          {/*right*/}
          <div className="bg-[#A66CFF] z-4 absolute top-[-34px] right-[-56px] rotate-z-[45deg] w-[130px] h-[104px] border-[2px] border-[#000000]"></div>
        </div>

        {/* Left trapezoid prism */}
        <div className="trapezoid-l z-2 w-[50px] h-[150px] absolute left-[0px] bottom-[0px]">
          {/*top*/}{" "}
          <div className="bg-[#000000] z-5 absolute rounded-[0px 0px 0px 4px] w-[50px] h-[100px]"></div>
          {/*right*/}
          <div className="skewed-45-reverse bg-[#A66CFF] absolute top-[27px] left-[50px] border-[#000000] border-b-[0px] border-l-[0px] border-[2px] h-[99px] w-[53px]"></div>
          {/*left*/}{" "}
          <div className="bg-[#FFFFFF] z-4 absolute top-[90px] right-[-36px] rotate-z-[45deg] w-[130px] h-[104px] border-[2px] border-[#000000]"></div>
        </div>

        {/* Center Base */}
        <div>
          <div className="absolute w-[100px] h-[100px] left-[50%] top-[50%] bg-[#000000] rounded-[4px]" />
          <div className="skewed-45 absolute bottom-[-3px] right-[11px] border-[#000000] border-[2px] z-1 h-[26px] w-[100px] rounded-tl-[4px] bg-[#FFFFFF]" />
          <div className="skewed-45-reverse absolute bottom-[11px] right-[-3px] border-[#000000] border-[2px] z-1 w-[26px] h-[100px] rounded-tl-[4px] bg-[#A66CFF]" />

          <div className="skewed-45-reverse absolute bottom-[28px] right-[6px] border-[#000000] border-[2px] z-1 w-[6px] h-[48px] rounded-[6px] bg-[#D1F601]" />
          <div className="skewed-45-reverse absolute bottom-[88px] right-[12px] border-[#000000] border-[2px] z-1 w-[6px] h-[6px] rounded-[6px] bg-[#D1F601]" />
          <div className="skewed-45-reverse absolute bottom-[90px] right-[2px] border-[#000000] border-[2px] z-1 w-[6px] h-[6px] rounded-[6px] bg-[#D1F601]" />
        </div>

        {/* Center Floating Cube */}
        <div className="animate-move-y">
          {/* Platform */}
          <div className="absolute z-5 w-[100px] h-[100px] left-[35%] top-[35%] bg-[#FFFFFF] border-[#000000] border-[2px] rounded-[4px]" />

          {/* Cube - TopFace */}
          <div className="absolute z-5 w-[55px] h-[55px] left-[18%] top-[18%] bg-[#FFFFFF] border-[#000000] border-[2px] rounded-[4px]" />

          {/* Cube - RightFace */}
          <div className="skewed-45-reverse absolute rounded-[4px] rounded-br-[0px] z-5 bg-[#FFFFFF] border-[#000000] border-[2px] top-[calc(18%+29px)] w-[55px] h-[55px] left-[calc(18%+59px)]" />
          <div className="skewed-45-reverse absolute z-6 bg-[#FFFFFF] border-[#000000] border-[2px] rounded-[4px] top-[calc(18%+20px)] w-[10px] h-[23px] left-[calc(18%+74px)]" />
          <div className="skewed-45-reverse absolute z-5 bg-[#FFFFFF] border-[#000000] border-[2px] rounded-[4px] top-[calc(18%+22px)] w-[10px] h-[23px] left-[calc(18%+70px)]" />

          {/* Cube - LeftFace */}
          <div className="skewed-45 absolute rounded-[4px] rounded-br-[1px] z-5 bg-[#000000] border-[#000000] border-[2px] top-[calc(18%+59px)] w-[55px] h-[55px] left-[calc(18%+30px)]" />
          <div className="skewed-45 absolute rounded-[40px] z-5 bg-[#FFFFFF] border-[#000000] border-[2px] top-[calc(17%+72px)] w-[40px] h-[40px] left-[calc(18%+38px)]" />
          <div className="skewed-45 absolute rounded-[35px] z-5 bg-[#FFFFFF] border-[#000000] border-[2px] top-[calc(18%+71px)] w-[35px] h-[35px] left-[calc(18%+40px)]" />
        </div>
      </div>

      <div className="absolute bg-[#C2C5CD] top-[-4px] translate-x-[-50%] left-[50%] m-auto w-[256px] h-[256px] rotate-x-50 rotate-z-45 rounded-[4px]" />
    </div>
  );
}
