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

  // only recalc if readings exist in update
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

// include virtuals in toJSON / toObject
usageSchema.set("toJSON", { virtuals: true });
usageSchema.set("toObject", { virtuals: true });

const Usage = mongoose.model("Usage", usageSchema);
export default Usage;
