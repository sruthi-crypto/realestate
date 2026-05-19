import { useApp } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import ProductForm from "@/components/ProductForm";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearGetAllPropertiesAction, getAllPropertiesAction } from "@/store/actions";
import { toast } from "sonner";
import { PropertyData } from "@/types/responses";

const PROPERTY_TYPES = ["All", "Open Plots", "Apartments", "Gated Villas", "Gated Communities"];

// ── Delete Confirmation Modal ─────────────────────────────────────────────────
function DeleteConfirmModal({
  open,
  productName,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
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
            <span className="font-semibold text-foreground">"{productName}"</span>?
            <br />
            This action <span className="text-red-500 font-semibold">cannot be undone</span>.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-border text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Index ─────────────────────────────────────────────────────────────────────
const Index = () => {
  const { isAdmin } = useApp();

  const dispatch = useAppDispatch();
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [editingProduct, setEditingProduct] = useState<PropertyData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedType, setSelectedType] = useState("All");

  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string; name: string }>({
    open: false,
    id: "",
    name: "",
  });

  const {
    loading: getPropertiesLoading,
    successData: getPropertiesSuccess,
    error: getPropertiesError,
    errorInfo: getPropertiesErrorInfo,
  } = useAppSelector((s) => s.getAllPropertiesReducer);

  useEffect(() => {
    dispatch(getAllPropertiesAction());
  }, [dispatch]);

  useEffect(() => {
    if (getPropertiesSuccess) {
      setProperties(getPropertiesSuccess.data);
      dispatch(clearGetAllPropertiesAction());
    }
  }, [getPropertiesSuccess, dispatch]);

  useEffect(() => {
    if (getPropertiesError) toast.error(getPropertiesErrorInfo || "Failed to fetch properties");
  }, [getPropertiesError, getPropertiesErrorInfo]);

  const handleDeleteClick = (product: PropertyData) => {
    setDeleteModal({ open: true, id: product.id, name: product.title });
  };

  const handleDeleteConfirm = () => {
    setProperties(properties.filter((p) => p.id !== deleteModal.id));
    setDeleteModal({ open: false, id: "", name: "" });
  };

  const isModalOpen = isCreating || !!editingProduct;

  const filteredproperties = properties.filter((p) => {
    if (selectedType !== "All" && p.propertyType !== selectedType) return false;
    return true;
  });

  return (
    <div className="min-h-screen">
      <DeleteConfirmModal
        open={deleteModal.open}
        productName={deleteModal.name}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ open: false, id: "", name: "" })}
      />

      <section className="relative bg-gradient-to-br from-primary via-primary to-accent py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        </div>
        <div className="container relative z-10 text-center">
          <div className="space-y-4 animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground leading-tight">
              Find Your Dream Property
            </h1>
            <p className="text-primary-foreground/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Explore premium plots, apartments, villas and communities across India's top cities with unparalleled luxury and elegance.
            </p>
          </div>
        </div>
      </section>

      <div className="container py-12">
        {/* Admin Controls */}
        {isAdmin && !isCreating && !editingProduct && (
          <div className="mb-8 animate-slide-down">
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover-lift font-semibold"
            >
              + Add Property
            </Button>
          </div>
        )}

        {/* Property Type Filters */}
        <div className="mb-10 space-y-4 animate-fade-in">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">Our Properties</h2>
            <div className="h-1 w-16 bg-gradient-to-r from-primary to-accent rounded-full" />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {PROPERTY_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover-lift ${selectedType === type
                  ? "bg-primary text-white shadow-lg"
                  : "bg-background border border-border text-muted-foreground hover:bg-muted"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Properties Grid */}
        <div className="animate-fade-in">
          {filteredproperties.length === 0 ? (
            <div className="text-center py-16 bg-background rounded-2xl border border-border">
              <div className="text-5xl mb-4">🏠</div>
              <p className="text-muted-foreground text-lg font-medium">No properties found in this category.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredproperties.map((product, idx) => (
                <div
                  key={product.id}
                  className="relative group"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <ProductCard product={product} />

                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="p-2.5 rounded-lg bg-white shadow-lg hover:bg-primary hover:text-white transition-all hover-lift"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="p-2.5 rounded-lg bg-white shadow-lg hover:bg-destructive hover:text-white transition-all hover-lift"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal form */}
        {isAdmin && (
          <Modal
            open={isModalOpen}
            onClose={() => {
              setEditingProduct(null);
              setIsCreating(false);
            }}
          >
            <ProductForm
              initialData={editingProduct}
              onCancel={() => {
                setEditingProduct(null);
                setIsCreating(false);
              }}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Index;