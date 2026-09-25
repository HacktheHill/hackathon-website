import { useEffect, useRef, useState } from "react";
import type { Slide } from "./slides";

// Mounted only on the active video slide: skipping the deck never starts media.
export default function ImportedSlideVideo({ video }: { video: NonNullable<Slide["video"]> }) {
	const ref = useRef<HTMLVideoElement>(null);
	const [blocked, setBlocked] = useState(false);
	const [failed, setFailed] = useState(false);
	const play = () => {
		void ref.current?.play().then(() => setBlocked(false)).catch(() => setBlocked(true));
	};
	useEffect(() => {
		const element = ref.current;
		if (!element) return;
		let disposed = false;
		void element.play().catch(() => { if (!disposed) setBlocked(true); });
		return () => {
			disposed = true;
			element.pause();
		};
	}, []);
	return (
		<div className="imported-slide-video" style={{ top: `${video.top}%`, height: `${video.height}%` }}>
			<video ref={ref} src={video.src} aria-label={video.label} muted playsInline controls preload="auto"
				onPlaying={() => setBlocked(false)} onError={() => setFailed(true)} />
			{blocked && !failed && <button className="imported-video-message" onClick={play}>Play video / Lire la vidéo</button>}
			{failed && <p className="imported-video-message" role="alert">Video unavailable. Press ↓ to continue.<br />Vidéo indisponible. Appuyez sur ↓ pour continuer.</p>}
		</div>
	);
}
