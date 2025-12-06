import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const rentSchema = new mongoose.Schema(
  {
    rentedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // <- owner of the vehicle
    },
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled", "completed"],
      default: "pending",
    },
    hasRated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
   

export const Rent = mongoose.model('Rent', rentSchema);