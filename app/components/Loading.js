"use client";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-2xl">
            {/* Background Cinematic Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Spider-Sense Pulsing Rings */}
                <div className="relative w-24 h-24 mb-10">
                    {/* Animated Glow Rings */}
                    <div className="absolute inset-0 border-2 border-red-600 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-70" />
                    <div className="absolute inset-2 border-2 border-red-500 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-40 delay-300" />

                    {/* Central Logo Indicator */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-[0_0_30px_rgba(220,38,38,0.8)] animate-bounce">
                            S
                        </div>
                    </div>
                </div>

                {/* Loading Text */}
                <div className="text-center">
                    <h2 className="text-xl font-black uppercase italic tracking-[0.3em] text-white mb-2 animate-pulse">
                        Synchronizing <span className="text-red-600">Multiverse</span>
                    </h2>
                    <div className="flex items-center justify-center gap-1.5">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.15}s` }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Decorative Text */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">
                    SeriesFlix Engine v1.0 • Peter Parker protocol active
                </span>
            </div>

            {/* Noise effect for texture */}
            <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
        </div>
    );
}
