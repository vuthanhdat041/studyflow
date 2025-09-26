import { useState } from "react";
import { api as axios } from "../api";
import "./AssignmentForm.css";

export default function AssignmentForm({ onSuccess }) {
  const [form, setForm] = useState({ subject: "", title: "", deadline: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const handleChange = (e) => {
    setErr(""); setOk("");
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setErr(""); setOk("");
    try {
      await axios.post("/api/assignments", {
        subject: form.subject.trim(),
        title: form.title.trim(),
        deadline: new Date(form.deadline),
        status: "pending",
      });
      setForm({ subject: "", title: "", deadline: "" });
      setOk("✅ Đã thêm bài tập!");
      onSuccess?.();
    } catch (error) {
      console.error("Create error:", error?.response?.data || error.message);
      setErr(error?.response?.data?.message || "Không thể thêm bài tập.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="af-form">
      <div className="af-row-2">
        <input
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Môn học (VD: Toán rời rạc)"
          required
          className="af-input"
        />
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Tiêu đề bài tập"
          required
          className="af-input"
        />
      </div>
      <div className="af-row-btn">
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          required
          className="af-input"
        />
        <button
          type="submit"
          disabled={loading}
          className={`af-btn ${loading ? "af-btn-loading" : ""}`}
        >
          {loading ? "Đang thêm..." : "➕ Thêm"}
        </button>
      </div>

      {ok && <div className="af-ok">{ok}</div>}
      {err && <div className="af-err">{err}</div>}
    </form>
  );
}
