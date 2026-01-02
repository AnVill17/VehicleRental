import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Star as StarIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Modal } from '@/components/ui/Modal';
import { RatingStars } from '@/components/ui/RatingStars';
import { RentalStatus, Rental } from '@/types'; 
import rentalService from '../backendFunctions/rentFunction.js'; 

const statusTabs: { status: RentalStatus | 'all'; label: string; icon: any }[] = [
  { status: 'all', label: 'All', icon: null },
  { status: 'pending', label: 'Pending', icon: Clock },
  { status: 'approved', label: 'Approved', icon: CheckCircle },
  { status: 'rejected', label: 'Rejected', icon: XCircle },
  { status: 'completed', label: 'Completed', icon: StarIcon },
];

const statusColors: Record<string, string> = {
  pending: 'bg-warning/20 text-warning',
  approved: 'bg-success/20 text-success',
  rejected: 'bg-destructive/20 text-destructive',
  completed: 'bg-primary/20 text-primary',
  cancelled: 'bg-muted text-muted-foreground',
};

const MyRentals = () => {
  const [activeTab, setActiveTab] = useState<RentalStatus | 'all'>('all');
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  
 
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
 // rating is still slightly buggy need to fix in near future
  
  const fetchMyRentals = async () => {
    setLoading(true);
    try {
      // Fetch both current (active) and past history as will be hectic to separate if error aaya to change to separate functions adding new sethistory and setcurrent
      const [currentRes, historyRes] = await Promise.all([
         rentalService.getUserCurrentRents(),
         rentalService.getUserPreviousRents()
      ]);

          const current = currentRes.data || [];
      const history = historyRes.data || [];
      
      // (newest first)
      const allRentals = [...current, ...history].sort((a: any, b: any) => 
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );

      setRentals(allRentals);
    } catch (error) {
      console.error("Failed to fetch rentals", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRentals();
  }, []);


  const filteredRentals =
    activeTab === 'all'
      ? rentals
      : rentals.filter((r) => r.status === activeTab);

 
  const handleRateRental = async () => {
    
    if (!selectedRental?._id || rating === 0) return;

    try {
      await rentalService.submitRating({
        rentId: selectedRental._id,
        rating: rating
      });
      
    
      setRentals(prev => prev.map(r => 
        r._id === selectedRental._id 
          ? { ...r, hasRated: true, rating: rating } 
          : r
      ));

      setShowRatingModal(false);
      setSelectedRental(null);
      setRating(0);
    } catch (error) {
      console.error("Rating failed", error);
      alert("Failed to submit rating. Please try again.");
    }
  };


  const calculateCost = (rental: any) => {
     if (rental.totalCost) return rental.totalCost;
     const start = new Date(rental.startTime).getTime();
     const end = new Date(rental.endTime).getTime();
     const hours = Math.max(1, Math.ceil((end - start) / (3600 * 1000)));
    
     const price = typeof rental.vehicle === 'object' ? rental.vehicle?.pricePerHour : 0;
     return (hours * (price || 0)).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              My Rentals
            </h1>
            <p className="text-muted-foreground">
              Track and manage your vehicle rentals
            </p>
          </motion.div>

          {/* Status Tabs */}
          <motion.div
            className="mb-8 flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {statusTabs.map((tab) => (
              <motion.button
                key={tab.status}
                onClick={() => setActiveTab(tab.status)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.status
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.icon && <tab.icon className="w-4 h-4" />}
                {tab.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Rentals List */}
          <div className="space-y-4">
            {loading && <div className="text-center py-10">Loading your rentals...</div>}

            {!loading && (
            <AnimatePresence mode="popLayout">
              {filteredRentals.map((rental, index) => {
                  
                  const vehicleObj = typeof rental.vehicle === 'object' ? rental.vehicle : null;
                  const imageUrl = vehicleObj?.images?.[0] || vehicleObj?.image || "https://via.placeholder.com/300";
                  const company = vehicleObj?.company || "Unknown";
                  const model = vehicleObj?.model || "Vehicle";

                  return (
                    <motion.div
                    //  _id for the key mongo error aa rha without this
                    key={rental._id || index}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass rounded-xl overflow-hidden"
                    >
                    <div className="flex flex-col md:flex-row">
                        {/* Vehicle Image */}
                        <div className="md:w-48 aspect-video md:aspect-square relative bg-muted">
                        <img
                            src={imageUrl}
                            alt={`${company} ${model}`}
                            className="w-full h-full object-cover"
                        />
                        </div>

                        {/* Details */}
                        <div className="flex-1 p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                            <h3 className="text-lg font-display font-semibold text-foreground">
                                {company} {model}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {new Date(rental.startTime).toLocaleDateString()} -{' '}
                                {new Date(rental.endTime).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {new Date(rental.startTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                })}{' '}
                                to{' '}
                                {new Date(rental.endTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                })}
                            </p>
                            </div>

                            <div className="flex flex-col items-start md:items-end gap-2">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                statusColors[rental.status] || 'bg-muted'
                                }`}
                            >
                                {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                            </span>
                            <p className="text-xl font-display font-bold text-primary">
                                ${calculateCost(rental)}
                            </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-4 flex flex-wrap gap-2">
                         
                            {rental.status === 'completed' && !rental.hasRated && (
                            <motion.button
                                onClick={() => {
                                setSelectedRental(rental);
                                setShowRatingModal(true);
                                }}
                                className="btn-primary text-sm py-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <StarIcon className="w-4 h-4 inline mr-1" />
                                Rate Ride
                            </motion.button>
                            )}
                            
                            {/* Show existing rating if they have rated */}
                            {rental.hasRated && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
                                <span className="text-sm text-muted-foreground">
                                You rated:
                                </span>
                           
                                <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="font-bold">Rated</span>
                            </div>
                            )}
                        </div>
                        </div>
                    </div>
                    </motion.div>
                  );
              })}
            </AnimatePresence>
            )}

            {!loading && filteredRentals.length === 0 && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-muted-foreground text-lg">
                  No rentals found in this category.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      <Modal
        isOpen={showRatingModal}
        onClose={() => {
          setShowRatingModal(false);
          setRating(0);
        }}
        title="Rate Your Experience"
      >
        <div className="py-6 text-center">
          <p className="text-muted-foreground mb-6">
            How was your experience with the{' '}
            <span className="text-foreground font-medium">
        
              {typeof selectedRental?.vehicle === 'object' ? selectedRental.vehicle?.company : ''}{' '} 
              {typeof selectedRental?.vehicle === 'object' ? selectedRental.vehicle?.model : 'Vehicle'}
            </span>
            ?
          </p>

          <div className="flex justify-center mb-8">
            <RatingStars
              rating={rating}
              interactive
              onRate={setRating}
              size="lg"
            />
          </div>

          <motion.button
            onClick={handleRateRental}
            className="btn-primary w-full"
            disabled={rating === 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Submit Rating
          </motion.button>
        </div>
      </Modal>
    </div>
  );
};

export default MyRentals;