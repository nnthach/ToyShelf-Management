"use client";

import { getPaymentDetail } from "@/src/services/payment.service";
import { Payment } from "@/src/types";
import { CheckCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("orderCode");
  const router = useRouter();

  const [data, setData] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPaymentInfo = async () => {
    try {
      const res = await getPaymentDetail(Number(orderCode));
      setData(res.data);
    } catch (error) {
      console.log("check payment err", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!orderCode) return;
    fetchPaymentInfo();
  }, [orderCode]);

  if (loading) {
    return <div className="p-10 text-center">Loading payment info...</div>;
  }

  if (!data) {
    return (
      <div className="p-10 text-center text-red-500">Payment not found</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl h-[80vh] p-6 flex flex-col">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-4">
          <CheckCircle className="text-green-500 w-16 h-16 mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">
            Payment Successful 🎉
          </h1>
          <p className="text-gray-500">
            Order Code: <span className="font-medium">order code</span>
          </p>
        </div>

        {/* Content (scrollable) */}
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Transaction Info */}
          <div className="border rounded-lg p-4 space-y-2">
            <h2 className="font-semibold text-lg">Transaction Info</h2>
            <div className="flex justify-between">
              <span>Status</span>
              <span className="text-green-600 font-medium">status</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method</span>
              <span>method</span>
            </div>
            <div className="flex justify-between">
              <span>Total Price</span>
              <span className="font-semibold">price</span>
            </div>
          </div>

          {/* Booking Info */}
          <div className="border rounded-lg p-4 space-y-3">
            <h2 className="font-semibold text-lg">Booking Details</h2>

            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-medium">customerinfo(email)</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="font-medium">time</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">product list</p>
              <ul className="list-disc list-inside">products</ul>
            </div>
          </div>
        </div>

        {/* Actions (fixed bottom) */}
        <div className="pt-4 flex gap-4">
          <button
            onClick={() => router.push("/booking")}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg py-2"
          >
            Tiếp tục mua hàng
          </button>
        </div>
      </div>
    </div>
  );
}
