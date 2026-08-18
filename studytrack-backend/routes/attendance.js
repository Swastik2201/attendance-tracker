const express = require('express')
const router = express.Router()

const db = require('../db')
const { requireAuth } = require('../middleware/requireAuth')

router.use(requireAuth)

// POST /api/attendance
router.post('/', (req, res) => {
    const { subjectId, date, status } = req.body

    // Validation
    if (!subjectId || !date || !status) {
        return res.status(400).json({
            error: 'subjectId, date, and status are required'
        })
    }

    // Validate status
    if (status !== 'present' && status !== 'absent') {
        return res.status(400).json({
            error: "status must be 'present' or 'absent'"
        })
    }

    // Prevent future attendance
    if (new Date(date) > new Date()) {
        return res.status(400).json({
            error: 'Cannot mark attendance for a future date'
        })
    }

    try {
        const result = db.prepare(
            `INSERT INTO attendance
            (subject_id, user_id, date, status)
            VALUES (?, ?, ?, ?)`
        ).run(subjectId, req.userId, date, status)

        res.json({
            success: true,
            id: result.lastInsertRowid
        })
    } catch (err) {
        console.error(err)

        res.status(400).json({
            error: 'Could not mark attendance'
        })
    }
})

// GET /api/attendance/:subjectId
router.get('/:subjectId', (req, res) => {
    try {
        const records = db.prepare(
            `SELECT date, status
             FROM attendance
             WHERE subject_id = ?
             AND user_id = ?
             ORDER BY date`
        ).all(req.params.subjectId, req.userId)

        res.json({ records })
    } catch (err) {
        console.error(err)

        res.status(500).json({
            error: 'Could not fetch attendance'
        })
    }
})

module.exports = router