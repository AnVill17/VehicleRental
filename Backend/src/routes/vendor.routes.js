import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addVehicle, deleteVehicle, getMyVehicles, updateVehicleDetails, vehicleRentHistory } from "../controllers/vehicle.controller.js";


const router= Router()
router.route("/").get(verifyJwt,getMyVehicles)
// router.route("/my-vehicle").get(verifyJwt,getMyVehicles)
router.route("/add-vehicle").post(verifyJwt,upload.single("image"),addVehicle)
router.route("/delete-vehicle/:vehicleId").delete(verifyJwt,deleteVehicle)
router.route("/edit-vehicle/:vehicleId").patch(verifyJwt,upload.single("image"),updateVehicleDetails)
router.route("/previous-rents").get(verifyJwt,vehicleRentHistory)


export default router;