import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const vehicleSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['car', 'bike'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  company:{
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: { 
    type: Number,
    required: true
  },
  numPlate: {
    type: String,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pricePerHour: {
    type: Number,
    required: true
  },
  location: {
            type: {
            type: String,
             enum: ["Point"],
            default: "Point",
    },
        coordinates: {
           type: [Number], 
           default: [0, 0],
    },
  },
  images:  {
            type: String, // cloudinary url
            required: true,
        },
  availability: {
        type: Boolean,
        default: true
},
rating: {
  average: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 }
}

}, { timestamps: true });

vehicleSchema.index({ location: "2dsphere" });
vehicleSchema.plugin(mongooseAggregatePaginate);


export const Vehicle = mongoose.model('Vehicle', vehicleSchema);