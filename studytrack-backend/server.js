require('dotenv').config()

const express = require('express')
const cors = require('cors')

const db = require('./db')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
})

app.use('/api/auth', require('./routes/auth'))
app.use('/api/subjects', require('./routes/subjects'))
app.use('/api/attendance', require('./routes/attendance'))

app.listen(PORT, () => {
    console.log(`StudyTrack backend running on http://localhost:${PORT}`)
})