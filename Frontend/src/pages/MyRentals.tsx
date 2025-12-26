import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Star as StarIcon } from 'lucide-react';
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Modal } from '@/components/ui/Modal';
import { RatingStars } from '@/components/ui/RatingStars';
import { RentalStatus, Rental } from '@/types';
import { mockRentals } from '@/data/mockData';

const statusTabs: { status: RentalStatus | 'all'; label: string; icon: any }[] = [
  { status: 'all', label: 'All', icon: null },
  { status: 'pending', label: 'Pending', icon: Clock },
  { status: 'approved', label: 'Approved', icon: CheckCircle },
  { status: 'rejected', label: 'Rejected', icon: XCircle },
  { status: 'completed', label: 'Completed', icon: StarIcon },
];

const statusColors: Record<RentalStatus, string> = {
  pending: 'bg-warning/20 text-warning',
  approved: 'bg-success/20 text-success',
  rejected: 'bg-destructive/20 text-destructive',
  completed: 'bg-primary/20 text-primary',
};

const MyRentals = () => {
  const [activeTab, setActiveTab] = useState<RentalStatus | 'all'>('all');
  const [rentals] = useState<Rental[]>(mockRentals);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);

  const filteredRentals =
    activeTab === 'all'
      ? rentals
      : rentals.filter((r) => r.status === activeTab);

  const handleRateRental = () => {
    // TODO: Connect to backend API
    console.log('Rating rental:', selectedRental?.id, 'with', rating, 'stars');
    setShowRatingModal(false);
    setSelectedRental(null);
    setRating(0);
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
            <AnimatePresence mode="popLayout">
              {filteredRentals.map((rental, index) => (
                <motion.div
                  key={rental.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-xl overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Vehicle Image */}
                    <div className="md:w-48 aspect-video md:aspect-square">
                      <img
                        src={rental.vehicle?.image}
                        alt={`${rental.vehicle?.company} ${rental.vehicle?.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-display font-semibold text-foreground">
                            {rental.vehicle?.company} {rental.vehicle?.model}
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
                              statusColors[rental.status]
                            }`}
                          >
                            {rental.status.charAt(0).toUpperCase() +
                              rental.status.slice(1)}
                          </span>
                          <p className="text-xl font-display font-bold text-primary">
                            ${rental.totalCost}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {rental.status === 'completed' && !rental.rating && (
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
                        {rental.status === 'completed' && rental.rating && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Your rating:
                            </span>
                            <RatingStars rating={rental.rating} size="sm" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredRentals.length === 0 && (
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
            How was your experience with{' '}
            <span className="text-foreground font-medium">
              {selectedRental?.vehicle?.company} {selectedRental?.vehicle?.model}
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
            className="btn-primary"
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
