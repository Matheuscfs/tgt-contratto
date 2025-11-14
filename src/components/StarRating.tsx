
import React from 'react';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, maxRating = 5 }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => (
                <StarSolid key={`full-${i}`} className="w-5 h-5 text-yellow-400" />
            ))}
            {/* Note: This simplified version doesn't render half stars, but rounds down. */}
            {[...Array(emptyStars + (hasHalfStar ? 1 : 0))].map((_, i) => (
                 <StarOutline key={`empty-${i}`} className="w-5 h-5 text-yellow-400" />
            ))}
        </div>
    );
};

export default StarRating;
