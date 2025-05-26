import React, { useState, useEffect } from "react";
import api from "../../api/api";
import './Server.css';

const Server = () => {
  const [serverData, setServerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/servers/");
        if (Array.isArray(response.data)) {
          setServerData(response.data);
        } else {
          throw new Error("Expected array but got non-array");
        }
      } catch (err) {
        console.error("Error fetching server data:", err);
        setError("Failed to load server data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const units = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (let unit of units) {
      const count = Math.floor(diffInSeconds / unit.seconds);
      if (count > 0) {
        return `${count} ${unit.label}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  };

  if (loading) {
    return <div className="server-container">Loading servers...</div>;
  }

  if (error) {
    return <div className="server-container error">{error}</div>;
  }

  return (
    <div className="server-container">
      <div className="table-header">
        <h2>Active Instances</h2>
        <span className="server-count">{serverData.length} servers</span>
      </div>

      <div className="table-wrapper">
        <table className="server-table">
          <thead>
            <tr>
              <th className="col-server">Servers</th>
              <th className="col-ip">IP Address</th>
              <th className="col-created">Created</th>
              <th className="col-tag">Tag</th>
              <th className="col-provider">Provider</th>
            </tr>
          </thead>
          <tbody>
            {serverData.map((server, index) => (
              <tr key={index}>
                <td>
                  <div className="server-info">
                    <div className="avatar">
                      <i className="fa-solid fa-server"></i>
                    </div>
                    <div className="server-details">
                      <div className="server-name">{server.name}</div>
                      <div className="server-description">{server.details}</div>
                    </div>
                  </div>
                </td>
                <td>{server.ip_address}</td>
                <td className="created-time">{getRelativeTime(server.created)}</td>
                <td>
                  <span className={`tag ${server.tag?.toLowerCase()}`}>
                    {server.tag}
                  </span>
                </td>
                <td className="provider">
                  <span className="provider-badge">{server.location}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Server;
