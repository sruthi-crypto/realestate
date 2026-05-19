// src/pages/ProductPage.tsx

import ProductForm from "@/components/ProductForm";
import { useNavigate, useLocation } from "react-router-dom";

const ProductFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // for edit case
  const editingProduct = location.state?.product || null;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-3xl mx-auto px-4">

        <ProductForm
          initialData={editingProduct}
          onCancel={() => navigate(-1)} // go back
        />

      </div>
    </div>
  );
};

export default ProductFormPage;