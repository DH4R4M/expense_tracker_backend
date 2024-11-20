const express = require("express");
const db = require("../firebase-config");
const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const expensesSnapshot = await db.collection("expenses").get();
    const expenses = [];
    expensesSnapshot.forEach(doc => {
      expenses.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch expenses." });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const expenseDoc = await db.collection("expenses").doc(req.params.id).get();
    if (!expenseDoc.exists) {
      return res.status(404).json({ error: "Expense not found." });
    }
    res.status(200).json({ id: expenseDoc.id, ...expenseDoc.data() });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch expense." });
  }
});


router.post("/", async (req, res) => {
  try {
    const { title, category, amount, date } = req.body;
    const newExpense = await db.collection("expenses").add({
      title,
      category,
      amount: Number(amount),
      date,
      createdAt: new Date().toISOString()
    });
    res.status(201).json({
      id: newExpense.id,
      title,
      category,
      amount,
      date
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add expense." });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { title, category, amount, date } = req.body;
    await db.collection("expenses").doc(req.params.id).update({
      title,
      category,
      amount: Number(amount),
      date,
      updatedAt: new Date().toISOString()
    });
    res.status(200).json({
      id: req.params.id,
      title,
      category,
      amount,
      date
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update expense." });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    await db.collection("expenses").doc(req.params.id).delete();
    res.status(200).json({ message: "Expense deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete expense." });
  }
});

module.exports = router;
