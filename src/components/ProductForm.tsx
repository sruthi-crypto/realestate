import { useState, useEffect } from "react";
import { X, MapPin, Home, DollarSign, ImageIcon, Trash2, Film, FileImage } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createPropertyAction,
  updatePropertyAction,
  clearCreatePropertyAction,
  clearupdatePropertyAction,
} from "@/store/actions";
import { toast } from "sonner";
import { PropertyData } from "@/types/responses";
import { resolveSupabasePublicUrl, uploadFilesToSupabase } from "@/supabase";

interface Props {
  initialData?: PropertyData | null;
  onCancel: () => void;
}

interface MediaItem {
  url: string;
  type: "image" | "video";
  file?: File;
  uploaded?: boolean;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  city: Yup.string().required("City is required"),
  areaName: Yup.string().required("Area Name is required"),
  location: Yup.string().required("Location is required"),
  propertyType: Yup.string().required("Property Type is required"),
  area: Yup.number().required("Area is required"),
  areaUnit: Yup.string().required("Area Unit is required"),
  price: Yup.string().required("Price is required"),
  status: Yup.string().required("Status is required"),
});

const inputClass =
  "w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 bg-background text-foreground placeholder:text-muted-foreground border-border"
  + " focus:border-[hsl(152,55%,32%)] focus:shadow-[0_0_0_3px_hsl(152,55%,32%,0.12)]";

const labelClass =
  "block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2";

const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <div
      className="w-7 h-7 rounded-lg flex items-center justify-center"
      style={{ background: "hsl(152,55%,32%,0.1)" }}
    >
      <Icon className="w-3.5 h-3.5" style={{ color: "hsl(152,55%,32%)" }} />
    </div>
    <span
      className="text-[10px] font-bold uppercase tracking-widest"
      style={{ color: "hsl(152,55%,32%)" }}
    >
      {title}
    </span>
    <div className="flex-1 h-px ml-1" style={{ background: "hsl(152,55%,32%,0.15)" }} />
  </div>
);

// Detect if a URL is a video by extension
function isVideoUrl(url: string): boolean {
  return /\.(mp4|mov|avi|webm|mkv|m4v|ogv)(\?.*)?$/i.test(url);
}

// Build MediaItem list from raw URLs
function toMediaItems(urls: string[]): MediaItem[] {
  return urls.map((url) => {
    const mediaUrl = resolveSupabasePublicUrl(url);
    return { url: mediaUrl, type: isVideoUrl(mediaUrl) ? "video" : "image" };
  });
}

