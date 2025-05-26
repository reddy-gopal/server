import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
} from "recharts";
import api from "../api/api";

const RamUsage = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          "/server/1/use/?start=2025-01-18T00:00:00Z&end=2025-06-20T23:59:59Z"
        );

        const data = Array.isArray(response.data) ? response.data : [response.data];

        const formattedData = data.map((item) => ({
          ...item,
          time: new Date(item.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      style={{
        height: "300px",
        width: "100%",
        padding: "15px",
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: "20px",
        paddingBottom: "20px"
      }}
    >
      {loading ? (
        <p style={{ textAlign: "center", color: "#888", fontSize: "16px" }}>
          Loading RAM usage data...
        </p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3694ff" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#3694ff" stopOpacity={0}/>
              </linearGradient>
            </defs>

            {/* Area should come BEFORE Line to ensure proper z-index */}
            <Area
              type="monotone"
              dataKey="ram"
              fill="url(#areaFill)"
              stroke="none"  // Remove area stroke
              activeDot={false}
            />

            <Line
              type="monotone"
              dataKey="ram"
              name="RAM Usage"
              stroke="#3694ff"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RamUsage;