// src/models/usage.model.js
import mongoose from "mongoose";

const usageSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer reference is required"],
    },
    previousReading: {
      type: Number,
      required: [true, "Previous reading is required"],
      min: [0, "Reading cannot be negative"],
    },
    currentReading: {
      type: Number,
      required: [true, "Current reading is required"],
      min: [0, "Reading cannot be negative"],
      validate: {
        validator: function (val) {
          return val >= this.previousReading;
        },
        message: "Current reading cannot be less than previous reading",
      },
    },
    usage: {
      type: Number,
      default: 0,
      min: [0, "Usage cannot be negative"],
    },
    isInactive: {
      type: Boolean,
      default: false,
    },
    month: {
      type: Number,
      required: [true, "Month is required"],
      min: [1, "Month must be between 1 and 12"],
      max: [12, "Month must be between 1 and 12"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
    },
  },
  { timestamps: true }
);

// unique per customer + month + year
usageSchema.index({ customer: 1, month: 1, year: 1 }, { unique: true });

// virtual for formatted month (e.g. "01")
usageSchema.virtual("formattedMonth").get(function () {
  return this.month.toString().padStart(2, "0");
});

// auto-calculate usage + isInactive before saving
usageSchema.pre("save", function (next) {
  this.usage = this.currentReading - this.previousReading;
  this.isInactive = this.usage === 0;
  next();
});

// auto-calculate for findOneAndUpdate as well
usageSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (
    update.previousReading !== undefined ||
    update.currentReading !== undefined
  ) {
    const prev = update.previousReading ?? this._update.previousReading;
    const curr = update.currentReading ?? this._update.currentReading;

    if (curr < prev) {
      return next(
        new Error("Current reading cannot be less than previous reading")
      );
    }

    update.usage = curr - prev;
    update.isInactive = update.usage === 0;
  }

  next();
});

// ✅ Auto-create billing after new usage is saved
usageSchema.post("save", async function (doc, next) {
  try {
    const Billing = (await import("./billing.model.js")).default;

    // If a billing record already exists, skip
    const existingBill = await Billing.findOne({ usage: doc._id });
    if (existingBill) return next();

    // Auto-create billing entry
    await Billing.create({
      customer: doc.customer,
      usage: doc._id,
      month: doc.month,
      year: doc.year,
      totalUsage: doc.usage,
    });

    next();
  } catch (err) {
    console.error("Auto billing creation failed:", err);
    next(err);
  }
});

// ✅ Auto-update billing if usage is updated
usageSchema.post("findOneAndUpdate", async function (result, next) {
  try {
    if (!result) return next();
    const Billing = (await import("./billing.model.js")).default;

    const billing = await Billing.findOne({ usage: result._id });
    if (!billing) {
      // If no billing found (shouldn't happen), create one automatically
      await Billing.create({
        customer: result.customer,
        usage: result._id,
        month: result.month,
        year: result.year,
        totalUsage: result.usage,
      });
      return next();
    }

    // Recalculate total amount
    billing.totalUsage = result.usage;
    billing.totalAmount = result.isInactive
      ? billing.baseFee // inactive = base fee only
      : billing.baseFee + result.usage * billing.unitPrice; // active = usage + base fee

    billing.updatedAt = new Date();
    await billing.save();

    next();
  } catch (err) {
    console.error("Auto billing update failed:", err);
    next(err);
  }
});

// include virtuals in toJSON / toObject
usageSchema.set("toJSON", { virtuals: true });
usageSchema.set("toObject", { virtuals: true });

const Usage = mongoose.model("Usage", usageSchema);
export default Usage;
