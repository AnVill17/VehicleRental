export type UserRole = 'user' | 'lender';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
}

export interface Vehicle {
  id: string;
  image: string;
  images?: string[];
  company: string;
  model: string;
  year: number;
  category: 'car' | 'bike' | 'suv' | 'truck' | 'van';
  pricePerHour: number;
  rating: number;
  numberPlate: string;
  distance?: number;
  ownerId: string;
  ownerName?: string;
  locationAddress?: string;
  latitude?: number;
  longitude?: number;
}

export type RentalStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface Rental {
  id: string;
  vehicleId: string;
  vehicle?: Vehicle;
  renterId: string;
  renterName?: string;
  renterAvatar?: string;
  ownerId: string;
  startTime: Date;
  endTime: Date;
  status: RentalStatus;
  totalCost: number;
  rating?: number;
}

export interface Message {
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
