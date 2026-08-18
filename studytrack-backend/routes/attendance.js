const express = require("express");
const router = express.Router();
const db = require("../db");
const { requireAuth } = require("../middleware/requireAuth");

router.use(requireAuth);

router.post("/", (req, res) => {
    const { subjectId, date, status } = req.body;

    if (!subjectId || !date || !status) {
        return res.status(400).json({
            error: "subjectId, date, and status are required"
        });
    }

    if (new Date(date) > new Date()) {
        return res.status(400).json({
            error: "Cannot mark attendance for a future date"
        });
    }

    db.prepare(
        "INSERT INTO attendance (subject_id, user_id, date, status) VALUES (?, ?, ?, ?)"
    ).run(subjectId, req.userId, date, status);

    res.json({ success: true });
});

router.get("/:subjectId", (req, res) => {
    const records = db.prepare(
        "SELECT date, status FROM attendance WHERE subject_id = ? AND user_id = ? ORDER BY date"
    ).all(req.params.subjectId, req.userId);

    res.json({ records });
});

module.exports = router;