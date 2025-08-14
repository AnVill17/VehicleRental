import { Rent } from "../models/rent.models.js";
import { Vehicle } from "../models/vehicle.model.js";   
import { ApiResponse } from "../utils/apiresponse.js";
import { asynchandler, asyncHandler } from "../utils/AsyncHandler.js";






const getAvailableVehicles = asynchandler(async (req, res) => {
  const { startTime, endTime, latitude, longitude } = req.body;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { query,category } = req.query;

  if (!startTime || !endTime || !latitude || !longitude) {
    throw new ApiError(400, "Start time, end time, and location are required");
  }

 
  let sortQuery = { pricePerHour: 1 }; 
  if (query === "minDist") sortQuery = { distance: 1 };
  else if (query === "highRating") sortQuery = { "rating.average": -1 };
  else if (query === "priceDesc") sortQuery = { pricePerHour: -1 };

  const rentedVehicles = await Rent.find({
    startTime: { $lt: new Date(endTime) },
    endTime: { $gt: new Date(startTime) }
  }).distinct("vehicle");

  const skip = (page - 1) * limit;


  const availableVehicles = await Vehicle.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        distanceField: "distance",
        maxDistance: 10000,
        spherical: true,
        query: {
          _id: { $nin: rentedVehicles },
          ...(category && { category })
        }
      }
    },
    { $sort: sortQuery },
    { $skip: skip },
    { $limit: limit }
  ]);

  
  const totalAvailableAgg = await Vehicle.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        distanceField: "distance",
        maxDistance: 10000,
        spherical: true,
        query: {
          _id: { $nin: rentedVehicles },
           ...(category && { category })
        }
      }
    },
    { $count: "total" }
  ]);
  const totalAvailable = totalAvailableAgg[0]?.total || 0;

  return res.status(200).json(
    new ApiResponse(200, {
      vehicles: availableVehicles,
      total: totalAvailable,
      page,
      totalPages: Math.ceil(totalAvailable / limit),
    }, "Available vehicles within 10 km")
  );
});


const rentVehicle=asynchandler(async function (req, res) {
  const { vehicleId, startTime, endTime } = req.body;

  if (!vehicleId || !startTime || !endTime) {
    throw new ApiError(400, "Vehicle ID, start time, and end time are required");
  }

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  const existingRent = await Rent.findOne({
    vehicle: vehicleId,
    $or: [
      { startTime: { $lt: new Date(endTime) }, endTime: { $gt: new Date(startTime) } }
    ]
  });

  if (existingRent) {
    throw new ApiError(409, "Vehicle is already rented during this time");
  }

  const rent = new Rent({
    rentedBy: req.user._id,
    vehicle: vehicleId,
    startTime: new Date(startTime),
    endTime: new Date(endTime)
  });

  await rent.save();

  return res.status(201).json(new ApiResponse(201, rent, "Vehicle rented successfully"));
});

const rating=asyncHandler(async function (req,res) {
  const { rentId, rating } = req.body;

  if (!rentId || !rating || rating < 1 || rating > 5) {
    throw new ApiError(400, "Valid rentId and rating (1 to 5) required");
  }

  const rent = await Rent.findById(rentId).populate("vehicle");

  if (!rent) {
    throw new ApiError(404, "Rent record not found");
  }

  if (rent.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to rate this rent");
  }

  if (rent.isRated) {
    throw new ApiError(400, "This rent has already been rated");
  }

  
  const vehicle = rent.vehicle;
  const { average, totalRatings } = vehicle.rating;

  const newTotal = totalRatings + 1;
  const newAverage = ((average * totalRatings) + rating) / newTotal;

  vehicle.rating.average = newAverage;
  vehicle.rating.totalRatings = newTotal;
  await vehicle.save();

 
  rent.isRated = true;
  await rent.save();

  return res.status(200).json(new ApiResponse(200, vehicle.rating, "Rating submitted"));

}
)


export { getAvailableVehicles, rentVehicle };
