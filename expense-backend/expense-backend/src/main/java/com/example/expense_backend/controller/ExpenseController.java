package com.example.expense_backend.controller;

import com.example.expense_backend.model.Expense;
import com.example.expense_backend.service.ExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    private final ExpenseService service;

    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    // GET all expenses
    @GetMapping
    public List<Expense> getAllExpenses() {
        return service.getAllExpenses();
    }

    // GET single expense by ID
    @GetMapping("/{id}")
    public Optional<Expense> getExpenseById(@PathVariable Long id) {
        return service.getExpenseById(id);
    }

    // POST a new expense
    @PostMapping
    public Expense createExpense(@RequestBody Expense expense) {
        return service.saveExpense(expense);
    }

    // PUT update an expense
    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
        return service.updateExpense(id, expense);
    }

    // DELETE an expense
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        service.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
}
