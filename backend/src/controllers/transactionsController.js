import {sql} from "../config/db.js";


export async function getTransactionsByUserId(req, res){
    try {
            const {userId} = req.params;
            const transaction = await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;
            res.status(200).json(transaction);
        }
        catch (error) {
            console.error("Error fetching transactions:", error);
            res.status(500).json({error: "Internal Server Error"});
        }
}

export async function createTransaction(req, res) {
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
}

export async function deleteTransaction(req, res){
    try {
            const {id} = req.params;
    
            if (isNaN(parseInt(id))){
                return res.status(400).json({error: "Invalid transaction ID"});
            }
    
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
}

export async function getTransactionSummary(req, res){
    try{
        const {userId} = req.params;

        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as balance
            FROM transactions WHERE user_id = ${userId}`

        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as income
            FROM transactions WHERE user_id = ${userId} and amount > 0`

        const expenseResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as expense
            FROM transactions WHERE user_id = ${userId} and amount < 0`

        res.status(200).json({
            balance: parseFloat(balanceResult[0].balance),
            income: parseFloat(incomeResult[0].income),
            expense: parseFloat(expenseResult[0].expense)
        })
    }
    catch (error) {
        console.error("Error fetching transaction summary:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
}