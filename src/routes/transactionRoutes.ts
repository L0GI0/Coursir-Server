import express from "express";
import { createScripePaymentIntent, createTransaction, listTransactions } from "../controllers/transactionController";


const router = express.Router();

router.post("/stripe/payment-intent", createScripePaymentIntent);
router.get('/', listTransactions);
router.post("/", createTransaction);

export default router;