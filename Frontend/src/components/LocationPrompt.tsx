import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface LocationPromptProps {
  isOpen: boolean;
  isLoading: boolean;
  onRequestLocation: () => void;
  onSkip: () => void;
}

export const LocationPrompt: React.FC<LocationPromptProps> = ({
  isOpen,
  isLoading,
  onRequestLocation,
  onSkip,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-background/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative max-w-md w-full glass-strong rounded-2xl p-8 text-center"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            {isLoading ? (
              <div className="py-8">
                <LoadingSpinner size="lg" text="Detecting your location..." />
              </div>
            ) : (
              <>
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <MapPin className="w-10 h-10 text-primary" />
                </motion.div>

                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                  Enable Location
                </h2>
                <p className="text-muted-foreground mb-8">
                  Allow location access to discover vehicles near you and get accurate distance information.
                </p>

                <div className="flex flex-col gap-3">
                  <motion.button
                    onClick={onRequestLocation}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Navigation className="w-5 h-5" />
                    Enable Location
                  </motion.button>
                  <motion.button
                    onClick={onSkip}
                    className="btn-ghost w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Skip for now
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
