"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

const redirectToLogin = (router: ReturnType<typeof useRouter>) => {
  //router.push("https://api.steams.social/login");
};

const redirectToHome = (router: ReturnType<typeof useRouter>) => {
  //router.push("https://steams.social");
};

export default function Page() {
  const router = useRouter();
  const [data, setData] = useState<UserData | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      const userData = await fetchUserData();
      if (!userData) {
        redirectToLogin(router);
        return;
      }
      if (!userData.isAdmin || !userData.email_verified) {
        redirectToHome(router);
        return;
      }
      setData(userData);
    };

    getUserData();
  }, [router]);

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


