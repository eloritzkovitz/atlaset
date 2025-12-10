import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa6";

interface StarRatingInputProps {
  value: number;
  onChange: (v: number) => void;
}

export function StarRatingInput({ value, onChange }: StarRatingInputProps) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center">
      {stars.map((star) => {
        const full = value >= star;
        const half = value >= star - 0.5 && value < star;
        return (
          <span
            key={star}
            className="cursor-pointer"
            onClick={() => onChange(star)}
            onMouseDown={(e) => {
              if (e.nativeEvent.offsetX < 12) onChange(star - 0.5);
            }}
          >
            {full ? (
              <FaStar size={28} color="#FFD700" />
            ) : half ? (
              <FaStarHalf size={28} color="#FFD700" />
            ) : (
              <FaRegStar size={28} color="#FFD700" />
            )}
          </span>
        );
      })}
    </div>
  );
}
