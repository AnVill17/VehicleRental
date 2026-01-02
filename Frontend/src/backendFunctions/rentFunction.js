// RentalService.js
import api from "../api/axios";
class RentalService {
  constructor() {
    this.api = api;
  }

 
  async getAvailableVehicles(searchData, queryParams = {}) {
   
    const res = await this.api.post("/rentals/available", searchData, {
      params: queryParams,
    });
    return res.data;
  }
 
  async rentVehicle(bookingDetails) {
    const res = await this.api.post("/rentals/rent", bookingDetails);
    return res.data;
  }

 
  async submitRating(ratingData) {
    const res = await this.api.post("/rentals/rating", ratingData);
    return res.data;
  }

  async getLenderRequests(status = "") {
    const res = await this.api.get("/rentals/requests", {
      params: { status },
    });
    return res.data;
  }

 
  async approveRent(rentId) {
    const res = await this.api.patch(`/rentals/${rentId}/approve`);
    return res.data;
  }

  
  async rejectRent(rentId) {
    const res = await this.api.patch(`/rentals/${rentId}/reject`);
    return res.data;
  }

  
  async getUserPreviousRents() {
    const res = await this.api.get("/rentals/user-previous-rents");
    return res.data;
  }

  
  async getUserCurrentRents() {
    const res = await this.api.get("/rentals/user-current-rents");
    return res.data;
  }
}

export default new RentalService();