import { Star } from 'lucide-react';

export default function StarRating({ rating, reviews, size = 14, showCount = true }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="text-gray-300 fill-gray-300" />
            {rating >= star ? (
              <Star size={size} className="absolute inset-0 text-[#ff9900] fill-[#ff9900]" />
            ) : rating >= star - 0.5 ? (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: '50%' }}
              >
                <Star size={size} className="text-[#ff9900] fill-[#ff9900]" />
              </span>
            ) : null}
          </span>
        ))}
      </div>
      {showCount && reviews !== undefined && (
        <span className="text-[#007185] hover:text-[#c7511f] text-xs cursor-pointer">
          {reviews.toLocaleString()}
        </span>
      )}
    </div>
  );
}
