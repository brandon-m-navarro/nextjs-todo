"use client";
import { useUserContext } from "@/app/contexts/UserContext";
import Image from "next/image";
import NavBar from "./navbar";
import { useState } from "react";

export default function Header() {
  const { isLoggedIn, login, username, logout } = useUserContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="max-w-6xl m-auto">
      {isLoggedIn ? (
        <div className="flex items-center no-wrap mb-[24px] h-[48px] border-box p-3">
          {isLoggedIn ? (
            <div
              className="relative cursor-pointer min-w-[150px] mr-[12px] h-[48px] w-fit"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            >
              <div className="w-full h-[48px] hover:bg-[#D4D4D4] rounded-md">
                <div className="flex items-center h-full ml-[12px]">
                  <Image
                    src={"user.svg"}
                    className="rounded-[999px] mr-[6px]"
                    alt="Profile Img"
                    width={24}
                    height={24}
                  />
                  <span className="text-[12px] text-black">{username}</span>
                </div>
              </div>

              {isOpen && (
                <div className="absolute left-0 top-[52px] w-full object-fit bg-[#FFF] border-[2px]">
                  <div>
                    <button
                      onClick={logout}
                      className="hover:bg-[#D4D4D4] w-full cursor-pointer"
                    >
                      <span className="text-black pl-[4px] leading-[48px] font-bold">
                        Logout
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              className="h-[38px] border-box px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              onClick={() => {
                console.log("Navigate to login");
                login("HARDCODED IN USERCONTEXT FOR NOW");
              }}
            >
              Login
            </button>
          )}

          <NavBar />
        </div>
      ) : (
        <NavBar />
      )}
    </div>
  );
}
