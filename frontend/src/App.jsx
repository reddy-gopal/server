import { Routes, Route } from 'react-router-dom';

import Summary from './components/alert';
import CpuUsage from './components/cpuusage';
import RamUsage from './components/ramusage';
import Server from './components/server/server';
import PrivateRoute from './components/PrivateRoute';
import { Login, Register } from './components/loginPage';
import './App.css';

const Dashboard = () => {
  return (
    <div>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gap: "20px",
        padding: "20px",
        height: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      {/* Left Column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div style={{ backgroundColor: "#fff", padding: "10px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
          <Summary />
        </div>

        <div style={{ backgroundColor: "#fff", padding: "10px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
          <h1>Cpu Usage</h1>
          <CpuUsage />
        </div>
      </div>

      {/* Right Column */}
      <div>
        <RamUsage />
      </div>
    </div>

      <div className="server-card">
        <div className="card-header">
          <h2>Active Instances</h2>
        </div>
        <Server />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default App;
