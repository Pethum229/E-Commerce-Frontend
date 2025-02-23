import { useAuth, useUser } from "@clerk/clerk-react";
import { Link, Navigate } from "react-router";
import { useGetOrderForUserQuery } from "@/lib/api";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function AccountPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const {
    data: orders,
    isLoading: isOrdersLoading,
    isError,
  } = useGetOrderForUserQuery();

  if (!isLoaded || isOrdersLoading) {
    return (
      <main className="px-8">
        <h2 className="text-4xl font-bold">My Account</h2>
        <div className="mt-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-8 w-1/4 mt-2" />
        </div>
        <div className="mt-8">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full mt-4" />
        </div>
      </main>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }

  if (isError) {
    return (
      <main className="px-8">
        <h2 className="text-4xl font-bold">My Account</h2>
        <div className="mt-4 text-red-500">
          Error loading orders. Please try again later.
        </div>
      </main>
    );
  }

  return (
    <main className="px-8">
      <h2 className="text-4xl font-bold">My Account</h2>
      <div className="flex justify-between items-center">
        <div className="mt-4">
          <p className="text-xl">{user.fullName}</p>
          <p className="text-gray-600">{user.emailAddresses[0].emailAddress}</p>
        </div>
        <div>
          {user?.publicMetadata?.role === "admin" && (
            <Link to="/admin/products/create" asChild>
              <Button>Ad d Product</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold">Order History</h3>
        <Separator className="my-4" />

        {!orders || orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="space-y-4">
            {orders?.map((order) => (
              <div key={order._id} className="border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Order #{order._id}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge
                        variant={
                          order.orderStatus === "PENDING"
                            ? "secondary"
                            : "success"
                        }
                      >
                        {order.orderStatus}
                      </Badge>
                      <Badge
                        variant={
                          order.paymentStatus === "PENDING"
                            ? "secondary"
                            : "success"
                        }
                      >
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      Total: $
                      {order.items
                        .reduce(
                          (sum, item) =>
                            sum + item.product.price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="font-medium">Items:</p>
                  <div className="mt-2 space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <span>{item.product.name}</span>
                        </div>
                        <span>
                          {item.quantity} x ${item.product.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default AccountPage;
