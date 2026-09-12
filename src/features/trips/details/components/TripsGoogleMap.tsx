interface TripGoogleMapProps {
  url: string;
}

export function TripGoogleMap({ url }: TripGoogleMapProps) {
  return (
    <div className="overflow-hidden rounded-lg">
      <iframe
        src={url}
        title={"Google Map"}
        className="h-[500px] w-full border-0"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
