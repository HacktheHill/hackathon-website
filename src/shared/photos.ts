/** Browser-safe contract: no object keys, roster, edit notes or private reports. */
export const PHOTO_BASE = "/photos";
export const LICENCE_VERSION = "2026-10-06";
export type PhotoLanguage = "en" | "fr";
export type PhotoFormat = "full" | "quick";
export interface PhotoVariant {
	url: string;
	width: number;
	height: number;
	bytes: number;
}
export interface AlbumPhoto {
	id: string;
	category: string;
	filename: string;
	version: string;
	width: number;
	height: number;
	thumbnail: PhotoVariant;
	preview: PhotoVariant;
	downloads: Record<PhotoFormat, { width: number; height: number; bytes: number }>;
}
export interface AlbumManifest {
	version: string;
	photos: AlbumPhoto[];
}
export interface PhotoSession {
	authenticated: boolean;
	csrfToken?: string;
	accountId?: string;
	administrator?: boolean;
	licenceVersion?: string;
	expiresAt?: number;
}
export interface RemovalCase {
	id: string;
	photoId: string;
	filename: string;
	category: string;
	photoVersion: number;
	photoStatus: "published" | "quarantined" | "withdrawn";
	explanation: string;
	requesterEmail: string;
	createdAt: number;
	status: "pending" | "dismissed" | "withdrawn" | "duplicate";
	previewUrl: string;
	unresolvedReports: number;
	crossChannelReviewed: boolean;
}
export interface ManageSummary {
	cases: RemovalCase[];
	selectedCases?: RemovalCase[];
	pendingTotal?: number;
	nextCursor?: string | null;
	albumVisits?: number;
	aggregates: {
		photoId: string;
		filename?: string;
		category?: string;
		opens: number;
		downloads: number;
		fullDownloads?: number;
		quickDownloads?: number;
	}[];
	diagnostics: { pendingNotifications: number; failedNotifications: number };
}
