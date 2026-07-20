import { event } from "@/lib/event";

export function MapPanel() {
  return (
    <div className="overflow-hidden ring-1 ring-[var(--line)]">
      <iframe
        title={`Map — ${event.location.name}`}
        src={event.maps.embedUrl}
        className="h-44 w-full border-0 grayscale-[30%] contrast-[0.95] saturate-[0.85] sm:h-48"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
