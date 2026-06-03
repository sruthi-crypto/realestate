import { useState } from "react";
import { ChevronLeft, ChevronRight, Home, Film } from "lucide-react";
import { resolveSupabasePublicUrl } from "@/supabase";

// ── helpers ──────────────────────────────────────────────────────────────────
function isVideoUrl(url: string): boolean {
  return /\.(mp4|mov|avi|webm|mkv|m4v|ogv)(\?.*)?$/i.test(url);
}

// ── MediaSlide: renders one image or video ────────────────────────────────────
function MediaSlide({ url, active }: { url: string; active: boolean }) {
  const mediaUrl = resolveSupabasePublicUrl(url);

  if (isVideoUrl(url)) {
    return (
      <video
        src={mediaUrl}
        className="h-full w-full object-cover"
        muted
        playsInline
        loop
        autoPlay={active}          // auto-plays only when it's the visible slide
        preload="metadata"
      />
    );
  }
  return (
    <img
      src={mediaUrl}
      alt="Property"
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      onError={(e) => {
        (e.target as HTMLImageElement).src =
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='240'%3E%3Crect fill='%23f3f4f6' width='400' height='240'/%3E%3Ctext x='200' y='125' text-anchor='middle' fill='%239ca3af' font-size='14'%3EImage not found%3C/text%3E%3C/svg%3E";
      }}
    />
  );
}

// ── ImageCarousel (used in ProductCard — public view) ─────────────────────────
const ImageCarousel = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted text-muted-foreground sm:rounded-xl">
        <Home className="w-8 h-8 opacity-30" />
        <span className="text-xs opacity-50">No media available</span>
      </div>
    );
  }

  const isVideo = isVideoUrl(images[current]);
  const videoCount = images.filter(isVideoUrl).length;
  const imageCount = images.length - videoCount;

  return (
    <div className="relative h-full w-full overflow-hidden bg-muted group sm:rounded-xl">
      <MediaSlide url={images[current]} active={true} />

      {/* gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300" />

      {/* video badge */}
      {isVideo && (
        <div
          className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <Film className="w-2.5 h-2.5" /> VIDEO
        </div>
      )}

      {/* media count badge (top-right) */}
      {images.length > 1 && (
        <div
          className="absolute top-3 right-3 z-10 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          {current + 1}/{images.length}
        </div>
      )}

      {images.length > 1 && (
        <>
          {/* Prev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrent((c) => (c - 1 + images.length) % images.length);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/90 backdrop-blur flex items-center justify-center opacity-100 transition-all duration-300 text-foreground shadow-lg hover:-translate-y-1/2 hover:scale-110 hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
            style={{ zIndex: 5 }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(152,55%,32%)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrent((c) => (c + 1) % images.length);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/90 backdrop-blur flex items-center justify-center opacity-100 transition-all duration-300 text-foreground shadow-lg hover:-translate-y-1/2 hover:scale-110 hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
            style={{ zIndex: 5 }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(152,55%,32%)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Dot indicators */}
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 px-2.5 py-1.5 rounded-full"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", zIndex: 5 }}
          >
            {images.map((url, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className="rounded-full transition-all duration-300 flex items-center justify-center"
                style={{
                  width: i === current ? 14 : (isVideoUrl(url) ? 8 : 6),
                  height: 6,
                  background: i === current
                    ? "hsl(152,55%,45%)"
                    : isVideoUrl(url)
                      ? "rgba(255,200,100,0.7)"   // amber tint for video dots
                      : "rgba(255,255,255,0.55)",
                }}
                title={isVideoUrl(url) ? "Video" : "Photo"}
              />
            ))}
          </div>
        </>
      )}

      {/* mixed-media summary badge (bottom-right) */}
      {videoCount > 0 && imageCount > 0 && (
        <div
          className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 text-[10px] font-bold text-white px-2 py-1 rounded-md"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        >
          <span>📷 {imageCount}</span>
          <span className="opacity-40">·</span>
          <Film className="w-2.5 h-2.5" />
          <span>{videoCount}</span>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
