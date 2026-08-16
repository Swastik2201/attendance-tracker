const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const db = require("../db");

// ==================== SIGNUP ====================

router.post("/signup", async (req, res) => {
    const {
        name,
        rollNo,
        class: className,
        email,
        password
    } = req.body;

    // Check required fields
    if (!name || !rollNo || !className || !email || !password) {
        return res.status(400).json({
            error: "name, rollNo, class, email, and password are required"
        });
    }

    try {
        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert user into database
        const insert = db.prepare(`
            INSERT INTO users
            (name, roll_no, class, email, password_hash)
            VALUES (?, ?, ?, ?, ?)
        `);

        const result = insert.run(
            name,
            rollNo,
            className,
            email,
            passwordHash
        );

        // Generate JWT
        const token = jwt.sign(
            {
                userId: result.lastInsertRowid
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            token,
            name
        });

    } catch (error) {
        console.error(error);

        res.status(400).json({
            error: "Email already in use"
        });
    }
});

// ==================== LOGIN ====================

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = db
        .prepare("SELECT * FROM users WHERE email = ?")
        .get(email);

    if (!user) {
        return res.status(401).json({
            error: "Invalid email or password"
        });
    }

    // Check password
    const valid = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!valid) {
        return res.status(401).json({
            error: "Invalid email or password"
        });
    }

    // Generate JWT
    const token = jwt.sign(
        {
            userId: user.id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    res.json({
        token,
        name: user.name
    });
});

module.exports = router;