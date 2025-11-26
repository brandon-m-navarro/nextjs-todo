type Props = {
  className?: string;
};

/**
 * 3D checkmark with rounded edges.
 */
export default function ThreeDCheck({
  className = "",
}: Props) {
  return (
    <div
      className={`relative perspective-distant w-[50px] h-[10px] translate-x-[100px] translate-y-[56px] z-11 ${className}`}
    >
      <div className="w-[50px] h-[10px] relative preserve-3d animate-rotate">
        {/* Create 3d prism */}
        <div className="w-[50px] h-[16px] relative r-rect preserve-3d">
            <div className="absolute border-[#000] border-1 r-rect-front w-[50px] h-[16px] bg-[#55A603] z-10"></div>
            <div className="absolute border-[#000] border-1 r-rect-back w-[50px] h-[16px] bg-[#55A603] z-10 "></div>

            <div className="absolute r-rect-back check-front bg-[#55A603]"></div>


            <div className="absolute border-[#000] border-1 r-rect-left w-[16px] h-[16px] bg-[#55A603] z-10"></div>
            <div className="absolute border-[#000] border-1 r-rect-right w-[16px] h-[16px] bg-[#55A603] z-10"></div>

            <div className="absolute border-[#000] border-1 r-rect-top w-[50px] h-[16px] bg-[#55A603] z-10"></div>
            <div className="absolute border-[#000] border-1 r-rect-bottom w-[50px] h-[16px] bg-[#55A603] z-10"></div>
        </div>

        {/* Create a nother 3d prism, but shorter and rotated to form a checkmark */}
        <div className="w-[50px] h-[16px] relative preserve-3d l-rect">
            <div className="absolute border-[#000] border-1 l-rect-front w-[35px] h-[16px] bg-[#55A603] z-10"></div>
            <div className="absolute border-[#000] border-1 l-rect-back w-[35px] h-[16px] z-10 bg-[#55A603]"></div>

            <div className="absolute l-rect-back check-back bg-[#55A603]"></div>


            <div className="absolute border-[#000] border-1 l-rect-left w-[16px] h-[16px] bg-[#55A603] z-10"></div>
            <div className="absolute border-[#000] border-1 l-rect-right w-[16px] h-[16px] bg-[#55A603] z-10"></div>

            <div className="absolute check-side bg-[#55A603]"></div>

            <div className="absolute border-[#000] border-1 l-rect-top w-[35px] h-[16px] bg-[#55A603] z-10"></div>
            <div className="absolute border-[#000] border-1 l-rect-bottom w-[35px] h-[16px] bg-[#55A603] z-10"></div>
        </div>

      </div>
    </div>
  );
}
