// src/models/billing.model.js
import mongoose from "mongoose";

const billingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    usage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usage",
      required: true,
      unique: true, // each usage generates one bill
    },
    month: {
      type: Number,
      min: 1,
      max: 12,
      required: true,
    },
    year: {
      type: Number,
      min: 2000,
      required: true,
    },
    totalUsage: {
      type: Number,
      required: true,
      min: 0,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 5000, // Rp 5,000 per m³ (example)
    },
    baseFee: {
      type: Number,
      required: true,
      min: 0,
      default: 10000, // maintenance fee for inactive users
    },
    totalAmount: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: ["unpaid", "paid", "overdue"],
      default: "unpaid",
    },
    dueDate: {
      type: Date,
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Automatically calculate totalAmount before save
billingSchema.pre("save", function (next) {
  // 🧮 Corrected total amount logic
  if (this.totalUsage > 0) {
    this.totalAmount = this.totalUsage * this.unitPrice; // active users pay for usage
  } else {
    this.totalAmount = this.baseFee; // inactive users pay base fee only
  }

  // 📅 Auto-set dueDate if not provided
  if (!this.dueDate) {
    const due = new Date();
    due.setDate(due.getDate() + 10); // default: 10 days after creation
    this.dueDate = due;
  }

  next();
});

const Billing = mongoose.model("Billing", billingSchema);
export default Billing;
