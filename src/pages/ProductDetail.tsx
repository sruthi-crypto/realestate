import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Film,
  Home,
  IndianRupee,
  MapPin,
  Maximize2,
  Tag,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { GET_PROPERTY_BY_ID } from "@/constants";
import { getPropertyByIdAction, cleargetPropertyByIdAction } from "@/store/actions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { PropertyData } from "@/types/responses";
import { resolveSupabasePublicUrl } from "@/supabase";

function isVideoUrl(url: string): boolean {
  return /\.(mp4|mov|avi|webm|mkv|m4v|ogv)(\?.*)?$/i.test(url);
}

function formatPrice(price: number | string) {
  const n = Number(price);
  if (Number.isNaN(n)) return String(price);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function formatArea(area: number, unit: string) {
  const unitLabel: Record<string, string> = { sqft: "sq.ft", sqm: "sq.m", acre: "acre" };
  return `${Number(area).toLocaleString("en-IN")} ${unitLabel[unit] || unit}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function normalizePropertyData(data: PropertyData | PropertyData[]): PropertyData | null {
  const property = Array.isArray(data) ? data[0] : data;

  if (!property) return null;

  return {
    ...property,
    images: Array.isArray(property.images) ? property.images.map(resolveSupabasePublicUrl) : [],
    createdAt: property.createdAt || property.createdat,
    updatedAt: property.updatedAt || property.updatedat,
  };
}

function MainMedia({ url, title }: { url?: string; title: string }) {
  if (!url) {
    return (
      <div className="flex h-[75vw] min-h-[240px] max-h-[430px] w-full items-center justify-center bg-muted text-muted-foreground sm:rounded-lg md:aspect-[16/10] md:h-auto md:min-h-[320px] md:max-h-none">
        <div className="text-center">
          <Home className="mx-auto mb-3 h-10 w-10 opacity-40" />
          <p className="text-sm font-medium">No media available</p>
        </div>
      </div>
    );
  }

  const mediaUrl = resolveSupabasePublicUrl(url);

  if (isVideoUrl(url)) {
    return (
      <video
        src={mediaUrl}
        className="h-[75vw] min-h-[240px] max-h-[430px] w-full bg-black object-contain sm:rounded-lg md:aspect-[16/10] md:h-auto md:min-h-[320px] md:max-h-none"
        controls
        playsInline
        preload="metadata"
      />
    );
  }

  return (
    <img
      src={mediaUrl}
      alt={title}
      className="h-[75vw] min-h-[240px] max-h-[430px] w-full bg-muted object-cover sm:rounded-lg md:aspect-[16/10] md:h-auto md:min-h-[320px] md:max-h-none"
      onError={(e) => {
        (e.target as HTMLImageElement).src =
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='600'%3E%3Crect fill='%23f3f4f6' width='900' height='600'/%3E%3Ctext x='450' y='310' text-anchor='middle' fill='%239ca3af' font-size='22'%3EImage not found%3C/text%3E%3C/svg%3E";
      }}
    />
  );
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [selectedMedia, setSelectedMedia] = useState(0);

  const { loading, successData, error, errorInfo } = useAppSelector((s) => s.getPropertyByIdReducer);

  useEffect(() => {
    if (!id) return;
    dispatch(getPropertyByIdAction({ endPoint: `${GET_PROPERTY_BY_ID}${id}` }));

    return () => {
      dispatch(cleargetPropertyByIdAction());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (successData?.data) {
      setProperty(normalizePropertyData(successData.data));
      setSelectedMedia(0);
      dispatch(cleargetPropertyByIdAction());
    }
  }, [dispatch, successData]);

  useEffect(() => {
    if (error) toast.error(errorInfo || "Failed to fetch property");
  }, [error, errorInfo]);


  const media = useMemo(() => property?.images?.filter(Boolean) || [], [property]);
  const activeUrl = media[selectedMedia];
  const videoCount = media.filter(isVideoUrl).length;
  const photoCount = media.length - videoCount;

  if (loading && !property) {
    return (
      <div className="container py-16">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-4 text-center text-sm text-muted-foreground">Loading property...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-16 text-center">
        <h1 className="font-display text-3xl font-bold text-foreground">Property not found</h1>
        <p className="mt-3 text-muted-foreground">This listing may be unavailable or removed.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Properties
        </Link>
      </div>
    );
  }

  const isActive = property.status === "active";

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border bg-gradient-to-br from-primary via-primary to-accent px-4 py-8 text-primary-foreground md:py-12">
        <div className="container">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/25"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="max-w-4xl">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                <Tag className="h-3 w-3" />
                {property.propertyType}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                {isActive ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold leading-tight md:text-5xl">{property.title}</h1>
            <p className="mt-3 flex items-center gap-2 text-sm text-primary-foreground/90 md:text-base">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              {property.areaName ? `${property.areaName}, ${property.city}` : property.location || property.city}
            </p>
          </div>
        </div>
      </section>

      <div className="container py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]">
          <div className="space-y-4">
            <div className="-mx-8 sm:mx-0">
              <MainMedia url={activeUrl} title={property.title} />
            </div>

            {media.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                {media.map((url, index) => {
                  const isVideo = isVideoUrl(url);
                  const selected = selectedMedia === index;

                  return (
                    <button
                      key={`${url}-${index}`}
                      onClick={() => setSelectedMedia(index)}
                      className={`group relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted text-left transition-all ${selected ? "border-primary shadow-lg ring-2 ring-primary/25" : "border-border hover:border-primary/60"
                        }`}
                      aria-label={`Show media ${index + 1}`}
                    >
                      {isVideo ? (
                        <video src={resolveSupabasePublicUrl(url)} className="h-full w-full object-cover" muted playsInline preload="metadata" />
                      ) : (
                        <img src={resolveSupabasePublicUrl(url)} alt={`${property.title} ${index + 1}`} className="h-full w-full object-cover" />
                      )}
                      <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {index + 1}
                      </span>
                      {isVideo && (
                        <span className="absolute right-1.5 top-1.5 rounded-md bg-black/60 p-1 text-white">
                          <Film className="h-3 w-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="space-y-5">
            <div className="rounded-lg border border-border bg-card p-5 shadow-card">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Price</p>
              <div className="mt-2 flex items-center gap-2 text-primary">
                <IndianRupee className="h-5 w-5" />
                <p className="font-display text-3xl font-bold">{property.price ? formatPrice(property.price) : "Ask for price"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-primary/15 bg-primary/5 p-4">
                <Maximize2 className="mb-2 h-4 w-4 text-primary" />
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Area</p>
                <p className="mt-1 text-sm font-bold text-foreground">
                  {property.area && property.areaUnit ? formatArea(property.area, property.areaUnit) : property.area || "-"}
                </p>
              </div>
              <div className="rounded-lg border border-primary/15 bg-primary/5 p-4">
                <Film className="mb-2 h-4 w-4 text-primary" />
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Media</p>
                <p className="mt-1 text-sm font-bold text-foreground">
                  {photoCount} photos{videoCount ? `, ${videoCount} videos` : ""}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-5 shadow-card">
              <h2 className="font-display text-xl font-bold text-foreground">Property Details</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{property.description}</p>

              <div className="mt-5 space-y-3 text-sm">
                {property.location && (
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span className="text-muted-foreground">{property.location}</span>
                  </div>
                )}
                {property.createdAt && (
                  <div className="flex gap-3">
                    <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span className="text-muted-foreground">Listed {formatDate(property.createdAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
