"use client";

import { useState, useEffect } from "react";

interface Complaint {
  complaintUID: number;
  email: string;
  issue: string;
  user: {
    email: string;
    name: string;
    email_verified: boolean;
    picture: string;
    isAdmin: boolean;
  };
}

enum ComplaintStatus {
  RESOLVED = "RESOLVED",
  PENDING = "PENDING",
  NOT_VIEWED = "NOT_VIEWED",
}

const ComplaintRegistryPage = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<number | null>(
    null
  );
  const [status, setStatus] = useState<ComplaintStatus | "">("");
  const [response, setResponse] = useState<string>("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch("https://api.steams.social/complaints", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch complaints");
        setComplaints(await res.json());
      } catch (error) {
        console.error(error);
      }
    };

    fetchComplaints();
  }, []);

  const updateComplaintStatus = async (complaintUID: number) => {
    try {
      const res = await fetch("https://api.steams.social/complaintStatus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ complaintUID, status, response }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update complaint status");
      alert("Complaint status updated successfully!");
      setStatus("");
      setResponse("");
      setSelectedComplaint(null);
      // Refresh complaints list
      const updatedComplaints = await fetch(
        "https://api.steams.social/complaints",
        {
          credentials: "include",
        }
      ).then((res) => res.json());
      setComplaints(updatedComplaints);
    } catch (error) {
      console.error(error);
      alert("Error updating complaint status");
    }
  };

  return (
    <div>
      <h1>Complaint Registry</h1>
      <ul>
        {complaints.map((complaint) => (
          <li key={complaint.complaintUID}>
            <h2>{complaint.email}</h2>
            <p>{complaint.issue}</p>
            <button
              onClick={() => setSelectedComplaint(complaint.complaintUID)}
            >
              Update Status
            </button>
          </li>
        ))}
      </ul>
      {selectedComplaint !== null && (
        <div>
          <h2>Update Complaint Status</h2>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
          >
            <option value="">Select Status</option>
            <option value={ComplaintStatus.NOT_VIEWED}>NOT_VIEWED</option>
            <option value={ComplaintStatus.PENDING}>PENDING</option>
            <option value={ComplaintStatus.RESOLVED}>RESOLVED</option>
          </select>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Add a response"
          />
          <button onClick={() => updateComplaintStatus(selectedComplaint)}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default ComplaintRegistryPage;
