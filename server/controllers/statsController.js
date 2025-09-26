const Assignment = require("../models/Assignment");

// GET /api/stats/progress
exports.progressBySubject = async (_req, res) => {
  try {
    const result = await Assignment.aggregate([
      {
        $group: {
          _id: "$subject",
          total: { $sum: 1 },
          done:  { $sum: { $cond: [{ $eq: ["$status","done"] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ["$status","in-progress"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status","pending"] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          subject: "$_id",
          total: 1,
          done: 1,
          inProgress: 1,
          pending: 1,
          progress: {
            $cond: [
              { $eq: ["$total", 0] },
              0,
              { $multiply: [{ $divide: ["$done", "$total"] }, 100] }
            ]
          }
        }
      },
      { $sort: { subject: 1 } }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
