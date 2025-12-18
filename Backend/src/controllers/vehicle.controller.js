import { Vehicle } from "../models/vehicle.model.js";
import { ApiError } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { asynchandler } from "../utils/AsyncHandler.js";
import { deleteFronCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";




const getMyVehicles = asynchandler(async (req, res) => {
  const userId = req.user._id;

  const vehicles = await Vehicle.find({ owner: userId });

  if (!vehicles || vehicles.length === 0) {
    throw new ApiError(404, "No vehicles found for this user");
  }

  return res.status(200).json(
    new ApiResponse(200, vehicles, "User's vehicles retrieved successfully")
  );
});


const addVehicle = asynchandler(async (req, res) => {
  const { category, company, model, year, numPlate, pricePerHour, latitude, longitude } = req.body;

  if (
    !category ||
    !company ||
    !model ||
    !year ||
    !numPlate ||
    !pricePerHour ||
    latitude === undefined ||
    longitude === undefined
  ) {
    throw new ApiError(400, "All fields are required");
  }
  console.log("file:", req.file);
  console.log("body:", req.body);

  if (!req.file) {
    throw new ApiError(400, "Vehicle image is required");
  }

  const imageFilePath = req.file.path;

  const image = await uploadOnCloudinary(imageFilePath);

  const vehicle = new Vehicle({
    category,
    company,
    model,
    year,
    numPlate,
    owner: req.user._id,
    pricePerHour,
    images: image.url,
    location: {
      type: "Point",
      coordinates: [Number(longitude), Number(latitude)]
    }
  });

  await vehicle.save();

  return res.status(201).json(
    new ApiResponse(201, vehicle, "Vehicle added successfully")
  );
});




 const deleteVehicle=asynchandler(async function (req,res) {
    const user=req.user;
    if(!user)
        throw new ApiError(404,"user not found")
    const {vehicleId}=req.params
    const vehicle=await Vehicle.findById(vehicleId)
    if(!vehicle)
        throw new ApiError(404,"vehicle not found")
    if(vehicle.owner.toString()!==user._id.toString())
    {
        throw new ApiError(409,"Not allowed to make changes")
    }
    await deleteFronCloudinary(vehicle.images)
    await Vehicle.findByIdAndDelete(vehicle._id)

    return res
    .status(200)
    .json(new ApiResponse(200,{},"deleted successfully"))


 })
 const updateVehicleDetails=asynchandler(async function (req,res) {
    const user=req.user;
    if(!user)
        throw new ApiError(404,"user not found")
    const {vehicleId}=req.params
    const vehicle=await Vehicle.findById(vehicleId)
    if(!vehicle)
        throw new ApiError(404,"vehicle not found")
    if(vehicle.owner.toString()!==user._id.toString())
    {
        throw new ApiError(409,"Not allowed to make changes")
    }
   if (req.file) {
    // delete old image from Cloudinary
    await deleteFronCloudinary(vehicle.images);

    // upload new image
    const uploadedImage = await uploadOnCloudinary(req.file.path);
    vehicle.images = uploadedImage.url;
}

    if(req.body.pricePerHour) vehicle.pricePerHour=req.body.pricePerHour
    await vehicle.save()

    return res
    .status(201)
    .json(new ApiResponse(201,vehicle,"updates successfuly"))

 })
 const vehicleRentHistory=asynchandler(async function(req,res){
    const {vehicleId}=req.params
    const history = await Rent.find({ vehicle: vehicleId }).populate("rentedBy", "name email");
    return res
    .status(200)
    .json(new ApiResponse(200,history,"success"))
 })



 export {addVehicle,getMyVehicles,deleteVehicle,updateVehicleDetails,vehicleRentHistory}