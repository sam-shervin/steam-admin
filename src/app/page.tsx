"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface UserData {
  email: string;
  name?: string;
  email_verified: boolean;
  picture?: string;
  isAdmin?: boolean;
}

const fetchUserData = async (): Promise<UserData | null> => {
  try {
    const res = await fetch("https://api.steams.social/self", {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch user data");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default function Page() {
  const [data, setData] = useState<UserData | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      const userData = await fetchUserData();
      console.log("userdata", userData);
      if (!userData) {
        console.log("Userdata is null");
        return;
      }
      if (!userData.isAdmin || !userData.email_verified) {
        console.log("User is not admin or email is not verified");
        return;
      }
      setData(userData);
    };

    getUserData();
  }, []);

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome Admin!</h1>
      <pre>{data.email}</pre>
    </div>
  );
}
