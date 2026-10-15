import backgroundVideo from '@/assets/images/Innovator.mp4';

/** Full-screen brand video with a scrim that keeps foreground text readable. */
export function BrandBackground() {
    return (
        <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-ink-800 via-ink-950 to-ink-900" />
            <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
            >
                <source src={backgroundVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/45 to-ink-950/90" />
        </div>
    );
}

export default BrandBackground;
