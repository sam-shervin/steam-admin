"use client";

import { useState } from "react";

const MakeAdminPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const promoteUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.steams.social/promoteUser", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to promote user");
      alert("User promoted successfully!");
      setEmail("");
    } catch (error) {
      console.error(error);
      alert("Error promoting user");
    }
    setLoading(false);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center gap-4">
      <input
        type="email"
        placeholder="Enter email to promote"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-2xl text-6xl border px-6 py-2 text-black font-light w-[60vw]"
      />
      <button
        onClick={promoteUser}
        disabled={loading}
        className={`rounded-2xl text-6xl border px-6 py-2 ${
          loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {loading ? "Processing..." : "POST"}
      </button>
    </div>
  );
};

export default MakeAdminPage;
