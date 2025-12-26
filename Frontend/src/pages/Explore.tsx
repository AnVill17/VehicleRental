import { motion, AnimatePresence } from 'framer-motion';
import { Filter, MapPin, Search, X, Calendar, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { VehicleCard } from '@/components/VehicleCard';
import { Modal } from '@/components/ui/Modal';
import { ImageSlider } from '@/components/ui/ImageSlider';
import { RatingStars } from '@/components/ui/RatingStars';
import { LocationPrompt } from '@/components/LocationPrompt';
import { useAuth } from '@/context/AuthContext';
import { Vehicle } from '@/types';
import { mockVehicles } from '@/data/mockData';

const categories = ['all', 'car', 'bike', 'suv', 'truck', 'van'];

const Explore = () => {
  const { location, locationLoading, requestLocation } = useAuth();
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(mockVehicles);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showRentModal, setShowRentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Rental form state
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    if (!location && !locationLoading) {
      setShowLocationPrompt(true);
    }
  }, [location, locationLoading]);

  useEffect(() => {
    let filtered = vehicles;

    if (searchQuery) {
      filtered = filtered.filter(
        (v) =>
          v.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.model.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((v) => v.category === selectedCategory);
    }

    setFilteredVehicles(filtered);
  }, [searchQuery, selectedCategory, vehicles]);

  const handleLocationRequest = async () => {
    await requestLocation();
    setShowLocationPrompt(false);
  };

  const handleRentRequest = () => {
    // TODO: Connect to backend API
    setShowRentModal(false);
    setShowSuccessModal(true);
  };

  const calculateTotal = () => {
    if (!selectedVehicle || !startDate || !endDate || !startTime || !endTime) return 0;
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const hours = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60)));
    return hours * selectedVehicle.pricePerHour;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <LocationPrompt
        isOpen={showLocationPrompt}
        isLoading={locationLoading}
        onRequestLocation={handleLocationRequest}
        onSkip={() => setShowLocationPrompt(false)}
      />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Explore Vehicles
            </h1>
            {location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  Showing vehicles near your location
                </span>
              </div>
            )}
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            className="mb-8 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by brand or model..."
                className="input-field pl-12 pr-12"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Vehicle Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <VehicleCard
                    vehicle={vehicle}
                    onClick={() => setSelectedVehicle(vehicle)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredVehicles.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-muted-foreground text-lg">
                No vehicles found. Try adjusting your search.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Vehicle Details Modal */}
      <Modal
        isOpen={!!selectedVehicle && !showRentModal}
        onClose={() => setSelectedVehicle(null)}
        size="lg"
        title={selectedVehicle ? `${selectedVehicle.company} ${selectedVehicle.model}` : ''}
      >
        {selectedVehicle && (
          <div className="space-y-6">
            <ImageSlider
              images={selectedVehicle.images || [selectedVehicle.image]}
              alt={`${selectedVehicle.company} ${selectedVehicle.model}`}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-muted-foreground mb-1">Details</h3>
                  <div className="space-y-2">
                    <p className="text-foreground">
                      <span className="text-muted-foreground">Year:</span>{' '}
                      {selectedVehicle.year}
                    </p>
                    <p className="text-foreground">
                      <span className="text-muted-foreground">Category:</span>{' '}
                      {selectedVehicle.category.toUpperCase()}
                    </p>
                    <p className="text-foreground">
                      <span className="text-muted-foreground">Plate:</span>{' '}
                      {selectedVehicle.numberPlate}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-muted-foreground mb-1">Owner</h3>
                  <p className="text-foreground">{selectedVehicle.ownerName}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-muted-foreground mb-1">Rating</h3>
                  <RatingStars rating={selectedVehicle.rating} size="md" />
                </div>

                <div>
                  <h3 className="text-sm text-muted-foreground mb-1">Price</h3>
                  <p className="text-3xl font-display font-bold text-primary">
                    ${selectedVehicle.pricePerHour}
                    <span className="text-lg text-muted-foreground">/hr</span>
                  </p>
                </div>

                {selectedVehicle.distance && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedVehicle.distance.toFixed(1)} km away</span>
                  </div>
                )}
              </div>
            </div>

            <motion.button
              onClick={() => setShowRentModal(true)}
              className="btn-primary w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Rent Now
            </motion.button>
          </div>
        )}
      </Modal>

      {/* Rent Form Modal */}
      <Modal
        isOpen={showRentModal}
        onClose={() => setShowRentModal(false)}
        title="Book Your Rental"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Calendar className="w-4 h-4 inline mr-1" /> Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Clock className="w-4 h-4 inline mr-1" /> Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Calendar className="w-4 h-4 inline mr-1" /> End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-field"
                min={startDate || new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Clock className="w-4 h-4 inline mr-1" /> End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {calculateTotal() > 0 && (
            <div className="p-4 rounded-lg bg-muted border border-border">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Estimated Total</span>
                <span className="text-2xl font-display font-bold text-primary">
                  ${calculateTotal()}
                </span>
              </div>
            </div>
          )}

          <motion.button
            onClick={handleRentRequest}
            className="btn-primary w-full"
            disabled={!startDate || !startTime || !endDate || !endTime}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Confirm Rental Request
          </motion.button>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          setSelectedVehicle(null);
        }}
        title="Request Sent!"
      >
        <div className="text-center py-6">
          <motion.div
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
          >
            <svg
              className="w-10 h-10 text-success"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              />
            </svg>
          </motion.div>
          <h3 className="text-xl font-display font-bold text-foreground mb-2">
            Your request has been sent!
          </h3>
          <p className="text-muted-foreground">
            The vehicle owner will review your request and respond shortly.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Explore;
