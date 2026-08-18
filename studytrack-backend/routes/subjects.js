const express = require('express')
const router = express.Router()

const db = require('../db')
const { requireAuth } = require('../middleware/requireAuth')

router.use(requireAuth)

// GET all subjects for logged-in user
router.get('/', (req, res) => {
    const subjects = db
        .prepare('SELECT * FROM subjects WHERE user_id = ?')
        .all(req.userId)

    res.json({ subjects })
})

// POST a new subject
router.post('/', (req, res) => {
    const { name } = req.body

    if (!name) {
        return res.status(400).json({
            error: 'name is required'
        })
    }

    const result = db
        .prepare('INSERT INTO subjects (user_id, name) VALUES (?, ?)')
        .run(req.userId, name)

    res.json({
        id: result.lastInsertRowid,
        name
    })
})

// DELETE a subject
router.delete('/:id', (req, res) => {
    db.prepare(
        'DELETE FROM subjects WHERE id = ? AND user_id = ?'
    ).run(req.params.id, req.userId)

    res.json({
        success: true
    })
})

module.exports = router