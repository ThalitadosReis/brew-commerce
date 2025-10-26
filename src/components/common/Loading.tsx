"use client";

type LoadingProps = {
  message?: string;
  fullscreen?: boolean;
};

export default function Loading({
  message = "Loading...",
  fullscreen = true,
}: LoadingProps) {
  const wrap = fullscreen
    ? "min-h-screen flex items-center justify-center bg-black/5"
    : "flex items-center justify-center py-12";

  return (
    <div className={wrap}>
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-black/20 border-t-black/70 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-black/70 text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
