import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  addVehicle,
  deleteVehicle,
  getMyVehicles,
  updateVehicleDetails,
  vehicleRentHistory,
} from "../controllers/vehicle.controller.js";

const router = Router();


router.get("/", verifyJwt, getMyVehicles);


router.post("/add-vehicle",upload.single("image"),
  verifyJwt,
  addVehicle
);


router.delete( "/delete-vehicle/:vehicleId",
 verifyJwt,
  deleteVehicle
);


router.patch("/edit-vehicle/:vehicleId",
  upload.single("image"),
  verifyJwt,
  updateVehicleDetails
);


router.get("/previous-rents/:vehicleId",
  verifyJwt,
  vehicleRentHistory
);

export default router;
