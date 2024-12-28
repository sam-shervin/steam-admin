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
    console.log("res", await res.json());
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
      if (!userData) {
        console.log("redirecting to login");
        return;
      }
      if (!userData.isAdmin || !userData.email_verified) {
        console.log("redirecting to home");
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
      <h1>My Data</h1>
      <pre>{data.email}</pre>
      <Link href="/page2">Go to Page 2</Link>
    </div>
  );
}
