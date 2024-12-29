"use client";

import { useState, useEffect } from "react";

interface Complaint {
  complaintUID: number;
  email: string;
  issue: string;
  user: {
    email: string;
    name?: string;
    email_verified: boolean;
    picture?: string;
    isAdmin?: boolean;
  };
  complaintAdmins: {
    status: ComplaintStatus;
    response?: string;
  }[];
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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-navy-500">
        Complaint Registry
      </h1>
      <ul className="space-y-4">
        {complaints.map((complaint) => (
          <li
            key={complaint.complaintUID}
            className="bg-gray-800 p-4 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold">{complaint.email}</h2>
            <p className="text-gray-400">{complaint.issue}</p>
            <div className="mt-2">
              <h3 className="text-lg font-semibold">User Details:</h3>
              <p className="text-gray-400">Name: {complaint.user.name}</p>
              <p className="text-gray-400">
                Email Verified: {complaint.user.email_verified ? "Yes" : "No"}
              </p>
              <p className="text-gray-400">
                Admin: {complaint.user.isAdmin ? "Yes" : "No"}
              </p>
              <img
                src={complaint.user.picture}
                alt={complaint.user.name}
                className="w-16 h-16 rounded-full mt-2"
              />
            </div>
            <div className="mt-2">
              <h3 className="text-lg font-semibold">Admin Responses:</h3>
              {complaint.complaintAdmins.map((admin, index) => (
                <div key={`${complaint.complaintUID}-${index}`} className="mt-2">
                  <p className="text-gray-400">Status: {admin.status}</p>
                  <p className="text-gray-400">Response: {admin.response}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setSelectedComplaint(complaint.complaintUID)}
              className="mt-2 bg-navy-500 hover:bg-navy-600 text-white py-2 px-4 rounded-md"
            >
              Update Status
            </button>
          </li>
        ))}
      </ul>
      {selectedComplaint !== null && (
        <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            Update Complaint Status
          </h2>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
            className="w-full p-2 mb-4 bg-gray-700 text-white rounded-md"
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
            className="w-full p-2 mb-4 bg-gray-700 text-white rounded-md"
          />
          <button
            onClick={() => updateComplaintStatus(selectedComplaint)}
            className="bg-navy-500 hover:bg-navy-600 text-white py-2 px-4 rounded-md"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default ComplaintRegistryPage;
