export default function TopupLoading() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 [background:radial-gradient(600px_400px_at_50%_0%,rgba(99,102,241,0.28),transparent_60%),radial-gradient(520px_360px_at_50%_100%,rgba(147,51,234,0.28),transparent_60%)] opacity-50"></div>
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)];background-size:24px_24px,24px_24px;background-position:-1px_-1px; opacity-10"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 mb-3 animate-pulse" />
          <div className="h-9 w-64 mx-auto bg-white/10 rounded-lg mb-2 animate-pulse" />
          <div className="h-5 w-80 mx-auto bg-white/10 rounded-lg animate-pulse" />
        </div>

        {/* Balance Skeleton */}
        <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 mb-6 animate-pulse">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 w-32 bg-white/10 rounded mb-2" />
                <div className="h-9 w-40 bg-white/10 rounded" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/10" />
            </div>
          </div>
        </div>

        {/* Upload Section Skeleton */}
        <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 mb-5 animate-pulse">
          <div className="p-5">
            <div className="h-6 w-48 bg-white/10 rounded mb-4" />
            <div className="h-64 bg-white/5 rounded-xl border-2 border-dashed border-white/20" />
          </div>
        </div>

        {/* Info Skeleton */}
        <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 animate-pulse">
          <div className="p-4">
            <div className="h-5 w-32 bg-white/10 rounded mb-3" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-white/10 rounded" />
              <div className="h-4 w-full bg-white/10 rounded" />
              <div className="h-4 w-full bg-white/10 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
