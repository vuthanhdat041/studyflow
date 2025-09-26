import { useEffect, useMemo, useState } from "react";
import { api as axios } from "../api";
import "./AssignmentList.css";

export default function AssignmentList() {
  const [subject, setSubject] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({
    items: [],
    pagination: { page: 1, limit: 5, total: 0, totalPages: 1 },
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    subject: "",
    title: "",
    deadline: "",
    status: "pending",
  });

  const params = useMemo(
    () => ({
      subject: subject.trim() || undefined,
      page,
      limit: 5,
      sort: "deadline:asc",
    }),
    [subject, page]
  );

  const fetchData = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await axios.get("/api/assignments", { params });
      setData(res.data);
    } catch (error) {
      console.error("List error:", error?.response?.data || error.message);
      setErr("Không tải được danh sách.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      setPage(1);
      fetchData();
    }
  };

  const remove = async (id) => {
    if (!confirm("Xóa bài tập này?")) return;
    try {
      await axios.delete(`/api/assignments/${id}`);
      if (data.items.length === 1 && page > 1) setPage(page - 1);
      else fetchData();
    } catch (e) {
      alert("Xóa thất bại");
    }
  };

  // ==== Update logic ====
  const startEdit = (it) => {
    setEditId(it._id);
    setEditForm({
      subject: it.subject,
      title: it.title,
      deadline: new Date(it.deadline).toISOString().slice(0, 10),
      status: it.status,
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({ subject: "", title: "", deadline: "", status: "pending" });
  };

  const saveEdit = async () => {
    try {
      await axios.put(`/api/assignments/${editId}`, {
        subject: editForm.subject.trim(),
        title: editForm.title.trim(),
        deadline: new Date(editForm.deadline),
        status: editForm.status,
      });
      cancelEdit();
      fetchData();
    } catch (e) {
      alert("Cập nhật thất bại");
    }
  };

  const { items, pagination } = data;

  return (
    <div>
      <div className="al-search">
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Lọc theo môn học (Enter để tìm)"
          className="al-input"
        />
        <button
          onClick={() => {
            setPage(1);
            fetchData();
          }}
          className="al-btn al-btn-ghost"
        >
          Tìm
        </button>
      </div>

      {loading && <div className="al-loading">Đang tải…</div>}
      {err && <div className="al-error">{err}</div>}

      <ul className="al-list">
        {items.map((it) => (
          <li key={it._id} className="al-card">
            {editId === it._id ? (
              <div className="al-editform">
                <input
                  value={editForm.subject}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, subject: e.target.value }))
                  }
                  className="al-input"
                  placeholder="Môn học"
                />
                <input
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="al-input"
                  placeholder="Tiêu đề"
                />
                <input
                  type="date"
                  value={editForm.deadline}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, deadline: e.target.value }))
                  }
                  className="al-input"
                />
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, status: e.target.value }))
                  }
                  className="al-input"
                >
                  <option value="pending">pending</option>
                  <option value="done">done</option>
                </select>
                <div className="al-btnrow">
                  <button onClick={saveEdit} className="al-btn al-btn-primary">
                    Lưu
                  </button>
                  <button onClick={cancelEdit} className="al-btn al-btn-ghost">
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <div className="al-item">
                <div>
                  <div className="al-subject">{it.subject}</div>
                  <div className="al-title">{it.title}</div>
                  <div className="al-meta">
                    Hạn:{" "}
                    {new Date(it.deadline).toLocaleDateString("vi-VN")} · Trạng
                    thái:{" "}
                    <b
                      className={
                        it.status === "done" ? "al-status-done" : "al-status-pending"
                      }
                    >
                      {it.status}
                    </b>
                  </div>
                </div>
                <div className="al-btnrow">
                  <button onClick={() => startEdit(it)} className="al-btn al-btn-ghost">
                    ✏ Sửa
                  </button>
                  <button onClick={() => remove(it._id)} className="al-btn al-btn-danger">
                    Xóa
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="al-footer">
        <div className="al-pagination">
          Tổng: {pagination.total} — Trang {pagination.page}/
          {pagination.totalPages}
        </div>
        <div className="al-btnrow">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="al-btn al-btn-ghost"
          >
            ◀ Trước
          </button>
          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            className="al-btn al-btn-ghost"
          >
            Sau ▶
          </button>
        </div>
      </div>
    </div>
  );
}
