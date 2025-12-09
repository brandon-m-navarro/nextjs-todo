"use client";
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

interface UserContextType {
  isLoggedIn: boolean;
  userId: string | null;
  username: string | null;
  login: () => Promise<void>;
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

  const login = async () => {
    await authClient.signIn.social({
      provider: "bnav-oidc", // Matches your auth.ts configuration
      callbackURL: "/projects", // Optional redirect after login
    });
  };

  const logout = async () => {
    setIsLoggedIn(false);
    setUserId(null);
    setUsername(null);
  };

  // Fetch user authentication status on mount
  useEffect(() => {
    // Check authentication status from betterauth
    const authenticate = async function () {
      const { data: session, error } = await authClient.getSession();

      if (error) {
        alert('Error authenticating user: ' + error.message);
      }

      if (session?.user) {
        setIsLoggedIn(true);
        setUserId(session.user.id);
        setUsername(session.user.name);
      }
    };

    authenticate();
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
