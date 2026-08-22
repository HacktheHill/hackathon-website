import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { t } from "@/i18n";
import styles from "./Testimonials.module.css";

type Direction = -1 | 1;
type QueuedAction = { type: "move"; direction: Direction } | { type: "select"; index: number };
type PointerStart = {
	id: number;
	x: number;
	y: number;
	time: number;
	axis: "pending" | "horizontal" | "vertical";
	followTrack: boolean;
};

function Testimonials() {
	const testimonialData = [
		{
			id: 3,
			name: t("testimonials.t3.name"),
			content: t("testimonials.t3.content"),
			role: t("testimonials.t3.role"),
			img: "https://cdn1.hackthehill.com/testimonials/britt-hayman.webp",
		},
		{
			id: 6,
			name: t("testimonials.t6.name"),
			content: t("testimonials.t6.content"),
			role: t("testimonials.t6.role"),
			img: "https://cdn1.hackthehill.com/testimonials/greg-suignard.webp",
		},
		{
			id: 7,
			name: t("testimonials.t7.name"),
			content: t("testimonials.t7.content"),
			role: t("testimonials.t7.role"),
			img: "https://cdn1.hackthehill.com/testimonials/elmira-khani.webp",
		},
		{
			id: 1,
			name: t("testimonials.t1.name"),
			content: t("testimonials.t1.content"),
			role: t("testimonials.t1.role"),
			img: "https://cdn1.hackthehill.com/testimonials/maddie-whibbs.webp",
		},
		{
			id: 2,
			name: t("testimonials.t2.name"),
			content: t("testimonials.t2.content"),
			role: t("testimonials.t2.role"),
			img: "https://cdn1.hackthehill.com/testimonials/adam-laderoute.webp",
		},
		{
			id: 4,
			name: t("testimonials.t4.name"),
			content: t("testimonials.t4.content"),
			role: t("testimonials.t4.role"),
			img: "https://cdn1.hackthehill.com/testimonials/nyah-wagner.webp",
		},
	];

	const [activeIndex, setActiveIndex] = useState(0);
	const [trackIndex, setTrackIndex] = useState(1);
	const [transitionEnabled, setTransitionEnabled] = useState(true);
	const [dragOffset, setDragOffset] = useState(0);
	const [isMoving, setIsMoving] = useState(false);
	const activeIndexRef = useRef(0);
	const trackIndexRef = useRef(1);
	const dragOffsetRef = useRef(0);
	const pointerStartRef = useRef<PointerStart | null>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const isAnimatingRef = useRef(false);
	const queuedActionRef = useRef<QueuedAction | null>(null);
	const previousLabel = t("testimonials.aria_label_prev");
	const nextLabel = t("testimonials.aria_label_next");
	const dotLabel = t("testimonials.aria_label_dot");
	const previousIndex = (activeIndex - 1 + testimonialData.length) % testimonialData.length;
	const nextIndex = (activeIndex + 1) % testimonialData.length;
	const trackSlides = [
		{ testimonial: testimonialData.at(-1)!, index: testimonialData.length - 1, isClone: true, key: "clone-last" },
		...testimonialData.map((testimonial, index) => ({ testimonial, index, isClone: false, key: testimonial.id })),
		{ testimonial: testimonialData[0], index: 0, isClone: true, key: "clone-first" },
	];

	const updateActiveIndex = (index: number) => {
		activeIndexRef.current = index;
		setActiveIndex(index);
	};

	const updateTrackIndex = (index: number) => {
		trackIndexRef.current = index;
		setTrackIndex(index);
	};

	const updateDragOffset = (offset: number) => {
		dragOffsetRef.current = offset;
		setDragOffset(offset);
	};

	function runAction(action: QueuedAction) {
		if (isAnimatingRef.current || pointerStartRef.current) {
			queuedActionRef.current = action;
			return;
		}

		if (action.type === "select" && action.index === activeIndexRef.current) return;

		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const nextActiveIndex =
			action.type === "select"
				? action.index
				: (activeIndexRef.current + action.direction + testimonialData.length) % testimonialData.length;

		updateActiveIndex(nextActiveIndex);
		updateDragOffset(0);

		if (reducedMotion) {
			setTransitionEnabled(false);
			updateTrackIndex(nextActiveIndex + 1);
			setIsMoving(false);
			return;
		}

		isAnimatingRef.current = true;
		setIsMoving(true);
		setTransitionEnabled(true);
		updateTrackIndex(action.type === "select" ? nextActiveIndex + 1 : trackIndexRef.current + action.direction);
	}

	const nextSlide = () => runAction({ type: "move", direction: 1 });
	const prevSlide = () => runAction({ type: "move", direction: -1 });
	const selectSlide = (index: number) => runAction({ type: "select", index });

	const completeMovement = () => {
		isAnimatingRef.current = false;
		setIsMoving(false);
		const queuedAction = queuedActionRef.current;
		queuedActionRef.current = null;
		if (queuedAction) requestAnimationFrame(() => runAction(queuedAction));
	};

	const finishSlide = () => {
		const currentTrackIndex = trackIndexRef.current;
		if (currentTrackIndex !== 0 && currentTrackIndex !== testimonialData.length + 1) {
			completeMovement();
			return;
		}

		flushSync(() => {
			setTransitionEnabled(false);
			updateTrackIndex(currentTrackIndex === 0 ? testimonialData.length : 1);
		});
		trackRef.current?.getBoundingClientRect();
		requestAnimationFrame(() => {
			setTransitionEnabled(true);
			completeMovement();
		});
	};

	const cancelDrag = () => {
		pointerStartRef.current = null;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			isAnimatingRef.current = false;
			setTransitionEnabled(false);
			updateDragOffset(0);
			setIsMoving(false);
			return;
		}
		if (dragOffsetRef.current === 0) {
			setTransitionEnabled(true);
			setIsMoving(false);
			return;
		}

		isAnimatingRef.current = true;
		setTransitionEnabled(true);
		updateDragOffset(0);
	};

	return (
		<section id="testimonials" className={styles["testimonials"]} aria-labelledby="testimonials-title">
			<h2 id="testimonials-title" className="section-heading" data-aos="fade-up" data-aos-duration="800">
				{t("testimonials.title")}
			</h2>
			<p className={styles["sub-heading"]} data-aos="fade-up" data-aos-duration="800">
				{t("testimonials.sub_heading")}
			</p>
			<div
				className={styles["testimonial-body"]}
				aria-live="polite"
				tabIndex={0}
				data-aos="fade-up"
				data-aos-duration="800"
				onKeyDown={event => {
					if (event.key === "ArrowLeft") prevSlide();
					if (event.key === "ArrowRight") nextSlide();
				}}
				onPointerDown={event => {
					if (!event.isPrimary) return;
					const followTrack = !isAnimatingRef.current;
					pointerStartRef.current = {
						id: event.pointerId,
						x: event.clientX,
						y: event.clientY,
						time: event.timeStamp,
						axis: "pending",
						followTrack,
					};
					if (followTrack) {
						setTransitionEnabled(false);
						setIsMoving(true);
					}
					event.currentTarget.setPointerCapture(event.pointerId);
				}}
				onPointerMove={event => {
					const start = pointerStartRef.current;
					if (!start || start.id !== event.pointerId) return;

					const deltaX = event.clientX - start.x;
					const deltaY = event.clientY - start.y;
					if (start.axis === "pending" && Math.max(Math.abs(deltaX), Math.abs(deltaY)) >= 6) {
						start.axis = Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";
					}
					if (start.axis === "horizontal" && start.followTrack) updateDragOffset(deltaX);
				}}
				onPointerUp={event => {
					const start = pointerStartRef.current;
					if (!start || start.id !== event.pointerId) return;

					const deltaX = event.clientX - start.x;
					const deltaY = event.clientY - start.y;
					const elapsed = Math.max(event.timeStamp - start.time, 1);
					const velocity = Math.abs(deltaX) / elapsed;
					const distanceThreshold = event.currentTarget.getBoundingClientRect().width * 0.2;
					const horizontalGesture = start.axis === "horizontal" || Math.abs(deltaX) > Math.abs(deltaY);
					pointerStartRef.current = null;
					if (event.currentTarget.hasPointerCapture(event.pointerId)) {
						event.currentTarget.releasePointerCapture(event.pointerId);
					}

					if (
						horizontalGesture &&
						(Math.abs(deltaX) >= distanceThreshold || (Math.abs(deltaX) >= 24 && velocity >= 0.5))
					) {
						runAction({ type: "move", direction: deltaX < 0 ? 1 : -1 });
						return;
					}

					if (start.followTrack) cancelDrag();
				}}
				onPointerCancel={event => {
					const followTrack = pointerStartRef.current?.followTrack;
					if (event.currentTarget.hasPointerCapture(event.pointerId)) {
						event.currentTarget.releasePointerCapture(event.pointerId);
					}
					if (followTrack) cancelDrag();
					else pointerStartRef.current = null;
				}}
			>
				<div
					ref={trackRef}
					className={styles["testimonial-track"]}
					data-moving={isMoving ? "" : undefined}
					data-dragging={pointerStartRef.current?.followTrack ? "" : undefined}
					style={{
						transform: `translateX(calc(${-trackIndex * 100}% + ${dragOffset}px))`,
						transition: transitionEnabled ? undefined : "none",
					}}
					onTransitionEnd={event => {
						if (event.target === event.currentTarget && event.propertyName === "transform") finishSlide();
					}}
				>
					{trackSlides.map(({ testimonial, index, isClone, key }) => (
						<div
							key={key}
							className={styles["testimonial-container"]}
							aria-hidden={isClone || index !== activeIndex}
							aria-label={isClone ? undefined : `${index + 1}/${testimonialData.length}: ${testimonial.name}`}
							role={isClone ? undefined : "group"}
							aria-roledescription={isClone ? undefined : "slide"}
							data-carousel-clone={isClone ? String(key) : undefined}
						>
							<img
								className={styles["testimonial-img"]}
								src={testimonial.img}
								alt={testimonial.name}
								width="256"
								height="256"
								draggable="false"
								loading="lazy"
								decoding="async"
							/>
							<div className={styles["testimonial-text"]}>
								<p className={styles["testimonial-content"]}>{testimonial.content}</p>
								<p className={styles["testimonial-provider"]}>
									{testimonial.name}, {testimonial.role}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
			<div
				className={styles["carousel-control"]}
				data-aos="fade-up"
				data-aos-duration="800"
				data-aos-offset="-100"
			>
				<button
					type="button"
					onClick={prevSlide}
					className={styles["prev-button"]}
					aria-label={`${previousLabel}: ${testimonialData[previousIndex].name}`}
				></button>
				<div className={styles["carousel-dots"]}>
					{testimonialData.map((_, index) => (
						<button
							type="button"
							key={testimonialData[index].id}
							className={index === activeIndex ? styles.active : ""}
							onClick={() => selectSlide(index)}
							aria-label={`${dotLabel} ${index + 1}: ${testimonialData[index].name}`}
							aria-pressed={index === activeIndex}
						></button>
					))}
				</div>
				<button
					type="button"
					onClick={nextSlide}
					className={styles["next-button"]}
					aria-label={`${nextLabel}: ${testimonialData[nextIndex].name}`}
				></button>
			</div>
		</section>
	);
}

export default Testimonials;
