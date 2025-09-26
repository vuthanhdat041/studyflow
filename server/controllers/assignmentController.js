const Assignment = require("../models/Assignment");

// Parse sort query "deadline:asc,createdAt:desc" -> { deadline: 1, createdAt: -1 }
function parseSort(sortStr) {
  const sort = {};
  if (!sortStr) return sort;
  sortStr.split(",").forEach((pair) => {
    const [field, dir = "asc"] = pair.split(":");
    if (field) sort[field] = dir.toLowerCase() === "desc" ? -1 : 1;
  });
  return sort;
}

exports.createAssignment = async (req, res) => {
  try {
    const { subject, title, deadline, status } = req.body;
    if (!subject || !title || !deadline) {
      return res.status(400).json({ message: "Thiếu subject/title/deadline" });
    }
    const doc = await Assignment.create({
      subject: subject.trim(),
      title: title.trim(),
      deadline: new Date(deadline),
      status: status || "pending",
    });
    res.status(201).json(doc);
  } catch (err) {
    console.error("createAssignment error:", err);
    res.status(500).json({ message: "Tạo bài tập thất bại" });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const { subject, page = 1, limit = 5, sort } = req.query;
    const query = {};
    if (subject && subject.trim()) query.subject = new RegExp(subject.trim(), "i");

    const sortObj = parseSort(sort) || { deadline: 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Assignment.find(query).sort(sortObj).skip(skip).limit(Number(limit)),
      Assignment.countDocuments(query),
    ]);

    res.json({
      items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    console.error("getAssignments error:", err);
    res.status(500).json({ message: "Lấy danh sách thất bại" });
  }
};

exports.getAssignmentById = async (req, res) => {
  try {
    const item = await Assignment.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(item);
  } catch (err) {
    console.error("getAssignmentById error:", err);
    res.status(500).json({ message: "Lỗi lấy chi tiết" });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const { subject, title, deadline, status } = req.body;
    const data = {};
    if (subject !== undefined) data.subject = subject.trim();
    if (title !== undefined) data.title = title.trim();
    if (deadline !== undefined) data.deadline = new Date(deadline);
    if (status !== undefined) data.status = status;

    const updated = await Assignment.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(updated);
  } catch (err) {
    console.error("updateAssignment error:", err);
    res.status(500).json({ message: "Cập nhật thất bại" });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const deleted = await Assignment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy" });
    res.json({ message: "Đã xóa" });
  } catch (err) {
    console.error("deleteAssignment error:", err);
    res.status(500).json({ message: "Xóa thất bại" });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await Assignment.aggregate([
      {
        $group: {
          _id: "$subject",
          total: { $sum: 1 },
          done: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
        },
      },
      {
        $project: {
          subject: "$_id",
          total: 1,
          done: 1,
          pending: 1,
          percentDone: {
            $round: [
              { $multiply: [{ $divide: ["$done", "$total"] }, 100] },
              2,
            ],
          },
          _id: 0,
        },
      },
      { $sort: { subject: 1 } },
    ]);

    res.json(stats);
  } catch (err) {
    console.error("getStats error:", err);
    res.status(500).json({ message: "Lỗi thống kê" });
  }
};