import React, { useState, useEffect } from "react";
import api from "../api/api";

const CpuUsage = () => {
  const [cpuUsage, setCpuUsage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/server/1/usage/");
        if (response.data && Array.isArray(response.data) && response.data[0]) {
          setCpuUsage(response.data[0].cpu_usage_percent);
        } else {
          console.warn("Unexpected response format", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch CPU usage:", error);
        setCpuUsage(0);
      }
    };

    fetchData();
  }, []);

  const angle = (cpuUsage / 100) * 180 - 90;
  const gaugeWidth = 15;
  const radius = 100;
  const circumference = Math.PI * radius;
  const greenEnd = circumference * 0.4;
  const orangeEnd = circumference * 0.3;
  const redEnd = circumference * 0.3;

  return (
    <>
    
    <div
      className="gauge-container"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <svg
        viewBox="0 0 300 200"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background arc */}
        <path
          d="M50 150 A100 100 0 0 1 250 150"
          fill="none"
          stroke="#e0e0e0"
          strokeWidth={gaugeWidth}
        />
        {/* Green Zone */}
        <path
          d="M50 150 A100 100 0 0 1 250 150"
          fill="none"
          stroke="#4CAF50"
          strokeWidth={gaugeWidth}
          strokeDasharray={`${greenEnd} ${circumference - greenEnd}`}
        />
        {/* Orange Zone */}
        <path
          d="M50 150 A100 100 0 0 1 250 150"
          fill="none"
          stroke="#FF9800"
          strokeWidth={gaugeWidth}
          strokeDasharray={`${orangeEnd} ${circumference - orangeEnd}`}
          strokeDashoffset={`-${greenEnd}`}
        />
        {/* Red Zone */}
        <path
          d="M50 150 A100 100 0 0 1 250 150"
          fill="none"
          stroke="#F44336"
          strokeWidth={gaugeWidth}
          strokeDasharray={`${redEnd} ${circumference - redEnd}`}
          strokeDashoffset={`-${greenEnd + orangeEnd}`}
        />

        {/* Needle center and line */}
        <circle cx="150" cy="150" r="6" fill="#2c3e50" />
        <line
          x1="150"
          y1="150"
          x2="150"
          y2="70"
          stroke="#2c3e50"
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${angle}, 150, 150)`}
          style={{ transition: "transform 0.6s ease-in-out" }}
        />

        {/* Percentage text */}
        <text
          x="150"
          y="180"
          textAnchor="middle"
          fontSize="18"
          fontWeight="600"
          fill="#2c3e50"
        >
          {cpuUsage}%
        </text>

        {/* Labels */}
        <text x="55" y="145" fontSize="12" fill="#4CAF50">0%</text>
        <text x="145" y="65" fontSize="12" fill="#FF9800">40%</text>
        <text x="235" y="145" fontSize="12" fill="#F44336">100%</text>
      </svg>
    </div>
    </>
  );
};

export default CpuUsage;
