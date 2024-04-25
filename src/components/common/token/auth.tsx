import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";

// Function to set access token in localStorage
export const setAccessToken = (token: string) => {
  const currentTime = new Date();
  localStorage.setItem("access_token_timestamp", currentTime.toString());
  localStorage.setItem("accessToken", token);
};

export const handleLogout = () => {
  // Clear the access token from localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("access_token_timestamp");
  localStorage.removeItem("User_Id");
};

interface UserInfo {
  userRole?: string;
  userId?: string;
}

export const getUserInfoFromToken = (accessToken: string): UserInfo | null => {
  if (accessToken) {
    try {
      const decodedToken: any = jwt.decode(accessToken);
      const userRole = decodedToken?.role as string | undefined; // Extract 'role' from the decoded token
      const userId = decodedToken?.userId as string | undefined; // Extract 'userId' from the decoded token
      return { userRole, userId };
    } catch (error) {
      console.error("Error decoding token:", error);
      return null; // Return null if there's an error decoding the token
    }
  }
  return null; // Return null if the token is not available
};
