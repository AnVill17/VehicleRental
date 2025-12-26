import { motion } from 'framer-motion';
import { Car, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { StatCard } from '@/components/StatCard';
import { mockVehicles, mockRentals } from '@/data/mockData';

const LenderDashboard = () => {
  const stats = [
    {
      title: 'Total Vehicles',
      value: mockVehicles.length,
      icon: Car,
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Pending Requests',
      value: mockRentals.filter((r) => r.status === 'pending').length,
      icon: Clock,
      trend: { value: 3, isPositive: false },
    },
    {
      title: 'Approved Bookings',
      value: mockRentals.filter((r) => r.status === 'approved').length,
      icon: CheckCircle,
      trend: { value: 8, isPositive: true },
    },
    {
      title: 'Monthly Earnings',
      value: '$2,450',
      icon: TrendingUp,
      trend: { value: 15, isPositive: true },
    },
  ];

  const recentRequests = mockRentals.slice(0, 3);

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
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your rental business.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={stat.title} {...stat} delay={index * 0.1} />
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Requests */}
            <motion.div
              className="glass rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-xl font-display font-bold text-foreground mb-4">
                Recent Requests
              </h2>
              <div className="space-y-4">
                {recentRequests.map((rental) => (
                  <motion.div
                    key={rental.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <img
                      src={rental.vehicle?.image}
                      alt={rental.vehicle?.model}
                      className="w-16 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {rental.vehicle?.company} {rental.vehicle?.model}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {rental.renterName}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        rental.status === 'pending'
                          ? 'bg-warning/20 text-warning'
                          : rental.status === 'approved'
                          ? 'bg-success/20 text-success'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {rental.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats Chart Placeholder */}
            <motion.div
              className="glass rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-xl font-display font-bold text-foreground mb-4">
                Earnings Overview
              </h2>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    className="text-6xl font-display font-bold gradient-text mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: 'spring' }}
                  >
                    $12,450
                  </motion.div>
                  <p className="text-muted-foreground">Total earnings this year</p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-success">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-medium">+24% from last year</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Top Performing Vehicles */}
          <motion.div
            className="mt-8 glass rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-display font-bold text-foreground mb-4">
              Top Performing Vehicles
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockVehicles.slice(0, 3).map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  className="relative rounded-xl overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={vehicle.image}
                    alt={vehicle.model}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="font-display font-semibold text-foreground">
                      {vehicle.company} {vehicle.model}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-muted-foreground">
                        {12 - index * 3} rentals
                      </span>
                      <span className="text-primary font-bold">
                        ${(vehicle.pricePerHour * (12 - index * 3) * 5).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LenderDashboard;
