import express from 'express'
import dotenv from 'dotenv'
import {initDatabase} from "./config/db.js"
import rateLimiter from './middleware/rateLimiter.js'

import transactionsRoute from './routes/transactionsRoute.js'


const app = express()

// middleware
app.use(rateLimiter)
app.use(express.json())

dotenv.config()

const PORT = process.env.PORT || 5001


app.get('/health-check', (req, res) => {
    res.send('Welcome to the Expense Tracker API')
})

app.use("/api/transactions", transactionsRoute)

initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
})})



// Make sure to add transaction summary in the postman collection

