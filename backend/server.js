import express from 'express'
import dotenv from 'dotenv'
import {sql} from "./config/db.js"


const app = express()

// middleware
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

initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
})})

app.get('/', (req, res) => {
    res.send('Welcome to the Expense Tracker API')
})

app.get("/api/transactions/:userId", async(req, res) => {
    try {
        const {userId} = req.params;
        const transaction = await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;
        res.status(200).json(transaction);
    }
    catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
})

app.post("/api/transactions", async(req, res) => {
    try{
    const {user_id, title, amount, category} = req.body;
    if (!user_id || !title || !category || amount === undefined) {
        return res.status(400).json({error: "All fields are required"});
    }
    const transactions = await sql`
        INSERT INTO transactions (user_id, title, amount, category) VALUES
        (${user_id}, ${title}, ${amount}, ${category})
        RETURNING *`;

    console.log("Transaction created:", transactions);
    res.status(201).json(transactions[0]);
    }
    catch (error){
        console.error("Error creating transaction:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
})

app.delete("/api/transactions/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const result = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;
        if (result.length === 0 ){
            return res.status(404).json({error: "Transaction not found!!!"});
        }
        return res.status(200).json({message: "Transaction deleted successfully!!!"})
    }
    catch (error){
        console.error("Error deleting the transactions", error);
        res.status(500).json({error: "Internal Server Error"});
    }
})