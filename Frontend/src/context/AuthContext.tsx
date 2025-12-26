import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, LocationData } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  location: LocationData | null;
  locationLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole, avatar?: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  requestLocation: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const login = async (email: string, password: string) => {
    // TODO: Connect to backend API
    // Simulated login for demo
    const mockUser: User = {
      id: '1',
      name: 'Demo User',
      email,
      role: email.includes('lender') ? 'lender' : 'user',
      avatar: undefined,
    };
    setUser(mockUser);
  };

  const signup = async (name: string, email: string, password: string, role: UserRole, avatar?: string) => {
    // TODO: Connect to backend API
    const mockUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      avatar,
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
    setLocation(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const requestLocation = async () => {
    setLocationLoading(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch (error) {
      console.error('Location access denied:', error);
    } finally {
      setLocationLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        location,
        locationLoading,
        login,
        signup,
        logout,
        updateUser,
        requestLocation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
