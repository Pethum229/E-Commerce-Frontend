import { useParams } from "react-router-dom";
import { useGetProductQuery } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cartSlice";
import { Skeleton } from "@/components/ui/skeleton";

function ProductPage() {
  const { productId } = useParams();
  const { data: product, isLoading, isError } = useGetProductQuery(productId);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
      })
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-8">
          <Skeleton className="h-[500px]" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24" />
            <Skeleton className="h-10 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return <div>Error loading product</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white rounded-lg p-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto object-contain"
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold">${product.price}</p>
          <p className="text-gray-600">{product.description}</p>
          <Button onClick={handleAddToCart} className="w-full md:w-auto">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductPage; 