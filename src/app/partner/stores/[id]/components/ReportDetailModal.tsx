import StatCard from "@/src/components/StatCard";
import { ScrollArea } from "@/src/styles/components/ui/scroll-area";
import { Box } from "lucide-react";

function ReportDetailModal({
  setSelectedReport,
}: {
  setSelectedReport: React.Dispatch<React.SetStateAction<Report | null>>;
}) {
  // ---- FAKE DATA (sau này thay bằng report detail từ API)
  const overviewImages = [
    "https://picsum.photos/200/300?random=1",
    "https://picsum.photos/200/300?random=1",
    "https://picsum.photos/200/300?random=1",
    "https://picsum.photos/200/300?random=1",
  ];

  const products = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    image:
      "http://t0.gstatic.com/images?q=tbn:ANd9GcQjurrrJCCeoThXUUV5wyHB313DF-RhwsKxQqkEvubVAUtlPm2f4RaLZJBElx1p4g",
    sku: `SKU-00${i + 1}`,
    name: `Product ${i + 1}`,
    quantity: (i + 1) * 3, // số cố định
  }));

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center"
      onClick={() => setSelectedReport(null)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background w-full max-w-4xl max-h-[90vh] rounded-xl shadow-lg overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Daily Report Detail</h2>
          <button
            onClick={() => setSelectedReport(null)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* --- Store Overview Images --- */}
          <div>
            <h3 className="font-semibold mb-3">Store Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {overviewImages.map((img, index) => (
                <div
                  key={index}
                  className="aspect-[4/3] rounded-lg overflow-hidden border"
                >
                  <img
                    src={img}
                    alt="Store overview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* --- Summary --- */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              title="Total Products"
              value="100"
              change="+20"
              changePercent="+12%"
              icon={Box}
              color="bg-green-100 text-green-900"
            />
          </div>

          {/* --- Product List --- */}
          <div>
            <h3 className="font-semibold mb-3">Products</h3>

            <ScrollArea className="h-[360px] border rounded-xl">
              <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 border bg-muted rounded-lg p-2 hover:shadow-sm transition"
                  >
                    {/* Image */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 rounded-md object-cover border"
                    />

                    {/* Info */}
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sku}</p>
                    </div>

                    {/* Quantity */}
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Quantity</p>
                      <p className="font-semibold text-lg">
                        {product.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportDetailModal;
