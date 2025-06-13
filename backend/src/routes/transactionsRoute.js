import express from "express";

import {getTransactionsByUserId} from "../controllers/transactionsController.js";
import {createTransaction} from "../controllers/transactionsController.js";
import {deleteTransaction} from "../controllers/transactionsController.js";
import {getTransactionSummary} from "../controllers/transactionsController.js";



const router = express.Router();


router.get("/:userId", getTransactionsByUserId)

router.post("/", createTransaction)

router.delete("/:id", deleteTransaction)

router.get("/summary/:userId", getTransactionSummary)

export default router;