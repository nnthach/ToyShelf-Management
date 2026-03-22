"use client";

import { checkPaymentAPI } from "@/src/services/payment.service";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function PaymentClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("orderCode");

  useEffect(() => {
    if (!orderCode) return;

    const checkPayment = async () => {
      try {
        const res = await checkPaymentAPI({ orderCode: Number(orderCode) });

        console.log("res checkout", res);

        if (res.status === "PAID") {
          router.replace(`/payment/success?orderCode=${orderCode}`);
        } else {
          router.replace(`/payment/fail?orderCode=${orderCode}`);
        }
      } catch (err) {
        console.log(err);
        router.replace(`/payment/fail?orderCode=${orderCode}`);
      }
    };

    checkPayment();
  }, [orderCode, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Kiểm tra thanh toán
    </div>
  );
}
