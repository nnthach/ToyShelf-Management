import { Loader2 } from "lucide-react";

function LoadingPageComponent() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <Loader2 className="h-10 w-10 animate-spin text-white" />
    </div>
  );
}

export default LoadingPageComponent;
