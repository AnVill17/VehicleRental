import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';
import { Vehicle } from '@/types';

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick?: () => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onClick }) => {
  const categoryColors: Record<string, string> = {
    car: 'bg-primary/20 text-primary',
    bike: 'bg-secondary/20 text-secondary',
    suv: 'bg-success/20 text-success',
    truck: 'bg-warning/20 text-warning',
    van: 'bg-destructive/20 text-destructive',
  };

 
  const displayImage = vehicle.images?.[0] || vehicle.image || "https://via.placeholder.com/400x300";


  const ratingValue = typeof vehicle.rating === 'number' 
      ? vehicle.rating 
      : vehicle.rating?.average || 0;

 
  const categoryClass = categoryColors[vehicle.category?.toLowerCase()] || 'bg-primary/20 text-primary';

  return (
    <motion.div
      className="card-vehicle cursor-pointer group" // cursor-pointer
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl">
        <motion.img
          src={displayImage}
          alt={`${vehicle.company} ${vehicle.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${categoryClass}`}>
            {vehicle.category?.toUpperCase() || 'VEHICLE'}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm shadow-sm">
          <Star className="w-3 h-3 fill-warning text-warning" />
          <span className="text-xs font-medium text-foreground">
            {ratingValue.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="p-4 bg-card">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-display font-semibold text-foreground text-lg">
              {vehicle.company} {vehicle.model}
            </h3>
            <p className="text-sm text-muted-foreground">{vehicle.year}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          {/* Distance (Only shows if geolocation was used) */}
          {vehicle.distance !== undefined ? (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{vehicle.distance.toFixed(1)} km</span>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Available</div>
          )}

          <div className="ml-auto text-right">
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