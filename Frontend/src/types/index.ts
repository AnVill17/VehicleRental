export type UserRole = 'user' | 'lender';

export interface User {
  _id?: string; // Added for MongoDB
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
}

export interface Vehicle {
  _id?: string; // Added for MongoDB
  id: string;
  image: string;
  images?: string[];
  company: string;
  model: string;
  year: number;
  category: 'car' | 'bike' | 'suv' | 'truck' | 'van';
  pricePerHour: number;
  rating: number | { average: number; totalRatings: number };
  numberPlate: string;
  distance?: number;
  ownerId: string;
  ownerName?: string;
  locationAddress?: string;
  latitude?: number;
  longitude?: number;
}

export type RentalStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'; 

export interface Rental {
  _id: string;              
  
  
  rentedBy: string | User;
  lender: string | User; 
  vehicle: string | Vehicle;
 
  startTime: string;        
  endTime: string;        
  status: RentalStatus;
  hasRated: boolean;       
  totalCost?: number;       
  createdAt: string;
  updatedAt: string;
}
export interface Message {
  _id?: string; // Added for MongoDB
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

export interface LocationData {
  latitude: number;
  longitude: number;
}