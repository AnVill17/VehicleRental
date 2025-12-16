import { ApiError } from "../utils/Apierror.js";

export const checkIsVendor = (req, res, next) => {
  if (req.user?.role !== "vendor") {
    throw new ApiError(403, "Access denied. Vendors only.");
  }
  next();
};
