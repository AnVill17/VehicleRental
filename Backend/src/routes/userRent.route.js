
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { approveRent, getAvailableVehicles, getLenderRentRequests, rating, rejectRent, rentVehicle } from "../controllers/rental.controller.js";


const router= Router()

router.post("/available",  getAvailableVehicles);


router.post("/rent", verifyJwt, rentVehicle);

router.post("/rating", verifyJwt, rating);


router.get("/requests", verifyJwt, getLenderRentRequests);


router.patch("/:rentId/approve", verifyJwt, approveRent);


router.patch("/:rentId/reject", verifyJwt, rejectRent);


export default router