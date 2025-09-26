import { useState } from "react";
import AssignmentForm from "./components/AssignmentForm";
import AssignmentList from "./components/AssignmentList";
import StatsChart from "./components/StatsChart";

import "./App.css";

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAdded = () => setRefreshKey((k) => k + 1);

  return (
    <div className="app-container">
      <div className="app-card">
        <h1 className="app-title">📚 StudyFlow</h1>
        <p className="app-subtitle">Quản lý bài tập – MERN demo</p>
        <AssignmentForm onSuccess={handleAdded} />
        <div className="app-divider" />
        <AssignmentList key={refreshKey} />
        <StatsChart refreshKey={refreshKey} />
      </div>
    </div>
  );
}
