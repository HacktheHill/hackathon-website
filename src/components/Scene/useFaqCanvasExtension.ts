import { useEffect, type RefObject } from "react";

export function useFaqCanvasExtension(canvasRef: RefObject<HTMLDivElement>) {
	useEffect(() => {
		const canvas = canvasRef.current;
		const faqSlot = canvas?.querySelector<HTMLElement>("#faq")?.parentElement;
		const footerSlot = canvas?.querySelector<HTMLElement>("footer")?.parentElement;
		if (!canvas || !faqSlot || !footerSlot) return;

		const desktopQuery = window.matchMedia("(min-width: 1025px)");
		let frame = 0;

		const updateExtension = () => {
			frame = 0;
			if (!desktopQuery.matches) {
				canvas.style.removeProperty("--faq-content-extension");
				return;
			}

			const currentExtension =
				Number.parseFloat(getComputedStyle(canvas).getPropertyValue("--faq-content-extension")) || 0;
			const faqBottom = faqSlot.offsetTop + faqSlot.getBoundingClientRect().height;
			const footerTopWithoutExtension = footerSlot.offsetTop - currentExtension;
			const requiredExtension = Math.max(0, Math.ceil(faqBottom + 48 - footerTopWithoutExtension));

			canvas.style.setProperty("--faq-content-extension", `${requiredExtension}px`);
		};

		const requestExtensionUpdate = () => {
			if (!frame) frame = window.requestAnimationFrame(updateExtension);
		};
		const observer = new ResizeObserver(requestExtensionUpdate);
		observer.observe(faqSlot);
		window.addEventListener("resize", requestExtensionUpdate);
		desktopQuery.addEventListener("change", requestExtensionUpdate);
		requestExtensionUpdate();

		return () => {
			observer.disconnect();
			window.removeEventListener("resize", requestExtensionUpdate);
			desktopQuery.removeEventListener("change", requestExtensionUpdate);
			if (frame) window.cancelAnimationFrame(frame);
		};
	}, [canvasRef]);
}
