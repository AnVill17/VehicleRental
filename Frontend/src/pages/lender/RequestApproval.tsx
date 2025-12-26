import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Clock, User } from 'lucide-react';
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Modal } from '@/components/ui/Modal';
import { RentalStatus, Rental } from '@/types';
import { mockRentals } from '@/data/mockData';

const statusTabs: { status: RentalStatus | 'all'; label: string }[] = [
  { status: 'all', label: 'All' },
  { status: 'pending', label: 'Pending' },
  { status: 'approved', label: 'Approved' },
  { status: 'rejected', label: 'Rejected' },
];

const statusColors: Record<RentalStatus, string> = {
  pending: 'bg-warning/20 text-warning border-warning/30',
  approved: 'bg-success/20 text-success border-success/30',
  rejected: 'bg-destructive/20 text-destructive border-destructive/30',
  completed: 'bg-primary/20 text-primary border-primary/30',
};

const RequestApproval = () => {
  const [activeTab, setActiveTab] = useState<RentalStatus | 'all'>('all');
  const [rentals, setRentals] = useState<Rental[]>(mockRentals);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);

  const filteredRentals =
    activeTab === 'all'
      ? rentals
      : rentals.filter((r) => r.status === activeTab);

  const handleApprove = (rentalId: string) => {
    // TODO: Connect to backend API
    setRentals(
      rentals.map((r) =>
        r.id === rentalId ? { ...r, status: 'approved' as RentalStatus } : r
      )
    );
    setSelectedRental(null);
  };

  const handleReject = (rentalId: string) => {
    // TODO: Connect to backend API
    setRentals(
      rentals.map((r) =>
        r.id === rentalId ? { ...r, status: 'rejected' as RentalStatus } : r
      )
    );
    setSelectedRental(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Rental Requests
            </h1>
            <p className="text-muted-foreground">
              Manage incoming rental requests for your vehicles
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.status
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.label}
                {tab.status !== 'all' && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-background/30 text-xs">
                    {rentals.filter((r) => r.status === tab.status).length}
                  </span>
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Requests List */}
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
                  className={`glass rounded-xl overflow-hidden border ${
                    rental.status === 'pending' ? 'border-warning/30' : 'border-transparent'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Vehicle Image */}
                    <div className="lg:w-56 aspect-video lg:aspect-square">
                      <img
                        src={rental.vehicle?.image}
                        alt={`${rental.vehicle?.company} ${rental.vehicle?.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="space-y-3">
                          {/* Vehicle Info */}
                          <div>
                            <h3 className="text-lg font-display font-semibold text-foreground">
                              {rental.vehicle?.company} {rental.vehicle?.model}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {rental.vehicle?.year} • {rental.vehicle?.numberPlate}
                            </p>
                          </div>

                          {/* Renter Info */}
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                              {rental.renterAvatar ? (
                                <img
                                  src={rental.renterAvatar}
                                  alt={rental.renterName}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <User className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {rental.renterName}
                              </p>
                              <p className="text-xs text-muted-foreground">Renter</p>
                            </div>
                          </div>

                          {/* Time Range */}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(rental.startTime).toLocaleDateString()},{' '}
                              {new Date(rental.startTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}{' '}
                              -{' '}
                              {new Date(rental.endTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Status & Actions */}
                        <div className="flex flex-col items-start lg:items-end gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${
                              statusColors[rental.status]
                            }`}
                          >
                            {rental.status.charAt(0).toUpperCase() +
                              rental.status.slice(1)}
                          </span>
                          <p className="text-2xl font-display font-bold text-primary">
                            ${rental.totalCost}
                          </p>

                          {rental.status === 'pending' && (
                            <div className="flex gap-2">
                              <motion.button
                                onClick={() => handleApprove(rental.id)}
                                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-success text-success-foreground font-medium hover:glow-success transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Check className="w-4 h-4" />
                                Approve
                              </motion.button>
                              <motion.button
                                onClick={() => handleReject(rental.id)}
                                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-medium hover:glow-destructive transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <X className="w-4 h-4" />
                                Reject
                              </motion.button>
                            </div>
                          )}

                          <motion.button
                            onClick={() => setSelectedRental(rental)}
                            className="text-sm text-primary hover:underline"
                            whileHover={{ scale: 1.02 }}
                          >
                            View Details
                          </motion.button>
                        </div>
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
                  No requests found in this category.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Request Details Modal */}
      <Modal
        isOpen={!!selectedRental}
        onClose={() => setSelectedRental(null)}
        title="Request Details"
        size="lg"
      >
        {selectedRental && (
          <div className="space-y-6">
            <div className="aspect-video rounded-xl overflow-hidden">
              <img
                src={selectedRental.vehicle?.image}
                alt={selectedRental.vehicle?.model}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-muted-foreground mb-1">Vehicle</h3>
                  <p className="text-foreground font-medium">
                    {selectedRental.vehicle?.company} {selectedRental.vehicle?.model}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground mb-1">Renter</h3>
                  <p className="text-foreground font-medium">
                    {selectedRental.renterName}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground mb-1">Duration</h3>
                  <p className="text-foreground">
                    {new Date(selectedRental.startTime).toLocaleString()} to{' '}
                    {new Date(selectedRental.endTime).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-muted-foreground mb-1">Status</h3>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[selectedRental.status]
                    }`}
                  >
                    {selectedRental.status.charAt(0).toUpperCase() +
                      selectedRental.status.slice(1)}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground mb-1">Total Cost</h3>
                  <p className="text-2xl font-display font-bold text-primary">
                    ${selectedRental.totalCost}
                  </p>
                </div>
              </div>
            </div>

            {selectedRental.status === 'pending' && (
              <div className="flex gap-4 pt-4 border-t border-border">
                <motion.button
                  onClick={() => handleApprove(selectedRental.id)}
                  className="btn-success flex-1 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Check className="w-5 h-5" />
                  Approve Request
                </motion.button>
                <motion.button
                  onClick={() => handleReject(selectedRental.id)}
                  className="btn-destructive flex-1 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <X className="w-5 h-5" />
                  Reject Request
                </motion.button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RequestApproval;
