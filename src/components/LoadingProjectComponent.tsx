import Image from "next/image";

function LoadingProjectComponent() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      <div className="relative h-24 w-24 animate-pulse">
        <Image
          src="/images/finallogo.png"
          alt="Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}

export default LoadingProjectComponent;
