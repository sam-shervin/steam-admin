"use client";

import { useState, useEffect } from "react";

/*
app.get("/complaints", async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const adminUser = req.oidc.user.email;

  // Check if user is an admin
  const isAdmin = await prisma.user.findUnique({
    where: { email: adminUser },
  }).isAdmin;

  if (!isAdmin) {
    return res.status(403).json({ error: "Not authorized" });
  }

  const complaints = await prisma.complaint.findMany({
    include: { user: true },
  });

  res.status(200).json(complaints);
});

write complaints type interface
*/

const ComplainRegistryPage = () => {
  // show all the complaints
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch("https://api.steams.social/complaints", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch complaints");
        console.log(await res.json());
        setComplaints(await res.json());
        console.log(complaints);
      } catch (error) {
        console.error(error);
      }
    };

    fetchComplaints();
  }, []);
};

export default ComplainRegistryPage;
