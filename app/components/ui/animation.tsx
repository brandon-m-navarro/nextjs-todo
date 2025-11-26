import ThreeDCheck from "./3d-check";

export default function SimpleAnimation() {
  return (
    <div className="animation-container mt-[24px] h-[250px] w-[250px] relative">

      {/* Rotating 3D Checkmark */}
      <ThreeDCheck />

      <div className="bg-[#F2BA52] z-1 absolute overflow-hidden translate-x-[-50%] left-[50%] w-[250px] h-[250px] rotate-x-50 rotate-z-45 rounded-[4px] border-t-[2px] border-l-[2px] border-[#000000]">
        {/* Right trapezoid prism */}
        <div className="trapezoid-r z-2 w-[150px] h-[50px] absolute right-[0px]">
          {/*top*/}
          <div className="bg-[#000000] z-5 absolute rounded-[0px 0px 0px 4px] w-[100px] h-[50px]"></div>
          {/*left*/}
          <div className="bg-[#FFFFFF] skewed-45 absolute top-[50px] right-[24px] border-t-[0px] border-r-[0px] border-[#000000] border-[2px] h-[52px] w-[100px] rotate-z-45"></div>
          {/*right*/}
          <div className="bg-[#9130F2] z-4 absolute top-[-34px] right-[-56px] rotate-z-[45deg] w-[130px] h-[104px] border-[2px] border-[#000000]"></div>
        </div>

        {/* Left trapezoid prism */}
        <div className="trapezoid-l z-2 w-[50px] h-[150px] absolute left-[0px] bottom-[0px]">
          {/*top*/}
          <div className="bg-[#000000] z-5 absolute rounded-[0px 0px 0px 4px] w-[50px] h-[100px]"></div>
          {/*right*/}
          <div className="bg-[#9130F2] skewed-45-reverse absolute top-[27px] left-[50px] border-[#000000] border-b-[0px] border-l-[0px] border-[2px] h-[99px] w-[53px]"></div>
          {/*left*/}
          <div className="bg-[#FFFFFF] z-4 absolute top-[90px] right-[-36px] rotate-z-[45deg] w-[130px] h-[104px] border-[2px] border-[#000000]"></div>
        </div>

        {/* Center Base */}
        <div>
          <div className="bg-[#000000] absolute w-[100px] h-[100px] left-[50%] top-[50%] rounded-[2px]" />
          <div className="bg-[#FFFFFF] skewed-45 absolute bottom-[0px] right-[12px] border-[#000000] border-[2px] z-1 h-[26px] w-[100px] rounded-[2px] rounded-bl-[0px]" />
          <div className="bg-[#9130F2] skewed-45-reverse absolute bottom-[12px] right-[0px] border-[#000000] border-[2px] z-1 w-[26px] h-[100px] rounded-[2px] rounded-tr-[0px]" />

          <div className="bg-[#F27127] skewed-45-reverse absolute bottom-[28px] right-[6px] border-[#000000] border-[2px] z-1 w-[6px] h-[48px] rounded-[2px]" />
          <div className="bg-[#D1F601] skewed-45-reverse absolute bottom-[88px] right-[12px] border-[#000000] border-[2px] z-1 w-[6px] h-[6px] rounded-[1px]" />
          <div className="bg-[#D1F601] skewed-45-reverse absolute bottom-[90px] right-[4px] border-[#000000] border-[2px] z-1 w-[6px] h-[6px] rounded-[1px]" />
        </div>

        {/* Center Floating Cube */}
        <div className="animate-move-y">
          {/* Platform */}
          <div className="bg-[#FFFFFF] absolute z-5 w-[100px] h-[100px] left-[35%] top-[35%] border-[#000000] border-[2px] rounded-[4px]" />

          {/* Cube - TopFace */}
          <div className="bg-[#FFFFFF] absolute z-5 h-[55px] w-[56px] left-[50px] top-[51px] border-[#000000] border-[2px] rounded-tl-[1px] rounded-tr-[3px] rounded-br-[1px] rounded-bl-[3px]" />

          <div className="bg-[#a9a9a9] absolute z-6 w-[48px] h-[46px] left-[53px] top-[55px] border-[#000000] border-[2px] rounded-tl-[1px] rounded-tr-[3px] rounded-br-[1px] rounded-bl-[3px]" />

          {/* Cube - RightFace */}
          <div className="bg-[#9130F2] skewed-45-reverse absolute z-5 border-[#000000] border-[2px] top-[77px] w-[56px] h-[56px] left-[103px] rounded-tl-[4px] rounded-tr-[1px] rounded-br-[4px] rounded-bl-[0px]" />
          <div className="bg-[#f27127] skewed-45-reverse absolute z-6 border-[#000000] border-[2px] rounded-[4px] top-[calc(18%+20px)] w-[10px] h-[23px] left-[calc(18%+74px)]" />
          <div className="bg-[#000000] skewed-45-reverse absolute z-5 border-[#000000] border-[2px] rounded-[4px] top-[calc(18%+22px)] w-[10px] h-[23px] left-[calc(18%+70px)]" />

          {/* Cube - LeftFace */}
          <div className="bg-[#FFF] skewed-45 absolute z-5 border-[#000000] border-[2px] top-[103px] w-[56px] h-[56px] left-[76px] rounded-tl-[3px] rounded-tr-[0px] rounded-br-[3px] rounded-bl-[2px]" />

          <div className="bg-[#f27127] skewed-45 absolute z-5 border-[#000000] border-[2px] top-[135px] left-[89px] w-[53px] h-[15px] rounded-[0px] border-[7px] border-l-width-[4px] border-r-width-[4px]" />

          <div className="bg-[#000000] skewed-45 absolute rounded-[40px] z-5 border-[#000000] border-[1px] w-[15px] h-[15px] left-[74px] top-[114px]" />
          <div className="bg-[#FFF] skewed-45 absolute rounded-[35px] z-5 border-[#000000] border-[1px] w-[5px] h-[5px] left-[77px] top-[116px]" />

          <div className="bg-[#000000] skewed-45 absolute rounded-[40px] z-5 border-[#000000] border-[1px] w-[15px] h-[15px] left-[93px] top-[114px]" />
          <div className="bg-[#FFF] skewed-45 absolute rounded-[35px] z-5 border-[#000000] border-[1px] w-[5px] h-[5px] left-[97px] top-[116px]" />

          <div className="bg-[#000000] skewed-45 absolute rounded-[40px] z-5 border-[#000000] border-[1px] w-[15px] h-[15px] left-[93px] top-[114px]" />
          <div className="bg-[#FFF] skewed-45 absolute rounded-[35px] z-5 border-[#000000] border-[1px] w-[5px] h-[5px] left-[97px] top-[116px]" />
        </div>
      </div>

      <div className="absolute bg-[#C2C5CD] top-[-4px] translate-x-[-50%] left-[50%] m-auto w-[256px] h-[256px] rotate-x-50 rotate-z-45 rounded-[4px]" />
    </div>
  );
}
