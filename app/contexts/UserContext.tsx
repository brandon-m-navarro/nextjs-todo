"use client";
import React, { createContext, useState, ReactNode, useEffect } from "react";

interface UserContextType {
  isLoggedIn: boolean;
  userId: string | null;
  username: string | null;
  login: (userId: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const login = async (userId: string) => {
    // Implement login logic with betterauth
    console.log("Logging in user:", userId);
    // Just set hardcoded userID for now
    setIsLoggedIn(true);
    setUserId("wGKGJLpiPKkRQxBITC2K6OpxHfSpQkFS");
    setUsername("Brandon");
  };

  const logout = async () => {
    setIsLoggedIn(false);
    setUserId(null);
  };

  // Fetch user authentication status on mount
  useEffect(() => {
    // Check authentication status from betterauth
  }, []);

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        userId,
        username,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
