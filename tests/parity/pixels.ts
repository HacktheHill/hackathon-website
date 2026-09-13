import type { Page } from "@playwright/test";

/** Decode unequal PNGs and compare all RGBA channels without an antialiasing allowance. */
export async function comparePixels(page: Page, before: Buffer, after: Buffer) {
	if (before.equals(after)) {
		return {
			changedPixels: 0,
			width: before.readUInt32BE(16),
			height: before.readUInt32BE(20),
			sameDimensions: true,
			image: "",
		};
	}

	return page.evaluate(
		async ([before, after]) => {
			const decode = async (base64: string) => {
				const image = new Image();
				image.src = `data:image/png;base64,${base64}`;
				await image.decode();
				return image;
			};
			const [reference, candidate] = await Promise.all([decode(before), decode(after)]);
			const width = Math.max(reference.width, candidate.width);
			const height = Math.max(reference.height, candidate.height);
			const pixels = (image: HTMLImageElement) => {
				const canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				const context = canvas.getContext("2d")!;
				context.drawImage(image, 0, 0);
				return context.getImageData(0, 0, width, height).data;
			};
			const left = pixels(reference);
			const right = pixels(candidate);
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const context = canvas.getContext("2d")!;
			const diff = context.createImageData(width, height);
			let changedPixels = 0;
			for (let offset = 0; offset < left.length; offset += 4) {
				const changed = [0, 1, 2, 3].some(channel => left[offset + channel] !== right[offset + channel]);
				if (changed) changedPixels += 1;
				diff.data[offset] = changed ? 255 : right[offset];
				diff.data[offset + 1] = changed ? 0 : right[offset + 1];
				diff.data[offset + 2] = changed ? 255 : right[offset + 2];
				diff.data[offset + 3] = changed ? 255 : 60;
			}
			context.putImageData(diff, 0, 0);
			return {
				changedPixels,
				width,
				height,
				sameDimensions: reference.width === candidate.width && reference.height === candidate.height,
				image: canvas.toDataURL("image/png").split(",")[1],
			};
		},
		[before.toString("base64"), after.toString("base64")],
	);
}
