import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import api from "../api/api"; // Adjust this import path as needed

const COLORS = ["#FF4C4C", "#FFA500", "#00C49F"]; // Critical, Medium, Low

const Summary = () => {
  const [alertData, setAlertData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/server/1/alerts/summary/");
        const data = response.data;

        const formattedData = [
          { name: "Critical", value: data.critical || 0 },
          { name: "Medium", value: data.medium || 0 },
          { name: "Low", value: data.low || 0 },
        ];

        setAlertData(formattedData);
      } catch (err) {
        console.error("Error fetching alert data:", err);
        setError("Failed to load alert summary");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <>
    <h1 className="text-center">Alert Summary</h1>
     <div style={{
      backgroundColor: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "120",
      padding: "5px"
    }}>
      
      {/* Pie Chart */}
      <div style={{ width: "100px", height: "100px" }} className="alert-summary-container">
        {loading ? (
          <p style={{ fontSize: "12px" }}>Loading...</p>
        ) : error ? (
          <p style={{ fontSize: "12px", color: "red" }}>{error}</p>
        ) : (
          <PieChart width={80} height={80}>
            <Pie
              data={alertData}
              cx="50%"
              cy="50%"
              innerRadius={10}
              outerRadius={30}
              dataKey="value"
            >
              {alertData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )}
      </div>

      {/* Legend */}
      <div style={{ marginLeft: "8px", fontSize: "12px" }}>
        {alertData.map((entry, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: COLORS[index % COLORS.length],
                marginRight: "8px",
                borderRadius: "2px"
              }}
            />
            <span>{entry.name}: {entry.value}</span>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Summary;
