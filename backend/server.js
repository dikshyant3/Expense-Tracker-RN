import express from 'express'
import dotenv from 'dotenv'
import {sql} from "./config/db.js"
import rateLimiter from './middleware/rateLimiter.js'

import transactionsRoute from './routes/transactionsRoute.js'


const app = express()

// middleware
app.use(rateLimiter)
app.use(express.json())

dotenv.config()

const PORT = process.env.PORT || 5001



async function initDatabase() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1); // Exit the process if database initialization fails
    }
}

app.get('/', (req, res) => {
    res.send('Welcome to the Expense Tracker API')
})

app.use("/api/transactions", transactionsRoute)

initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
})})



// Make sure to add transaction summary in the postman collection

