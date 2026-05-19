import { Product } from "@/data/types";
import ImageCarousel from "./ImageCarousel";
import { MapPin, Tag, IndianRupee, Maximize2, CheckCircle, XCircle, Calendar } from "lucide-react";
import { PropertyData } from "@/types/responses";

function formatPrice(price: number | string) {
  const n = Number(price);
  if (isNaN(n)) return String(price);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function formatArea(area: number, unit: string) {
  const unitLabel: Record<string, string> = { sqft: "sq.ft", sqm: "sq.m", acre: "acre" };
  return `${Number(area).toLocaleString()} ${unitLabel[unit] || unit}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const ProductCard = ({ product }: { product: PropertyData }) => {
  const isActive = product.status === "active";

  return (
    <div className="rounded-2xl border border-border bg-background shadow-card hover:shadow-elevated hover:border-primary/50 transition-smooth hover-lift overflow-hidden group flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: "200px" }}>
        <ImageCarousel images={product.images} />

        {/* Status badge */}
        <div className="absolute top-3 left-3 z-10">
          {isActive ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-green-500/90 text-white uppercase tracking-wide">
              <CheckCircle className="w-2.5 h-2.5" /> Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-red-500/90 text-white uppercase tracking-wide">
              <XCircle className="w-2.5 h-2.5" /> Inactive
            </span>
          )}
        </div>

        {/* Property type badge */}
        {product.propertyType && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="text-[10px] font-bold px-2 py-1 rounded-full capitalize text-white"
              style={{ background: "linear-gradient(135deg, hsl(152,55%,32%), hsl(145,47%,45%))" }}>
              {product.propertyType}
            </span>
          </div>
        )}

        {/* Image count badge */}
        {product.images?.length > 1 && (
          <div className="absolute top-3 right-3 z-10 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md"
            style={{ background: "rgba(0,0,0,0.5)" }}>
            {product.images.length} photos
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 space-y-3">
        {/* Title */}
        <h3 className="font-display text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-1">
          {product.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-primary" />
          <span className="text-xs truncate">
            {product.areaName ? `${product.areaName}, ${product.city}` : product.area}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price + Area stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg p-2 text-center"
            style={{ background: "hsl(152,55%,32%,0.07)", border: "1px solid hsl(152,55%,32%,0.15)" }}>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Price</p>
            <p className="text-sm font-bold" style={{ color: "hsl(152,55%,32%)" }}>
              {product.price ? formatPrice(product.price) : "—"}
            </p>
          </div>
          <div className="rounded-lg p-2 text-center"
            style={{ background: "hsl(152,55%,32%,0.07)", border: "1px solid hsl(152,55%,32%,0.15)" }}>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Area</p>
            <p className="text-sm font-bold text-foreground">
              {product.area && product.areaUnit
                ? formatArea(product.area, product.areaUnit)
                : product.area || "—"}
            </p>
          </div>
        </div>

        {/* Category */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="p-1.5 bg-secondary/10 rounded-md">
            <Tag className="h-3.5 w-3.5 text-secondary" />
          </div>
          <span className="truncate">{product.propertyType}</span>
        </div>

        {/* Full address */}
        {product.location && (
          <div className="flex items-start gap-1.5 p-2 rounded-lg bg-muted/50">
            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
            <p className="text-xs text-muted-foreground line-clamp-1">{product.location}</p>
          </div>
        )}

        {/* Listed date */}
        {product.createdAt && (
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
            <Calendar className="w-3 h-3" />
            <span>Listed {formatDate(product.createdAt)}</span>
            {product.updatedAt && product.updatedAt !== product.createdAt && (
              <span>· Updated {formatDate(product.updatedAt)}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;