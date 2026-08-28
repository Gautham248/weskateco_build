import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductBrowserClient } from "app/admin/shopify/products/product-browser-client";

describe("Shopify Product Browser Client (product-browser-client.tsx)", () => {
  const sampleProducts = [
    {
      id: "gid://1",
      title: "Pigeon Pro Complete",
      handle: "pigeon-pro-complete",
      vendor: "WeSkate Co",
      priceRange: { minVariantPrice: { amount: "7999.00", currencyCode: "INR" } },
      featuredImage: null,
    },
    {
      id: "gid://2",
      title: "Toucan Wheels 54mm",
      handle: "toucan-wheels-54mm",
      vendor: "Toucan",
      priceRange: { minVariantPrice: { amount: "2499.00", currencyCode: "INR" } },
      featuredImage: null,
    },
  ];

  const sampleCollections = [
    { id: "c1", title: "Completes", handle: "completes", productsCount: 1, image: null },
  ];

  it("renders list of sample products", () => {
    render(
      <ProductBrowserClient
        initialProducts={sampleProducts}
        collections={sampleCollections}
        currentQuery=""
        currentCollection=""
      />
    );
    expect(screen.getByText("Pigeon Pro Complete")).toBeInTheDocument();
    expect(screen.getByText("Toucan Wheels 54mm")).toBeInTheDocument();
  });

  it("copies handle to clipboard on Copy button click", () => {
    render(
      <ProductBrowserClient
        initialProducts={sampleProducts}
        collections={sampleCollections}
        currentQuery=""
        currentCollection=""
      />
    );
    const copyBtns = screen.getAllByTitle("Copy handle");
    expect(copyBtns.length).toBe(2);
    fireEvent.click(copyBtns[0]!);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("pigeon-pro-complete");
  });
});