const ProductForm = ({ initialData, onCancel }: Props) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  // track which tab is active for the media type filter
  const [mediaFilter, setMediaFilter] = useState<"all" | "images" | "videos">("all");

  const {
    loading: createLoading,
    successData: createSuccess,
    error: createError,
    errorInfo: createErrorInfo,
  } = useAppSelector((s) => s.createPropertyReducer);

  const {
    loading: updateLoading,
    successData: updateSuccess,
    error: updateError,
    errorInfo: updateErrorInfo,
  } = useAppSelector((s) => s.updatePropertyReducer);

  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      city: "",
      areaName: "",
      location: "",
      propertyType: "",
      area: 0,
      areaUnit: "",
      price: "",
      images: [] as string[],
      status: "active",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setUploadingMedia(true);
        const uploadedMedia = await uploadPendingMedia(mediaItems);
        const payload = { ...values, images: uploadedMedia.map((item) => item.url) };

        if (initialData) {
          dispatch(updatePropertyAction({ endPoint: `properties/${initialData.id}`, ...payload }));
        } else {
          dispatch(createPropertyAction(payload));
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Media upload failed";
        toast.error(message);
      } finally {
        setUploadingMedia(false);
      }
    },
  });

  useEffect(() => {
    if (createSuccess) {
      toast.success("Property created successfully");
      dispatch(clearCreatePropertyAction());
      onCancel();
    }
    if (createError) toast.error(createErrorInfo);
  }, [createSuccess, createError, createErrorInfo, dispatch, onCancel]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success("Property updated successfully");
      dispatch(clearupdatePropertyAction());
      onCancel();
    }
    if (updateError) toast.error(updateErrorInfo);
  }, [updateSuccess, updateError, updateErrorInfo, dispatch, onCancel]);

  useEffect(() => {
    if (initialData) {
      formik.setValues({
        title: initialData.title || "",
        description: initialData.description || "",
        city: initialData.city || "",
        areaName: initialData.areaName || "",
        location: initialData.location || "",
        propertyType: initialData.propertyType || "",
        area: initialData.area || 0,
        areaUnit: initialData.areaUnit || "",
        price: String(initialData.price || ""),
        images: (initialData.images || []).map(resolveSupabasePublicUrl),
        status: initialData.status || "active",
      });
      setMediaItems(toMediaItems(initialData.images || []).map((item) => ({ ...item, uploaded: true })));
    }
  }, [initialData]);

  const isLoading = createLoading || updateLoading || uploadingMedia;

  const uploadPendingMedia = async (items: MediaItem[]) => {
    const pendingMedia = items.filter((item) => item.file);

    if (pendingMedia.length === 0) {
      return items.map(({ file, uploaded, ...item }) => item);
    }

    const uploadedMedia = await uploadFilesToSupabase(
      pendingMedia
        .map((item) => item.file)
        .filter((file): file is File => Boolean(file))
    );

    let uploadIndex = 0;
    const uploadedItems = items.map((item): MediaItem => {
      if (!item.file) {
        return { url: item.url, type: item.type, uploaded: true };
      }

      const uploaded = uploadedMedia[uploadIndex++];
      return {
        url: uploaded?.url ?? item.url,
        type: uploaded?.resourceType === "video" || item.file.type.startsWith("video/") ? "video" : "image",
        uploaded: true,
      };
    });

    setMediaItems(uploadedItems);
    return uploadedItems.map(({ file, uploaded, ...item }) => item);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedMedia = Array.from(files).map((file): MediaItem => ({
      type: file.type.startsWith("video/") ? "video" : "image",
      url: URL.createObjectURL(file),
      file,
      uploaded: false,
    }));

    setMediaItems((prev) => [...prev, ...selectedMedia]);
    e.target.value = "";
  };

  const removeMedia = (index: number) => {
    setMediaItems((prev) => prev.filter((_, i) => i !== index));
  };

  const FieldError = ({ name }: { name: string }) => {
    const touched = (formik.touched as any)[name];
    const error = (formik.errors as any)[name];
    return touched && error ? (
      <p className="text-xs text-red-500 mt-1">{error}</p>
    ) : null;
  };

  // Filtered view
  const imageCount = mediaItems.filter((m) => m.type === "image").length;
  const videoCount = mediaItems.filter((m) => m.type === "video").length;
  const filteredMedia =
    mediaFilter === "images"
      ? mediaItems.map((m, i) => ({ ...m, originalIdx: i })).filter((m) => m.type === "image")
      : mediaFilter === "videos"
        ? mediaItems.map((m, i) => ({ ...m, originalIdx: i })).filter((m) => m.type === "video")
        : mediaItems.map((m, i) => ({ ...m, originalIdx: i }));

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex justify-between items-start pb-5 mb-6 border-b border-border">
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-1"
            style={{ color: "hsl(152,55%,32%)" }}
          >
            {initialData ? "Edit Listing" : "New Listing"}
          </p>
          <h2 className="font-display text-2xl font-bold text-foreground">
            {initialData ? "Edit Property" : "Add New Property"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {initialData
              ? "Update the property details below"
              : "Fill in the details to list a new property"}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors mt-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-7">

        {/* ── Basic Info ─────────────────────────────────────────────────────── */}
        <div>
          <SectionHeader icon={Home} title="Basic Information" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className={labelClass}>Property Title *</label>
              <input
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. Premium Villa in Jubilee Hills"
                className={inputClass}
              />
              <FieldError name="title" />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Description *</label>
              <textarea
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={9}
                placeholder="Describe the property, amenities, surroundings..."
                className={inputClass + " resize-none"}
              />
              <FieldError name="description" />
            </div>

            <div>
              <label className={labelClass}>Property Type *</label>
              <select
                name="propertyType"
                value={formik.values.propertyType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputClass}
              >
                <option value="" disabled>Select property type</option>
                <option value="Open Plots">Open Plots</option>
                <option value="Apartments">Apartments</option>
                <option value="Gated Villas">Gated Villas</option>
                <option value="Gated Communities">Gated Communities</option>
              </select>
              <FieldError name="propertyType" />
            </div>

            <div>
              <label className={labelClass}>Status</label>
              <select
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                className={inputClass}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Location ───────────────────────────────────────────────────────── */}
        <div>
          <SectionHeader icon={MapPin} title="Location Details" />
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>City *</label>
              <input
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. Hyderabad"
                className={inputClass}
              />
              <FieldError name="city" />
            </div>

            <div>
              <label className={labelClass}>Area / Locality *</label>
              <input
                name="areaName"
                value={formik.values.areaName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. Gachibowli"
                className={inputClass}
              />
              <FieldError name="areaName" />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Full Location / Address *</label>
              <input
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. Plot No. 12, Sector 5, Gachibowli, Hyderabad"
                className={inputClass}
              />
              <FieldError name="location" />
            </div>
          </div>
        </div>

        {/* ── Pricing & Area ─────────────────────────────────────────────────── */}
        <div>
          <SectionHeader icon={DollarSign} title="Pricing & Area" />
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className={labelClass}>Price (₹) *</label>
              <input
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. 5000000"
                className={inputClass}
              />
              <FieldError name="price" />
            </div>

            <div>
              <label className={labelClass}>Area Size *</label>
              <input
                type="string"
                name="area"
                value={formik.values.area}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. 1200"
                className={inputClass}
                min={0}
              />
              <FieldError name="area" />
            </div>

            <div>
              <label className={labelClass}>Area Unit *</label>
              <select
                name="areaUnit"
                value={formik.values.areaUnit}
                onChange={formik.handleChange}
                className={inputClass}
              >
                <option value="">Select unit</option>
                <option value="sqft">Sq Ft</option>
                <option value="sqm">Sq Yard</option>
                <option value="acre">Acre</option>
              </select>
              <FieldError name="areaUnit" />
            </div>
          </div>
        </div>

        {/* ── Media Upload ───────────────────────────────────────────────────── */}
        <div>
          <SectionHeader icon={ImageIcon} title="Photos & Videos" />

          <div className="space-y-4 w-full">
            {/* Upload zone — two buttons side by side */}
            <div className="w-full">
              {/* ── Combined Full Width Upload Zone ───────────────────────────── */}
              <label
                className={`relative w-full min-h-[280px] flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300 group
    ${uploadingMedia ? "opacity-60 pointer-events-none" : "hover:bg-muted/30"}
  `}
                style={{ borderColor: "hsl(152,55%,32%,0.3)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "hsl(152,55%,32%)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "hsl(152,55%,32%,0.3)";
                }}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="sr-only"
                  disabled={uploadingMedia}
                  onChange={handleFileChange}
                />

                {/* Icons */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ background: "hsl(152,55%,32%,0.1)" }}
                  >
                    <FileImage
                      className="w-7 h-7"
                      style={{ color: "hsl(152,55%,32%)" }}
                    />
                  </div>

                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ background: "hsl(152,55%,32%,0.1)" }}
                  >
                    <Film
                      className="w-7 h-7"
                      style={{ color: "hsl(152,55%,32%)" }}
                    />
                  </div>
                </div>

                {/* Text */}
                <div>
                  <p className="text-base font-bold text-foreground">
                    Upload Photos & Videos
                  </p>

                  <p className="text-sm text-muted-foreground mt-1">
                    Drag & drop files here or click to browse
                  </p>

                  <p className="text-xs text-muted-foreground mt-2">
                    Supports JPG, PNG, WEBP, MP4, MOV, WEBM
                  </p>
                </div>

                {/* Bottom Badge */}
                <div
                  className="px-4 py-1.5 rounded-full text-[11px] font-semibold"
                  style={{
                    background: "hsl(152,55%,32%,0.08)",
                    color: "hsl(152,55%,32%)",
                    border: "1px solid hsl(152,55%,32%,0.15)",
                  }}
                >
                  Multiple images & videos supported
                </div>
              </label>
            </div>

            {/* Uploading indicator */}
            {uploadingMedia && (
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: "hsl(152,55%,32%,0.07)", border: "1px solid hsl(152,55%,32%,0.2)" }}
              >
                <span
                  className="w-4 h-4 border-2 rounded-full animate-spin flex-shrink-0"
                  style={{ borderColor: "hsl(152,55%,32%,0.3)", borderTopColor: "hsl(152,55%,32%)" }}
                />
                <p className="text-xs font-semibold" style={{ color: "hsl(152,55%,32%)" }}>
                  Uploading media…
                </p>
              </div>
            )}

            {/* Media preview */}
            {mediaItems.length > 0 && (
              <div className="animate-fade-in">

                {/* Filter tabs + counts */}
                <div className="flex items-center gap-2 mb-3">
                  {(
                    [
                      { key: "all", label: `All (${mediaItems.length})` },
                      { key: "images", label: `Photos (${imageCount})` },
                      { key: "videos", label: `Videos (${videoCount})` },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setMediaFilter(tab.key)}
                      className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200"
                      style={
                        mediaFilter === tab.key
                          ? {
                            background: "hsl(152,55%,32%)",
                            color: "white",
                          }
                          : {
                            background: "hsl(152,55%,32%,0.08)",
                            color: "hsl(152,55%,32%)",
                            border: "1px solid hsl(152,55%,32%,0.2)",
                          }
                      }
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredMedia.map((item) => (
                    <div
                      key={item.originalIdx}
                      className="relative aspect-square rounded-xl overflow-hidden border border-border bg-muted group shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      {item.type === "image" ? (
                        <img
                          src={item.url}
                          alt={`Media ${item.originalIdx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3Ctext x='100' y='105' text-anchor='middle' fill='%239ca3af' font-size='12'%3ENo image%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      ) : (
                        <>
                          <video
                            src={item.url}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                            preload="metadata"
                            onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                            onMouseLeave={(e) => {
                              const v = e.currentTarget as HTMLVideoElement;
                              v.pause();
                              v.currentTime = 0;
                            }}
                          />
                          {/* Video badge */}
                          <div
                            className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
                            style={{ background: "rgba(0,0,0,0.6)" }}
                          >
                            <Film className="w-2.5 h-2.5" /> VIDEO
                          </div>
                        </>
                      )}

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => removeMedia(item.originalIdx)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center bg-background/80 backdrop-blur-sm hover:bg-red-500 text-foreground hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Index badge */}
                      <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur-md text-white text-[10px] font-medium">
                        {item.originalIdx + 1}/{mediaItems.length}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {mediaItems.length === 0 && !uploadingMedia && (
              <div
                className="rounded-xl py-8 flex flex-col items-center gap-2 text-center"
                style={{ background: "hsl(152,55%,32%,0.04)", border: "1px dashed hsl(152,55%,32%,0.2)" }}
              >
                <div className="flex gap-2">
                  <FileImage className="w-5 h-5 text-muted-foreground/40" />
                  <Film className="w-5 h-5 text-muted-foreground/40" />
                </div>
                <p className="text-xs text-muted-foreground">No media uploaded yet</p>
                <p className="text-[10px] text-muted-foreground/60">Use the buttons above to add photos or videos</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Actions ────────────────────────────────────────────────────────── */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-3 px-6 rounded-xl text-sm font-bold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, hsl(152,55%,32%), hsl(145,47%,45%))" }}
          >
            {isLoading && !uploadingMedia ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                {initialData ? "Updating…" : "Creating…"}
              </>
            ) : (
              initialData ? "Update Property" : "Create Property"
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl text-sm font-semibold border border-border hover:bg-muted transition-all duration-200 text-foreground"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
