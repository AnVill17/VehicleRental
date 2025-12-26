import { motion } from 'framer-motion';
import { ArrowRight, Car, Shield, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';

const features = [
  {
    icon: Zap,
    title: 'Instant Booking',
    description: 'Book vehicles in seconds with our streamlined rental process.',
  },
  {
    icon: Shield,
    title: 'Verified Owners',
    description: 'All vehicle owners are verified for your safety and peace of mind.',
  },
  {
    icon: Star,
    title: 'Top-Rated Fleet',
    description: 'Choose from our collection of highly-rated, well-maintained vehicles.',
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Now serving 10,000+ cities worldwide
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
              <span className="text-foreground">Rent Any Vehicle,</span>
              <br />
              <span className="gradient-text">Anytime, Anywhere</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Discover and rent vehicles from verified owners in your area.
              From luxury cars to bikes, find the perfect ride for any occasion.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <motion.button
                  className="btn-primary flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/explore">
                <motion.button
                  className="btn-ghost flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Car className="w-5 h-5" />
                  Browse Vehicles
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="mt-16 relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden glass">
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200"
                alt="Luxury car"
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              
              {/* Floating Stats */}
              <motion.div
                className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                {[
                  { label: 'Vehicles', value: '50K+' },
                  { label: 'Happy Renters', value: '200K+' },
                  { label: 'Cities', value: '10K+' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="glass px-6 py-3 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className="text-2xl font-display font-bold text-primary">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Why Choose VehiRent?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We make vehicle rental simple, safe, and accessible for everyone.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass rounded-2xl p-8 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <motion.div
                  className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center"
                  whileHover={{ rotate: 10 }}
                >
                  <feature.icon className="w-8 h-8 text-primary" />
                </motion.div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            className="relative glass rounded-3xl p-12 md:p-16 text-center overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of users who are already enjoying seamless vehicle rentals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <motion.button
                    className="btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign Up as Renter
                  </motion.button>
                </Link>
                <Link to="/signup?role=lender">
                  <motion.button
                    className="btn-secondary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    List Your Vehicle
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            <span className="font-display font-bold gradient-text">VehiRent</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 VehiRent. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
