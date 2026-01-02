import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Calendar, Clock } from 'lucide-react'; 
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Navbar } from '@/components/Navbar';
import { VehicleCard } from '@/components/VehicleCard';
import { Modal } from '@/components/ui/Modal';
import { ImageSlider } from '@/components/ui/ImageSlider';
import { RatingStars } from '@/components/ui/RatingStars';
import { LocationPrompt } from '@/components/LocationPrompt';
import rentalService from '../backendFunctions/rentFunction.js';
import { Vehicle } from '@/types';

const categories = ['all', 'car', 'bike', 'suv', 'truck', 'van'];

const Explore = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);


  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');


  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showRentModal, setShowRentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

 
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState("10:00");
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [endTime, setEndTime] = useState("10:00");

  // initially 24 gnte k sare hi dikha do as khali looks bad
  const fetchVehicles = async (lat: number, lng: number, cat: string) => {
    setLoading(true);
    try {
      const res = await rentalService.getAvailableVehicles({
        latitude: lat,
        longitude: lng,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 86400000).toISOString(), // +1 din 
      }, {
        limit: 50,
        category: cat !== 'all' ? cat : undefined
      });

      setVehicles(res.data?.vehicles || []);
    } catch (err) {
      console.error("Error loading vehicles:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (location) {
      fetchVehicles(location.lat, location.lng, selectedCategory);
    }
  }, [selectedCategory]);

  const handleLocationRequest = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        setShowLocationPrompt(false);
        fetchVehicles(latitude, longitude, selectedCategory);
      },
      (err) => console.error(err)
    );
  };

  
  const filteredVehicles = vehicles.filter(v => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return v.company.toLowerCase().includes(q) || v.model.toLowerCase().includes(q);
  });

  const handleRentRequest = async () => {
    if (!isAuthenticated) return navigate('/login');
    if (!selectedVehicle) return;

    setIsBooking(true);
    try {
     
      const startIso = new Date(`${startDate}T${startTime}:00`).toISOString();
      const endIso = new Date(`${endDate}T${endTime}:00`).toISOString();

      await rentalService.rentVehicle({
        vehicleId: selectedVehicle._id || selectedVehicle.id,
        startTime: startIso,
        endTime: endIso
      });

      setShowRentModal(false);
      setShowSuccessModal(true);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Booking failed";
      alert(msg);
    } finally {
      setIsBooking(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedVehicle) return 0;
    
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    
    
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));
    
    return hours * selectedVehicle.pricePerHour;
  };


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <LocationPrompt isOpen={showLocationPrompt && !location} isLoading={false} onRequestLocation={handleLocationRequest} onSkip={() => setShowLocationPrompt(false)} />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          
          <motion.div className="mb-6">
            <h1 className="text-3xl font-display font-bold text-foreground">Explore Vehicles</h1>
            {location ? (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3 text-primary" /> Near You
              </p>
            ) : (
              <button onClick={() => setShowLocationPrompt(true)} className="text-sm text-primary hover:underline">Enable Location</button>
            )}
          </motion.div>

          <motion.div className="glass p-4 rounded-2xl mb-8 space-y-4 shadow-sm border border-border/50">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search brand or model..."
                  className="input-field pl-10 h-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredVehicles.map((vehicle) => (
                <motion.div key={vehicle._id || vehicle.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <VehicleCard 
                    vehicle={vehicle} 
                    onClick={() => {
                        setSelectedVehicle(vehicle);
                        setStartDate(new Date().toISOString().split('T')[0]); 
                    }} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {loading && <div className="text-center py-20 text-muted-foreground">Finding nearby vehicles...</div>}
          {!loading && filteredVehicles.length === 0 && <div className="text-center py-16 text-muted-foreground">No vehicles found nearby.</div>}
        </div>
      </div>

      <Modal 
        isOpen={!!selectedVehicle && !showSuccessModal}
        onClose={() => { setSelectedVehicle(null); setShowRentModal(false); }} 
        title="Book Vehicle" 
        size="lg"
      >
        {selectedVehicle && (
          <div className="space-y-6">
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <img src={selectedVehicle.images?.[0] || selectedVehicle.image} alt="Car" className="w-full h-full object-cover" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                   <h3 className="font-bold text-lg">{selectedVehicle.company} {selectedVehicle.model}</h3>
                   <p className="text-muted-foreground text-sm">${selectedVehicle.pricePerHour}/hr</p>
                </div>
                <div className="text-right">
                    <RatingStars rating={selectedVehicle.rating?.average || 0} size="sm" />
                </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold mb-1 block">Start Date</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input-field" min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1 block">Start Time</label>
                    <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="input-field" />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold mb-1 block">End Date</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="input-field" min={startDate} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1 block">End Time</label>
                    <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="input-field" />
                  </div>
               </div>
            </div>

            <div className="flex justify-between items-center p-2">
                <span className="font-medium">Total Estimated</span>
                <span className="text-2xl font-bold text-primary">${calculateTotal()}</span>
            </div>

            <button 
                onClick={handleRentRequest} 
                disabled={isBooking}
                className="btn-primary w-full"
            >
                {isBooking ? "Checking Availability..." : (isAuthenticated ? "Confirm & Pay" : "Login to Book")}
            </button>
          </div>
        )}
      </Modal>

      <Modal isOpen={showSuccessModal} onClose={() => { setShowSuccessModal(false); setSelectedVehicle(null); }} title="Success">
         <div className="text-center py-6">
            <h3 className="text-xl font-bold text-green-600">Request Sent!</h3>
            <p className="text-muted-foreground mt-2">Check your dashboard for updates.</p>
         </div>
      </Modal>

    </div>
  );
};

export default Explore;