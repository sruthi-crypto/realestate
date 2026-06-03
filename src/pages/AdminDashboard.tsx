import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, MapPin, Home, CheckCircle, XCircle, AlertTriangle, Film } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearDeletePropertyAction, clearGetAllPropertiesAction, deletePropertyAction, getAllPropertiesAction } from "@/store/actions";
import { PropertyData } from "@/types/responses";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { DELETE_PROPERTY } from "@/constants";
import { deleteFilesFromSupabase, resolveSupabasePublicUrl } from "@/supabase";

// ── helpers ───────────────────────────────────────────────────────────────────
function isVideoUrl(url: string): boolean {
  return /\.(mp4|mov|avi|webm|mkv|m4v|ogv)(\?.*)?$/i.test(url);
}

function formatPrice(price: number | string) {
  const n = Number(price);
  if (isNaN(n)) return String(price);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function formatArea(area: number, unit: string) {
  const unitLabel: Record<string, string> = { sqft: "sq.ft", sqm: "sq.m", acre: "acre" };
  return `${area.toLocaleString()} ${unitLabel[unit] || unit}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// ── Delete Confirmation Modal ─────────────────────────────────────────────────
function DeleteConfirmModal({
  open, propertyTitle, onConfirm, onCancel, loading,
}: {
  open: boolean; propertyTitle: string; onConfirm: () => void; onCancel: () => void; loading?: boolean;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-background shadow-2xl border border-border p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center border-4 border-red-100">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
        </div>
        <div className="text-center mb-6">
          <h3 className="font-display text-lg font-bold text-foreground mb-2">Delete Property?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">"{propertyTitle}"</span>?
            <br />
            This action <span className="text-red-500 font-semibold">cannot be undone</span>.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-border text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Deleting…</>
            ) : (
              <><Trash2 className="w-4 h-4" /> Delete</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Single media slide ────────────────────────────────────────────────────────
function MediaSlide({ url }: { url: string }) {
  const mediaUrl = resolveSupabasePublicUrl(url);

  if (isVideoUrl(url)) {
    return (
      <video
        src={mediaUrl}
        className="w-full h-full object-cover"
        muted
        playsInline
        loop
        autoPlay
        preload="metadata"
      />
    );
  }
  return (
    <img
      src={mediaUrl}
      alt="Property"
      className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
      onError={(e) => {
        (e.target as HTMLImageElement).src =
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='240'%3E%3Crect fill='%23f3f4f6' width='400' height='240'/%3E%3Ctext x='200' y='125' text-anchor='middle' fill='%239ca3af' font-size='14'%3EImage not found%3C/text%3E%3C/svg%3E";
      }}
    />
  );
}

// ── Property Media Carousel ───────────────────────────────────────────────────
function PropertyMediaCarousel({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-muted/50">
        <Home className="w-8 h-8 text-muted-foreground/40" />
        <span className="text-xs text-muted-foreground/60">No media</span>
      </div>
    );
  }

  const prev = (e: React.MouseEvent) => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); };
  const next = (e: React.MouseEvent) => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); };

  const currentIsVideo = isVideoUrl(images[idx]);
  const videoCount = images.filter(isVideoUrl).length;
  const imageCount = images.length - videoCount;

  return (
    <div className="relative w-full h-full group/img">
      <MediaSlide url={images[idx]} />

      {/* video badge for current slide */}
      {currentIsVideo && (
        <div
          className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white"
          style={{ background: "rgba(0,0,0,0.6)", zIndex: 6 }}
        >
          <Film className="w-2.5 h-2.5" /> VIDEO
        </div>
      )}

      {images.length > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/55 text-white flex items-center justify-center sm:opacity-0 sm:group-hover/img:opacity-100 transition-opacity text-base"
            style={{ zIndex: 5 }}
          >‹</button>
          <button onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/55 text-white flex items-center justify-center sm:opacity-0 sm:group-hover/img:opacity-100 transition-opacity text-base"
            style={{ zIndex: 5 }}
          >›</button>

          {/* dot strip — amber tint for video dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1" style={{ zIndex: 5 }}>
            {images.map((url, i) => (
              <span
                key={i}
                className="block rounded-full transition-all"
                style={{
                  width: i === idx ? 14 : 5,
                  height: 5,
                  background: i === idx
                    ? "hsl(152,55%,45%)"
                    : isVideoUrl(url)
                      ? "rgba(255,200,100,0.75)"
                      : "rgba(255,255,255,0.6)",
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* top-right: count + mixed-media summary */}
      <div
        className="absolute top-2 right-2 flex items-center gap-1 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md"
        style={{ background: "rgba(0,0,0,0.5)", zIndex: 5 }}
      >
        {images.length > 1 && <span>{idx + 1}/{images.length}</span>}
        {videoCount > 0 && imageCount > 0 && (
          <span className="ml-1 flex items-center gap-1 opacity-80">
            · 📷{imageCount}
            <Film className="w-2.5 h-2.5 inline" />{videoCount}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Property Card ─────────────────────────────────────────────────────────────
function PropertyCard({
  property, onEdit, onDelete,
}: {
  property: PropertyData; onEdit: () => void; onDelete: () => void;
}) {
  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-background shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col">
      <div className="relative overflow-hidden" style={{ height: "200px" }}>
        <PropertyMediaCarousel images={property.images} />

        <div className="absolute top-3 left-3" style={{ zIndex: 5 }}>
          {property.status === "active" ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-green-500/90 text-white uppercase tracking-wide">
              <CheckCircle className="w-2.5 h-2.5" /> Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-red-500/90 text-white uppercase tracking-wide">
              <XCircle className="w-2.5 h-2.5" /> Inactive
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3" style={{ zIndex: 5 }}>
          <span
            className="text-[10px] font-bold px-2 py-1 rounded-full capitalize text-white"
            style={{ background: "linear-gradient(135deg, hsl(152,55%,32%), hsl(145,47%,45%))" }}
          >
            {property.propertyType}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-bold text-foreground text-base leading-tight mb-1 line-clamp-1">
          {property.title}
        </h3>

        <div className="flex items-center gap-1 text-muted-foreground mb-3">
          <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: "hsl(152,55%,32%)" }} />
          <span className="text-xs truncate">{property.areaName}, {property.city}</span>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">{property.description}</p>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="rounded-lg p-2 text-center" style={{ background: "hsl(152,55%,32%,0.07)", border: "1px solid hsl(152,55%,32%,0.15)" }}>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Price</p>
            <p className="text-sm font-bold" style={{ color: "hsl(152,55%,32%)" }}>{formatPrice(property.price)}</p>
          </div>
          <div className="rounded-lg p-2 text-center" style={{ background: "hsl(152,55%,32%,0.07)", border: "1px solid hsl(152,55%,32%,0.15)" }}>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Area</p>
            <p className="text-sm font-bold text-foreground">{formatArea(property.area, property.areaUnit)}</p>
          </div>
        </div>

        <div className="flex items-start gap-1.5 mb-3 p-2 rounded-lg bg-muted/50">
          <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground line-clamp-1">{property.location}</p>
        </div>

        <p className="text-[10px] text-muted-foreground/60 mb-3">
          Listed {formatDate(property.createdAt)}
          {property.updatedAt !== property.createdAt && ` · Updated ${formatDate(property.updatedAt)}`}
        </p>

        <div className="flex gap-2 mt-auto">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border transition-all duration-200 hover:-translate-y-0.5"
            style={{ borderColor: "hsl(152,55%,32%)", color: "hsl(152,55%,32%)" }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.background = "hsl(152,55%,32%)"; el.style.color = "white"; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.background = "transparent"; el.style.color = "hsl(152,55%,32%)"; }}
          >
            <Pencil className="w-3 h-3" /> Edit
          </button>
          <button
            onClick={onDelete}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-red-200 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 hover:-translate-y-0.5"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Admin Dashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [storageDeleteLoading, setStorageDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string; title: string; images: string[] }>({
    open: false, id: "", title: "", images: [],
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading: getPropertiesLoading, successData: getPropertiesSuccess, error: getPropertiesError, errorInfo: getPropertiesErrorInfo } =
    useAppSelector((s) => s.getAllPropertiesReducer);

  const { loading: deletePropertyLoading, successData: deletePropertySuccess, error: deletePropertyError, errorInfo: deletePropertyErrorInfo } =
    useAppSelector((s) => s.deletePropertyReducer);

  useEffect(() => { dispatch(getAllPropertiesAction()); }, [dispatch]);

  useEffect(() => {
    if (getPropertiesSuccess) { setProperties(getPropertiesSuccess.data); dispatch(clearGetAllPropertiesAction()); }
  }, [getPropertiesSuccess, dispatch]);

  useEffect(() => {
    if (getPropertiesError) toast.error(getPropertiesErrorInfo || "Failed to fetch properties");
  }, [getPropertiesError, getPropertiesErrorInfo]);

  useEffect(() => {
    if (deletePropertySuccess) { dispatch(clearDeletePropertyAction()); dispatch(getAllPropertiesAction()); setDeleteModal({ open: false, id: "", title: "", images: [] }); }
  }, [deletePropertySuccess, dispatch]);

  useEffect(() => {
    if (deletePropertyError) { toast.error(deletePropertyErrorInfo || "Failed to delete property"); setDeleteModal(prev => ({ ...prev, open: false })); }
  }, [deletePropertyError, deletePropertyErrorInfo]);

  const handleDeleteClick = (property: PropertyData) =>
    setDeleteModal({ open: true, id: property.id, title: property.title, images: property.images || [] });

  const handleDeleteConfirm = async () => {
    try {
      setStorageDeleteLoading(true);
      await deleteFilesFromSupabase(deleteModal.images);
      dispatch(deletePropertyAction({ endPoint: `${DELETE_PROPERTY}${deleteModal.id}` }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete property media";
      toast.error(message);
    } finally {
      setStorageDeleteLoading(false);
    }
  };

  const activeCount = properties.filter(p => p.status === "active").length;
  const totalValue = properties.reduce((sum, p) => sum + Number(p.price), 0);

  return (
    <div className="min-h-screen py-8" style={{ background: "hsl(40,33%,98%)" }}>
      <DeleteConfirmModal
        open={deleteModal.open}
        propertyTitle={deleteModal.title}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ open: false, id: "", title: "", images: [] })}
        loading={deletePropertyLoading || storageDeleteLoading}
      />

      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "hsl(152,55%,32%)" }}>Property Management</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Manage Properties</h1>
            <div className="h-1 w-16 rounded-full mt-2" style={{ background: "linear-gradient(90deg, hsl(152,55%,32%), hsl(145,47%,45%))" }} />
          </div>
          <button
            onClick={() => navigate("/product-form")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            style={{ background: "linear-gradient(135deg, hsl(152,55%,32%), hsl(145,47%,45%))" }}
          >
            <Plus className="w-4 h-4" /> Add Property
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Listings", value: properties.length },
            { label: "Active", value: activeCount },
            { label: "Inactive", value: properties.length - activeCount },
            { label: "Portfolio Value", value: formatPrice(totalValue) },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-4 text-center border" style={{ background: "white", borderColor: "hsl(152,55%,32%,0.15)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{s.label}</p>
              <p className="font-display text-2xl font-bold" style={{ color: "hsl(152,55%,32%)" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {getPropertiesLoading && (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "hsl(152,55%,32%)", borderTopColor: "transparent" }} />
            <p className="text-sm text-muted-foreground mt-3">Loading properties...</p>
          </div>
        )}

        {!getPropertiesLoading && properties.length === 0 && (
          <div className="text-center py-20 rounded-2xl border border-dashed border-border bg-muted/30">
            <div className="text-5xl mb-4">🏘️</div>
            <p className="font-display text-xl font-bold text-foreground mb-1">No properties yet</p>
            <p className="text-sm text-muted-foreground mb-5">Add your first property to get started</p>
            <button
              onClick={() => navigate("/product-form")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, hsl(152,55%,32%), hsl(145,47%,45%))" }}
            >
              <Plus className="w-4 h-4" /> Add First Property
            </button>
          </div>
        )}

        {!getPropertiesLoading && properties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {properties.map((p, idx) => (
              <div key={p.id} className="animate-scale-in" style={{ animationDelay: `${idx * 60}ms` }}>
                <PropertyCard
                  property={p}
                  onEdit={() => navigate("/product-form", { state: { product: p } })}
                  onDelete={() => handleDeleteClick(p)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
