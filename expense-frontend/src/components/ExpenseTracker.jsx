import { useEffect, useState } from "react";
import axios from "axios";
import "./ExpenseTracker.css";

const API_URL = "http://localhost:30015/api/expenses";

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", category: "", date: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(API_URL);
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, amount, category, date } = form;
    if (!title || !amount || !category || !date) return;

    try {
      const payload = { title, amount: parseFloat(amount), category, date };
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, payload);
        setEditId(null);
      } else {
        await axios.post(API_URL, payload);
      }
      setForm({ title: "", amount: "", category: "", date: "" });
      fetchExpenses();
    } catch (err) {
      console.error("Error saving expense:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  const handleEdit = (expense) => {
    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date
    });
    setEditId(expense.id);
  };

  const totalPerCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  return (
    <div className="expense-container">
      <div className="expense-box">
        <h1 className="title">💰 Daily Expense Tracker</h1>

        <form onSubmit={handleSubmit} className="expense-form">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <input
            type="text"
            placeholder="Category (Food, Travel...)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <button type="submit" className="btn-submit">
            {editId ? "Update Expense" : "Add Expense"}
          </button>
        </form>

        <h2 className="subtitle">Expenses List</h2>
        <table className="expense-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount (₹)</th>
              <th>Category</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id}>
                <td>{e.title}</td>
                <td>{e.amount}</td>
                <td>{e.category}</td>
                <td>{e.date}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(e)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(e.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="subtitle">Total by Category</h2>
        <ul className="total-list">
          {Object.entries(totalPerCategory).map(([cat, total]) => (
            <li key={cat}>
              <strong>{cat}:</strong> ₹{total.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExpenseTracker;
