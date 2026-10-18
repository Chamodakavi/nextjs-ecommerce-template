import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductDetails from "@/components/ShopDetails/ProductDetails";
import { getProductById } from "@/lib/services/getProducts";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: "Product Not Found | Premier Auto Hub" };
  }

  return {
    title: `${product.name || product.name} | Premier Auto Hub`,
    description:
      product.description ||
      `Buy ${product.name || product.name} at Premier Auto Hub`,
  };
}

const ProductPage = async ({ params }: Props) => {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <ProductDetails product={product} />
    </main>
  );
};

export default ProductPage;
