import { Separator } from "@/components/ui/separator";
import { useGetCategoriesQuery, useGetProductsQuery } from "@/lib/api";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCards from "./ProductCards";
import Tab from "./Tab";
import SortDropDown from "../SortDropDown";

function Products(props) {
  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
  } = useGetProductsQuery();

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useGetCategoriesQuery();

  const [selectedCategoryId, setSelectedCategoryId] = useState("ALL");
  const filteredProducts =
    selectedCategoryId === "ALL"
      ? products
      : products?.filter((product) => product.categoryId === selectedCategoryId);

  const [sortByPrice, setSortByPrice] = useState("asc");
  const sortedProducts = 
    filteredProducts
      ? (sortByPrice === "asc"
          ? [...filteredProducts].sort((a,b) => a.price - b.price)
          : [...filteredProducts].sort((a,b) => b.price - a.price))
      : [];

  const handleTabClick = (_id) => {
    setSelectedCategoryId(_id);
  };

  const handleDropdownChange = (value) => {
    setSortByPrice(value);
  }

  if (isProductsLoading || isCategoriesLoading) {
    return (
      <section className="px-8 py-8">
        <h2 className="text-4xl font-bold">{props.secName}</h2>

        <Separator className="mt-2" />
        <div className="mt-4 flex items-center gap-4">
          <Skeleton className="h-16" />
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </section>
    );
  }

  if (isProductsError || isCategoriesError) {
    return (
      <section className="px-8 py-8">
        <h2 className="text-4xl font-bold">{props.secName}</h2>

        <Separator className="mt-2" />
        <div className="mt-4 flex items-center gap-4"></div>
        <div className="mt-4">
          <p className="text-red-500">{`Error fetching products or categories`}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-8 py-8">
      <h2 className="text-4xl font-bold">{props.secName}</h2>
      <Separator className="mt-2" />
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {[...categories, { _id: "ALL", name: "All" }].map((category) => (
            <Tab
              key={category._id}
              _id={category._id}
              selectedCategoryId={selectedCategoryId}
              name={category.name}
              onTabClick={handleTabClick}
            />
          ))}
        </div>
        <SortDropDown 
          sortByPrice={sortByPrice}
          onSortChange={handleDropdownChange}
        />
      </div>
      <ProductCards products={sortedProducts} />
    </section>
  );
}

export default Products;
