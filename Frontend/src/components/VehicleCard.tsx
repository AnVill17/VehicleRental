import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';
import { Vehicle } from '@/types';

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick?: () => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onClick }) => {
  const categoryColors = {
    car: 'bg-primary/20 text-primary',
    bike: 'bg-secondary/20 text-secondary',
    suv: 'bg-success/20 text-success',
    truck: 'bg-warning/20 text-warning',
    van: 'bg-destructive/20 text-destructive',
  };

  return (
    <motion.div
      className="card-vehicle"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <motion.img
          src={vehicle.image}
          alt={`${vehicle.company} ${vehicle.model}`}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              categoryColors[vehicle.category]
            }`}
          >
            {vehicle.category.toUpperCase()}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm">
          <Star className="w-3 h-3 fill-warning text-warning" />
          <span className="text-xs font-medium text-foreground">
            {vehicle.rating.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-display font-semibold text-foreground">
              {vehicle.company} {vehicle.model}
            </h3>
            <p className="text-sm text-muted-foreground">{vehicle.year}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          {vehicle.distance !== undefined && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{vehicle.distance.toFixed(1)} km</span>
            </div>
          )}
          <div className="ml-auto">
            <span className="text-xl font-bold text-primary">
              ${vehicle.pricePerHour}
            </span>
            <span className="text-sm text-muted-foreground">/hr</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
