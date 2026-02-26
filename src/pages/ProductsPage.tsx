import React from "react";
import { useGetProductsQuery } from "../api/api";
import CreateProduct from "@/components/CreateProduct";

const ProductsPage: React.FC = () => {
  const { data: products, isLoading } = useGetProductsQuery();

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Products</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          {isLoading && <div>Loading...</div>}
          <ul className="space-y-2">
            {products?.map((p) => (
              <li
                key={p.id}
                className="p-3 border rounded-md bg-card border-var"
              >
                <div className="font-medium">{p.name}</div>
              </li>
            ))}
          </ul>
        </div>
        <CreateProduct />
      </div>
    </div>
  );
};

export default ProductsPage;
