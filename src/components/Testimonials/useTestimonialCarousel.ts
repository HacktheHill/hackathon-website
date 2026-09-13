import { useRef, useState, type KeyboardEvent, type PointerEvent, type TransitionEvent } from "react";
import { flushSync } from "react-dom";

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

export function useTestimonialCarousel(testimonialCount: number) {
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
	const previousIndex = (activeIndex - 1 + testimonialCount) % testimonialCount;
	const nextIndex = (activeIndex + 1) % testimonialCount;

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
				: (activeIndexRef.current + action.direction + testimonialCount) % testimonialCount;

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
		if (currentTrackIndex !== 0 && currentTrackIndex !== testimonialCount + 1) {
			completeMovement();
			return;
		}

		flushSync(() => {
			setTransitionEnabled(false);
			updateTrackIndex(currentTrackIndex === 0 ? testimonialCount : 1);
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

	const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "ArrowLeft") prevSlide();
		if (event.key === "ArrowRight") nextSlide();
	};

	const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
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
	};

	const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
		const start = pointerStartRef.current;
		if (!start || start.id !== event.pointerId) return;

		const deltaX = event.clientX - start.x;
		const deltaY = event.clientY - start.y;
		if (start.axis === "pending" && Math.max(Math.abs(deltaX), Math.abs(deltaY)) >= 6) {
			start.axis = Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";
		}
		if (start.axis === "horizontal" && start.followTrack) updateDragOffset(deltaX);
	};

	const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
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
	};

	const onPointerCancel = (event: PointerEvent<HTMLDivElement>) => {
		const followTrack = pointerStartRef.current?.followTrack;
		if (event.currentTarget.hasPointerCapture(event.pointerId)) {
			event.currentTarget.releasePointerCapture(event.pointerId);
		}
		if (followTrack) cancelDrag();
		else pointerStartRef.current = null;
	};

	const onTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget && event.propertyName === "transform") finishSlide();
	};

	return {
		activeIndex,
		previousIndex,
		nextIndex,
		trackIndex,
		trackRef,
		dragOffset,
		transitionEnabled,
		isMoving,
		isDragging: pointerStartRef.current?.followTrack,
		nextSlide,
		prevSlide,
		selectSlide,
		onKeyDown,
		onPointerDown,
		onPointerMove,
		onPointerUp,
		onPointerCancel,
		onTransitionEnd,
	};
}
