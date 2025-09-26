import { useEffect, useState } from "react";
import { api as axios } from "../api";
import "./StatsChart.css";

export default function StatsChart() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const fetchStats = async () => {
    setLoading(true); setErr("");
    try {
      const res = await axios.get("/api/assignments/stats");
      setStats(res.data);
    } catch (e) {
      console.error("Stats error:", e);
      setErr("Không tải được thống kê.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  return (
    <div className="sc-card">
      <h2 className="sc-title">📊 Thống kê tiến độ theo môn</h2>
      {loading && <div className="sc-loading">Đang tải…</div>}
      {err && <div className="sc-error">{err}</div>}
      {!loading && !err && (
        <table className="sc-table">
          <thead>
            <tr>
              <th>Môn học</th>
              <th>Tổng</th>
              <th>Hoàn thành</th>
              <th>Chưa xong</th>
              <th>% Hoàn thành</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => (
              <tr key={s.subject}>
                <td>{s.subject}</td>
                <td>{s.total}</td>
                <td>{s.done}</td>
                <td>{s.pending}</td>
                <td>{s.percentDone}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
