import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Customer address is required"],
    },
    phone: {
      type: String,
      required: [true, "Customer phone number is required"],
    },
    email: {
      type: String,
      required: [true, "Customer email is required"],
      lowercase: true,
    },
    meterNumber: {
      type: String,
      required: [true, "Meter number is required"],
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
