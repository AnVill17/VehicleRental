import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux"; 
import { store } from "./store/store.js";
import { useEffect } from "react";
import { checkAuthSession } from "./store/authSlice";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Explore from "./pages/Explore";
import MyRentals from "./pages/MyRentals";
import Profile from "./pages/Profile";
import LenderDashboard from "./pages/lender/Dashboard";
import VehicleManagement from "./pages/lender/VehicleManagement";
import RequestApproval from "./pages/lender/RequestApproval";
import LenderMessages from "./pages/lender/Messages";
import LenderProfile from "./pages/lender/Profile";
import UserMessages from "./pages/Messages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  useEffect(() => {  
    dispatch(checkAuthSession());
  
  }, [dispatch]);

  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {/* 2. Wrap Router with AuthWrapper */}
        <AuthWrapper>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/my-rentals" element={<MyRentals />} />
              <Route path="/messages" element={<UserMessages />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Lender Routes */}
              <Route path="/lender/dashboard" element={<LenderDashboard />} />
              <Route path="/lender/vehicles" element={<VehicleManagement />} />
              <Route path="/lender/requests" element={<RequestApproval />} />
              <Route path="/lender/messages" element={<LenderMessages />} />
              <Route path="/lender/profile" element={<LenderProfile />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthWrapper>

      </TooltipProvider>
    </Provider>
  </QueryClientProvider>
);

export default App;