import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useState } from 'react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  interactive = false,
  onRate,
  size = 'md',
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const handleClick = (index: number) => {
    if (interactive && onRate) {
      onRate(index + 1);
    }
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const isFilled = interactive
          ? index < (hoverRating || rating)
          : index < rating;

        return (
          <motion.button
            key={index}
            type="button"
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
            whileHover={interactive ? { scale: 1.2 } : {}}
            whileTap={interactive ? { scale: 0.9 } : {}}
            onMouseEnter={() => interactive && setHoverRating(index + 1)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => handleClick(index)}
          >
            <Star
              className={`${sizeClasses[size]} transition-colors duration-200 ${
                isFilled
                  ? 'fill-warning text-warning'
                  : 'fill-transparent text-muted-foreground'
              }`}
            />
          </motion.button>
        );
      })}
    </div>
  );
};
