"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/auth";
import {
  ShoppingBag,
  Package,
  Calendar,
  Clock,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  order_status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  payment_status: string;
  payment_method: string;
  total_amount: number;
  items: OrderItem[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const supabase = getSupabaseBrowserClient();

        // RLS policy automatically filters rows where customer_id = auth.uid()
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching user orders:", error.message);
        } else if (data) {
          setOrders(data as Order[]);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-500 min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue mb-3" />
        <p className="text-sm font-medium">Loading your order history...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 px-4 sm:px-8">
        <div className="w-16 h-16 bg-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 text-blue">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-dark mb-1">
          No Orders Found
        </h3>
        <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
          You haven't placed any orders with Premier Auto Hub yet.
        </p>
        <Link
          href="/shop-with-sidebar"
          className="inline-flex items-center gap-2 font-medium text-white bg-blue py-2.5 px-6 rounded-md text-sm hover:bg-blue-dark transition-colors shadow-sm"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h3 className="font-semibold text-xl text-dark mb-6 flex items-center gap-2">
        <Package className="w-5 h-5 text-blue" />
        My Order History ({orders.length})
      </h3>

      <div className="space-y-4">
        {orders.map((order) => {
          const itemCount = Array.isArray(order.items)
            ? order.items.reduce((acc, item) => acc + (item.quantity || 1), 0)
            : 0;

          const formattedDate = new Date(order.created_at).toLocaleDateString(
            "en-GB",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            },
          );

          return (
            <div
              key={order.id}
              className="bg-white border border-gray-3 rounded-xl p-5 hover:border-blue/30 transition-all shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-2">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-dark text-base">
                      #{order.order_number}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize ${getStatusBadge(
                        order.order_status,
                      )}`}
                    >
                      {order.order_status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {order.payment_method || "Cash on Delivery"}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-2xs text-gray-400 uppercase">
                    Total Amount
                  </span>
                  <span className="font-bold text-dark text-base">
                    Rs. {Number(order.total_amount || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="pt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {itemCount} {itemCount === 1 ? "item" : "items"} in this order
                </p>

                <Link
                  href={`/my-account/orders/${order.id}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue hover:underline"
                >
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
