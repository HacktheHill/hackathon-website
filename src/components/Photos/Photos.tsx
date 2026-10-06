import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type FormEvent,
	type ReactNode,
	type TouchEvent,
} from "react";
import {
	LICENCE_VERSION,
	type AlbumManifest,
	type AlbumPhoto,
	type ManageSummary,
	type PhotoSession,
	type RemovalCase,
} from "../../shared/photos";
import licence from "../../shared/photo-licence.json";
import styles from "./Photos.module.css";

type Language = "en" | "fr";
type Category = "all" | "favourites" | string;
type Notice = { kind: "error" | "success" | "info"; text: string } | null;
type RightsRequest = { email: string; format: "full" | "quick"; createdAt: number; requestId: string };
type RightsResponse = { requests: RightsRequest[]; nextCursor?: string | null };
type AggregateRow = ManageSummary["aggregates"][number] & {
	filename?: string;
	category?: string;
	fullDownloads?: number;
	quickDownloads?: number;
};
type GalleryManageSummary = Omit<ManageSummary, "aggregates"> & {
	aggregates: AggregateRow[];
	albumVisits?: number;
};

const categories: Record<string, { en: string; fr: string }> = {
	Admin: { en: "Team life", fr: "Vie d’équipe" },
	"CGI Event": { en: "CGI event", fr: "Événement CGI" },
	"Career Fair": { en: "Career fair", fr: "Foire aux carrières" },
	"Check-In": { en: "Check-in", fr: "Accueil" },
	"Closing Ceremony": { en: "Closing ceremony", fr: "Cérémonie de clôture" },
	"Devpost-Pitching Workshop": { en: "Devpost & pitching", fr: "Devpost et présentation" },
	Food: { en: "Food", fr: "Nourriture" },
	Hacking: { en: "Hacking", fr: "Hacking" },
	Judging: { en: "Judging", fr: "Évaluation" },
	"Karaoke-DJing": { en: "Karaoke & DJing", fr: "Karaoké et DJ" },
	"ML Workshop": { en: "ML workshop", fr: "Atelier ML" },
	"MLH Workshops": { en: "MLH workshops", fr: "Ateliers MLH" },
	Misc: { en: "Around the event", fr: "Autour de l’événement" },
	"Opening Ceremony": { en: "Opening ceremony", fr: "Cérémonie d’ouverture" },
	Setup: { en: "Setup", fr: "Installation" },
	"Spicy Ramen Challenge": { en: "Spicy ramen challenge", fr: "Défi ramen épicé" },
	"Trivia-LeetCode": { en: "Trivia & LeetCode", fr: "Trivia et LeetCode" },
	"Web-Hardware Workshops": { en: "Web & hardware workshops", fr: "Ateliers web et matériel" },
};

const copy = {
	en: {
		album: "The Hack the Hill III album",
		intro: "A warm look back at the people, ideas, and little moments that made the weekend.",
		access: "Sign in with the event email you used for Hack the Hill III. We’ll send an eight-digit code.",
		privacy:
			"We use your email to verify eligibility and sign you in. Album visits and photo opens are measured in aggregate without an identity-linked browsing history. Individual download requests are kept for 90 days for rights follow-up. Nothing is used for marketing.",
		email: "Event email",
		send: "Send code",
		code: "Your eight-digit code",
		verify: "Open album",
		resend: "Resend code",
		sent: "Code sent. It expires in 10 minutes.",
		resendIn: "Resend in",
		support: "Need access? Contact privacy@ctn-rtc.org",
		unknown: "If this address is eligible, a code is on its way.",
		signout: "Sign out",
		all: "All photos",
		favourites: "My favourites",
		search: "Search photos",
		results: "photos",
		empty: "No photos here yet.",
		loading: "Loading your album…",
		retry: "Try again",
		disconnected: "We can’t reach the album right now. Check your connection and try again.",
		cover: "The weekend, in frames",
		coverSub: "358 moments across 18 chapters",
		view: "View photo",
		close: "Close viewer",
		previous: "Previous photo",
		next: "Next photo",
		share: "Copy share link",
		copied: "Link copied",
		download: "Download",
		downloadRequests: "Download requests",
		full: "Full quality JPEG",
		quick: "Quick-share JPEG",
		terms: "Photo use and licensing terms",
		details: "Photo details",
		dimensions: "Dimensions",
		size: "File size",
		filename: "Filename",
		removal: "Request removal",
		explanation: "Briefly tell organisers why this photo should be hidden",
		sendRemoval: "Hide photo and send request",
		cancel: "Cancel",
		hidden: "Photo hidden. Organisers will review your request.",
		licenceTitle: "Before you download",
		licenceIntro: "Please read the current bilingual terms. You can cancel without downloading anything.",
		continue: "Continue to download",
		licenceSummary:
			"Event-related personal, educational, journalistic, portfolio, and documentation uses are permitted under these terms. Advertising, recruitment, sponsor promotion, and other promotional uses require applicable consent or CTN confirmation.",
		privacyLink: "Questions about privacy or rights?",
		language: "Français",
		admin: "Moderation",
		manageTitle: "Photo requests",
		pending: "Pending",
		status: "Status",
		requester: "Requester",
		reason: "Explanation",
		action: "Action",
		dismiss: "Dismiss",
		withdraw: "Confirm withdrawal",
		duplicate: "Mark duplicate",
		restore: "Restore",
		restoreReason: "Reason for restoring",
		confirm: "Confirm action",
		crossChannel: "I checked other CTN-controlled copies",
		diagnostics: "Notifications",
		noCases: "No open cases.",
		rights: "Download requests (last 90 days)",
		rightsTitle: "Download requests",
		rightsPurpose:
			"Restricted rights follow-up for this photo. This view is audited and shows requests from the last 90 days.",
		rightsAudit: "Use this information only to follow up on rights questions. There is no bulk export.",
		noRights: "No download requests in the last 90 days.",
		format: "Format",
		requestedAt: "Requested",
		requestId: "Request ID",
		unauthorized: "This page is for designated organisers.",
		signInAdmin: "Sign in with an organiser account to continue.",
		back: "Back to album",
		serviceError: "Something went wrong. Please try again.",
		processing: "Saving…",
		unavailable: "This photo is no longer available.",
		sessionExpired: "Your album access has expired. Please sign in again.",
		albumVisits: "Album visits",
		opens: "Photo opens",
		photoAggregates: "Photo aggregates",
		categoryAggregates: "Category totals",
		formatAggregates: "Format totals",
		photo: "Photo",
		category: "Category",
		fullDownloads: "Full download requests",
		quickDownloads: "Quick download requests",
		loadMore: "Load more cases",
		loadingMore: "Loading more cases…",
	},
	fr: {
		album: "L’album de Hack the Hill III",
		intro: "Un regard chaleureux sur les personnes, les idées et les petits moments du week-end.",
		access: "Utilisez l’adresse courriel de l’événement de Hack the Hill III. Nous vous enverrons un code à huit chiffres.",
		privacy:
			"Nous utilisons votre courriel pour vérifier votre admissibilité et vous connecter. Les visites de l’album et les ouvertures de photos sont mesurées de façon agrégée, sans historique de navigation lié à votre identité. Les demandes individuelles de téléchargement sont conservées 90 jours pour le suivi des droits. Rien ne sert au marketing.",
		email: "Courriel de l’événement",
		send: "Envoyer le code",
		code: "Votre code à huit chiffres",
		verify: "Ouvrir l’album",
		resend: "Renvoyer le code",
		sent: "Code envoyé. Il expire dans 10 minutes.",
		resendIn: "Renvoyer dans",
		support: "Besoin d’accès? Écrivez à privacy@ctn-rtc.org",
		unknown: "Si cette adresse est admissible, un code est en route.",
		signout: "Se déconnecter",
		all: "Toutes les photos",
		favourites: "Mes favoris",
		search: "Rechercher des photos",
		results: "photos",
		empty: "Aucune photo ici pour le moment.",
		loading: "Chargement de votre album…",
		retry: "Réessayer",
		disconnected: "L’album est momentanément inaccessible. Vérifiez votre connexion et réessayez.",
		cover: "Le week-end en images",
		coverSub: "358 moments en 18 chapitres",
		view: "Voir la photo",
		close: "Fermer la visionneuse",
		previous: "Photo précédente",
		next: "Photo suivante",
		share: "Copier le lien",
		copied: "Lien copié",
		download: "Télécharger",
		downloadRequests: "Demandes de téléchargement",
		full: "JPEG pleine qualité",
		quick: "JPEG à partager",
		terms: "Conditions d’utilisation et de licence",
		details: "Détails de la photo",
		dimensions: "Dimensions",
		size: "Taille du fichier",
		filename: "Nom du fichier",
		removal: "Demander le retrait",
		explanation: "Expliquez brièvement pourquoi cette photo devrait être masquée",
		sendRemoval: "Masquer la photo et envoyer la demande",
		cancel: "Annuler",
		hidden: "Photo masquée. Les organisateurs examineront votre demande.",
		licenceTitle: "Avant le téléchargement",
		licenceIntro: "Veuillez lire les conditions bilingues actuelles. Vous pouvez annuler sans rien télécharger.",
		continue: "Continuer le téléchargement",
		licenceSummary:
			"Les usages personnels, éducatifs, journalistiques, de portfolio et de documentation liés à l’événement sont permis selon ces conditions. La publicité, le recrutement, la promotion de commanditaires et les autres usages promotionnels nécessitent le consentement applicable ou la confirmation de CTN.",
		privacyLink: "Questions sur la vie privée ou les droits?",
		language: "English",
		admin: "Modération",
		manageTitle: "Demandes de retrait",
		pending: "En attente",
		status: "État",
		requester: "Demandeur",
		reason: "Explication",
		action: "Action",
		dismiss: "Rejeter",
		withdraw: "Confirmer le retrait",
		duplicate: "Marquer comme doublon",
		restore: "Restaurer",
		restoreReason: "Motif de restauration",
		confirm: "Confirmer l’action",
		crossChannel: "J’ai vérifié les autres copies contrôlées par CTN",
		diagnostics: "Notifications",
		noCases: "Aucun dossier ouvert.",
		unauthorized: "Cette page est réservée aux organisateurs désignés.",
		signInAdmin: "Connectez-vous avec un compte organisateur pour continuer.",
		back: "Retour à l’album",
		serviceError: "Un problème est survenu. Réessayez.",
		processing: "Enregistrement…",
		unavailable: "Cette photo n’est plus disponible.",
		sessionExpired: "Votre accès à l’album a expiré. Veuillez vous reconnecter.",
		albumVisits: "Visites de l’album",
		opens: "Ouvertures de photos",
		photoAggregates: "Totaux par photo",
		categoryAggregates: "Totaux par catégorie",
		formatAggregates: "Totaux par format",
		photo: "Photo",
		category: "Catégorie",
		fullDownloads: "Demandes de téléchargement complètes",
		quickDownloads: "Demandes de téléchargement rapides",
		format: "Format",
		loadMore: "Charger d’autres dossiers",
		loadingMore: "Chargement des dossiers…",
	},
} as const;

const rightsCopy = {
	en: {
		button: "Download requests (last 90 days)",
		title: "Download requests",
		purpose:
			"Restricted rights follow-up for this photo. This view is audited and shows requests from the last 90 days.",
		audit: "Use this information only to follow up on rights questions. There is no bulk export.",
		empty: "No download requests in the last 90 days.",
		format: "Format",
		requested: "Requested",
		requestId: "Request ID",
		loadMore: "Load more requests",
		loadingMore: "Loading more requests…",
	},
	fr: {
		button: "Demandes de téléchargement (90 derniers jours)",
		title: "Demandes de téléchargement",
		purpose:
			"Suivi restreint des droits pour cette photo. Cette vue est auditée et affiche les demandes des 90 derniers jours.",
		audit: "Utilisez ces renseignements uniquement pour répondre aux questions de droits. Il n’y a pas d’exportation groupée.",
		empty: "Aucune demande de téléchargement au cours des 90 derniers jours.",
		format: "Format",
		requested: "Demandée",
		requestId: "ID de demande",
		loadMore: "Charger d’autres demandes",
		loadingMore: "Chargement des demandes…",
	},
} as const;

const api = async <T,>(path: string, init?: RequestInit): Promise<T> => {
	const response = await fetch(path, {
		credentials: "same-origin",
		...init,
		headers: {
			Accept: "application/json",
			...(init?.body ? { "Content-Type": "application/json" } : {}),
			...init?.headers,
		},
	});
	const body = (await response.json().catch(() => ({}))) as T & { error?: string };
	if (!response.ok) throw new Error(body.error || `HTTP ${response.status}`);
	return body;
};

function csrfHeaders(session: PhotoSession): Record<string, string> {
	const headers: Record<string, string> = {};
	if (session.csrfToken) headers["X-CSRF-Token"] = session.csrfToken;
	return headers;
}
function languageFromStorage(): Language {
	return typeof localStorage !== "undefined" && localStorage.getItem("hth-photo-language") === "fr" ? "fr" : "en";
}
function photoLabel(category: string, language: Language) {
	return categories[category]?.[language] || category.replace(/[-_]/g, " ");
}
function formatBytes(bytes: number, language: Language) {
	if (bytes < 1_000_000) return `${Math.round(bytes / 1_000)} ${language === "fr" ? "Ko" : "KB"}`;
	return `${(bytes / 1_000_000).toFixed(1)} ${language === "fr" ? "Mo" : "MB"}`;
}
function displayUrl(url: string) {
	return url.startsWith("/") ? url : `/${url.replace(/^\.?\//, "")}`;
}
function dedupeCases(cases: RemovalCase[]) {
	return Array.from(new Map(cases.map(item => [item.id, item])).values());
}
function dedupeRights(requests: RightsRequest[]) {
	return Array.from(new Map(requests.map(item => [item.requestId, item])).values());
}
function storedFavourites(key: string) {
	try {
		const value: unknown = JSON.parse(localStorage.getItem(key) || "[]");
		return new Set(Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []);
	} catch {
		return new Set<string>();
	}
}

const focusableSelector =
	'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function isTopmostDialog(node: HTMLElement | null) {
	if (!node) return false;
	const dialogs = Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"]'));
	return dialogs[dialogs.length - 1] === node;
}

function useModalFocus(onClose: () => void) {
	const dialog = useRef<HTMLDivElement>(null);
	const onCloseRef = useRef(onClose);
	onCloseRef.current = onClose;
	useEffect(() => {
		const node = dialog.current;
		if (!node) return;
		const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		const focusable = () =>
			Array.from(node.querySelectorAll<HTMLElement>(focusableSelector)).filter(
				item => !item.hasAttribute("aria-hidden") && item.offsetParent !== null,
			);
		(focusable()[0] || node).focus();
		const handleKeyDown = (event: KeyboardEvent) => {
			if (!isTopmostDialog(node)) return;
			if (event.key === "Escape") {
				event.preventDefault();
				onCloseRef.current();
				return;
			}
			if (event.key !== "Tab") return;
			const items = focusable();
			if (!items.length) {
				event.preventDefault();
				node.focus();
				return;
			}
			const first = items[0];
			const last = items[items.length - 1];
			if (!node.contains(document.activeElement)) {
				event.preventDefault();
				(event.shiftKey ? last : first).focus();
				return;
			}
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};
		window.addEventListener("keydown", handleKeyDown, true);
		return () => {
			window.removeEventListener("keydown", handleKeyDown, true);
			window.requestAnimationFrame(() => {
				if (previousFocus?.isConnected) previousFocus.focus();
			});
		};
	}, []);
	return dialog;
}

function ModalDialog({
	className,
	onClose,
	labelledBy,
	children,
}: {
	className?: string;
	onClose: () => void;
	labelledBy: string;
	children: ReactNode;
}) {
	const dialog = useModalFocus(onClose);
	return (
		<div
			className={className || styles.dialog}
			role="dialog"
			aria-modal="true"
			aria-labelledby={labelledBy}
			tabIndex={-1}
			ref={dialog}
		>
			{children}
		</div>
	);
}

export default function Photos({ manage = false }: { manage?: boolean }) {
	const [language, setLanguage] = useState<Language>(languageFromStorage);
	const [session, setSession] = useState<PhotoSession | null>(null);
	const [manifest, setManifest] = useState<AlbumManifest | null>(null);
	const [busy, setBusy] = useState(true);
	const [notice, setNotice] = useState<Notice>(null);
	const refreshingRef = useRef(false);
	const t = copy[language];
	const disconnectedLabelRef = useRef(t.disconnected);
	disconnectedLabelRef.current = t.disconnected;

	useEffect(() => {
		localStorage.setItem("hth-photo-language", language);
		document.documentElement.lang = language;
	}, [language]);
	const loadSession = useCallback(async () => {
		setBusy(true);
		setNotice(null);
		try {
			const next = await api<PhotoSession>("/photos/api/auth/session");
			setSession(next);
			if (next.authenticated && !manage) setManifest(await api<AlbumManifest>("/photos/api/album"));
		} catch {
			setNotice({ kind: "error", text: disconnectedLabelRef.current });
		} finally {
			setBusy(false);
		}
	}, [manage]);
	const refreshAlbum = useCallback(async () => {
		if (manage || !session?.authenticated || refreshingRef.current) return;
		refreshingRef.current = true;
		try {
			const nextSession = await api<PhotoSession>("/photos/api/auth/session");
			if (!nextSession.authenticated) {
				localStorage.removeItem(`hth-photo-favourites:${session.accountId || "unknown"}`);
				setManifest(null);
				setSession({ authenticated: false });
				setNotice({ kind: "info", text: t.sessionExpired });
				return;
			}
			const nextManifest = await api<AlbumManifest>("/photos/api/album");
			setSession(nextSession);
			setManifest(nextManifest);
		} catch {
			// A quiet refresh should leave the current album usable during a transient outage.
		} finally {
			refreshingRef.current = false;
		}
	}, [manage, session, t.sessionExpired]);
	useEffect(() => {
		if (manage || !session?.authenticated) return;
		const refresh = () => {
			if (document.visibilityState === "visible") void refreshAlbum();
		};
		window.addEventListener("focus", refresh);
		document.addEventListener("visibilitychange", refresh);
		return () => {
			window.removeEventListener("focus", refresh);
			document.removeEventListener("visibilitychange", refresh);
		};
	}, [manage, refreshAlbum, session?.authenticated]);
	useEffect(() => {
		if (!manage) void loadSession();
		else {
			setBusy(false);
			setSession(null);
		}
	}, [loadSession, manage]);
	const signOut = async () => {
		if (!session) return;
		setNotice(null);
		try {
			await api("/photos/api/auth/logout", { method: "POST", body: "{}", headers: csrfHeaders(session) });
		} catch (error) {
			setNotice({ kind: "error", text: error instanceof Error ? error.message : t.serviceError });
			return;
		}
		localStorage.removeItem(`hth-photo-favourites:${session.accountId || "unknown"}`);
		setManifest(null);
		setSession({ authenticated: false });
	};

	if (busy)
		return (
			<Shell language={language} setLanguage={setLanguage}>
				<main className={styles.centerState} aria-live="polite">
					<Spinner />
					{t.loading}
				</main>
			</Shell>
		);
	if (manage) return <Manage language={language} setLanguage={setLanguage} notice={notice} setNotice={setNotice} />;
	if (!session?.authenticated)
		return (
			<Auth
				language={language}
				setLanguage={setLanguage}
				onAuthenticated={next => {
					setBusy(true);
					setSession(next);
					void api<AlbumManifest>("/photos/api/album")
						.then(setManifest)
						.catch(() => setNotice({ kind: "error", text: t.disconnected }))
						.finally(() => setBusy(false));
				}}
				notice={notice}
				setNotice={setNotice}
			/>
		);
	if (!manifest)
		return (
			<Shell language={language} setLanguage={setLanguage}>
				<main className={styles.centerState}>
					<p>{t.disconnected}</p>
					<button className={styles.button} onClick={() => void loadSession()}>
						{t.retry}
					</button>
				</main>
			</Shell>
		);
	return (
		<Album
			language={language}
			setLanguage={setLanguage}
			session={session}
			manifest={manifest}
			setManifest={setManifest}
			onSignOut={signOut}
			notice={notice}
			setNotice={setNotice}
		/>
	);
}

function Shell({
	language,
	setLanguage,
	children,
	admin = false,
}: {
	language: Language;
	setLanguage: (value: Language) => void;
	children: ReactNode;
	admin?: boolean;
}) {
	const t = copy[language];
	return (
		<div className={styles.app}>
			<header className={styles.topbar}>
				<a href="/photos/" className={styles.brand} aria-label="Hack the Hill III">
					<img src="/Logos/hackthehill-logo.svg" alt="" />
					<span>
						HACK THE HILL <small>III</small>
					</span>
				</a>
				<div className={styles.topActions}>
					{admin && <a href="/photos/">{t.back}</a>}
					<button
						className={styles.language}
						onClick={() => setLanguage(language === "en" ? "fr" : "en")}
						lang={language === "en" ? "fr" : "en"}
					>
						{t.language}
					</button>
				</div>
			</header>
			{children}
			<footer className={styles.footer}>
				Hack the Hill III · <a href="mailto:privacy@ctn-rtc.org">privacy@ctn-rtc.org</a>
			</footer>
		</div>
	);
}

function Spinner() {
	return <span className={styles.spinner} aria-hidden="true" />;
}

function Auth({
	language,
	setLanguage,
	onAuthenticated,
	notice,
	setNotice,
}: {
	language: Language;
	setLanguage: (v: Language) => void;
	onAuthenticated: (s: PhotoSession) => void;
	notice: Notice;
	setNotice: (n: Notice) => void;
}) {
	const t = copy[language];
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [sent, setSent] = useState(false);
	const [seconds, setSeconds] = useState(60);
	const [busy, setBusy] = useState(false);
	useEffect(() => {
		if (!sent || seconds <= 0) return;
		const timer = window.setInterval(() => setSeconds(value => value - 1), 1_000);
		return () => window.clearInterval(timer);
	}, [sent, seconds]);
	const request = async (event: FormEvent) => {
		event.preventDefault();
		setBusy(true);
		setNotice(null);
		try {
			await api("/photos/api/auth/request", {
				method: "POST",
				body: JSON.stringify({ email: email.trim(), language }),
			});
			setSent(true);
			setSeconds(60);
			setNotice({ kind: "info", text: t.unknown });
		} catch (error) {
			setNotice({ kind: "error", text: error instanceof Error ? error.message : t.serviceError });
		} finally {
			setBusy(false);
		}
	};
	const verify = async (event: FormEvent) => {
		event.preventDefault();
		if (code.length !== 8) return;
		setBusy(true);
		setNotice(null);
		try {
			onAuthenticated(
				await api<PhotoSession>("/photos/api/auth/verify", {
					method: "POST",
					body: JSON.stringify({ email: email.trim(), code }),
				}),
			);
		} catch (error) {
			setNotice({ kind: "error", text: error instanceof Error ? error.message : t.serviceError });
		} finally {
			setBusy(false);
		}
	};
	return (
		<Shell language={language} setLanguage={setLanguage}>
			<main className={styles.authPage}>
				<section className={styles.authCard} aria-labelledby="auth-title">
					<div className={styles.eyebrow}>HACK THE HILL III · 2026</div>
					<h1 id="auth-title">{t.album}</h1>
					<p className={styles.lead}>{t.intro}</p>
					<div className={styles.noPhotos}>
						<span aria-hidden="true">✦</span>
						<span>
							{t.cover} · {t.coverSub}
						</span>
					</div>
					<p className={styles.access}>{t.access}</p>
					{sent ? (
						<form onSubmit={verify}>
							<label htmlFor="photo-code">{t.code}</label>
							<input
								id="photo-code"
								className={styles.codeInput}
								inputMode="numeric"
								autoComplete="one-time-code"
								maxLength={8}
								pattern="[0-9]{8}"
								value={code}
								onChange={event => setCode(event.target.value.replace(/\D/g, "").slice(0, 8))}
								onPaste={event => {
									const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8);
									if (pasted) {
										event.preventDefault();
										setCode(pasted);
									}
								}}
								required
							/>
							<p className={styles.muted}>{t.sent}</p>
							<button className={styles.button} disabled={busy || code.length !== 8}>
								{busy ? <Spinner /> : t.verify}
							</button>
							<button
								type="button"
								className={styles.textButton}
								disabled={seconds > 0 || busy}
								onClick={request}
							>
								{seconds > 0 ? `${t.resendIn} ${seconds}s` : t.resend}
							</button>
						</form>
					) : (
						<form onSubmit={request}>
							<label htmlFor="photo-email">{t.email}</label>
							<input
								id="photo-email"
								type="email"
								autoComplete="email"
								value={email}
								onChange={event => setEmail(event.target.value)}
								required
							/>
							<button className={styles.button} disabled={busy}>
								{busy ? <Spinner /> : t.send}
							</button>
						</form>
					)}
					<p className={styles.privacy}>{t.privacy}</p>
					<p className={styles.support}>
						<a href="mailto:privacy@ctn-rtc.org">{t.support}</a>
					</p>
					{notice && <NoticeBox notice={notice} />}
				</section>
			</main>
		</Shell>
	);
}

function NoticeBox({ notice }: { notice: Notice }) {
	return notice ? (
		<div className={`${styles.notice} ${styles[notice.kind]}`} role={notice.kind === "error" ? "alert" : "status"}>
			{notice.text}
		</div>
	) : null;
}

function Album({
	language,
	setLanguage,
	session,
	manifest,
	setManifest,
	onSignOut,
	notice,
	setNotice,
}: {
	language: Language;
	setLanguage: (v: Language) => void;
	session: PhotoSession;
	manifest: AlbumManifest;
	setManifest: (m: AlbumManifest) => void;
	onSignOut: () => void;
	notice: Notice;
	setNotice: (n: Notice) => void;
}) {
	const t = copy[language];
	const [category, setCategory] = useState<Category>("all");
	const [query, setQuery] = useState("");
	const sharedPhotoId = new URLSearchParams(window.location.search).get("photo");
	const sharedPhoto = manifest.photos.find(item => item.id === sharedPhotoId) || null;
	const [viewer, setViewer] = useState<AlbumPhoto | null>(sharedPhoto);
	const [favourites, setFavourites] = useState<Set<string>>(() =>
		storedFavourites(`hth-photo-favourites:${session.accountId || "unknown"}`),
	);
	const [terms, setTerms] = useState<AlbumPhoto | null>(null);
	const [removal, setRemoval] = useState<AlbumPhoto | null>(null);
	const visitSent = useRef(false);
	useEffect(() => {
		if (visitSent.current) return;
		visitSent.current = true;
		void api("/photos/api/events", {
			method: "POST",
			body: JSON.stringify({ photoIds: [], albumVisit: true }),
			headers: csrfHeaders(session),
		}).catch(() => undefined);
	}, [session]);
	useEffect(() => {
		const stillAvailable = (photo: AlbumPhoto | null) =>
			!photo || manifest.photos.some(item => item.id === photo.id);
		if (stillAvailable(viewer) && stillAvailable(terms) && stillAvailable(removal)) return;
		setViewer(current => (stillAvailable(current) ? current : null));
		setTerms(current => (stillAvailable(current) ? current : null));
		setRemoval(current => (stillAvailable(current) ? current : null));
		window.history.replaceState({}, "", "/photos/");
		setNotice({ kind: "info", text: t.unavailable });
	}, [manifest.photos, removal, setNotice, t.unavailable, terms, viewer]);
	const coverPhoto =
		manifest.photos.find(item => item.category === "Opening Ceremony" && item.filename === "DSC_3416.jpg") ||
		manifest.photos.find(item => item.category === "Closing Ceremony") ||
		manifest.photos[0];
	const closeViewer = () => {
		setViewer(null);
		window.history.replaceState({}, "", "/photos/");
	};
	const categoryCounts = useMemo(
		() =>
			manifest.photos.reduce<Record<string, number>>((counts, photo) => {
				counts[photo.category] = (counts[photo.category] || 0) + 1;
				return counts;
			}, {}),
		[manifest.photos],
	);
	const filtered = useMemo(
		() =>
			manifest.photos.filter(
				photo =>
					(category === "all" ||
						(category === "favourites" ? favourites.has(photo.id) : photo.category === category)) &&
					(!query.trim() ||
						`${photo.filename} ${photo.category}`.toLowerCase().includes(query.trim().toLowerCase())),
			),
		[manifest.photos, category, favourites, query],
	);
	const toggleFavourite = (id: string) =>
		setFavourites(previous => {
			const next = new Set(previous);
			next.has(id) ? next.delete(id) : next.add(id);
			localStorage.setItem(`hth-photo-favourites:${session.accountId || "unknown"}`, JSON.stringify([...next]));
			return next;
		});
	return (
		<Shell language={language} setLanguage={setLanguage}>
			<main className={styles.album}>
				<section className={styles.albumHero}>
					<div>
						<div className={styles.eyebrow}>HACK THE HILL III · 2026</div>
						<h1>{t.cover}</h1>
						<p>{t.intro}</p>
						<button className={styles.textButton} onClick={onSignOut}>
							{t.signout}
						</button>
					</div>
					{coverPhoto ? (
						<div className={styles.heroPhoto}>
							<img
								src={displayUrl(coverPhoto.thumbnail.url)}
								alt=""
								width={coverPhoto.thumbnail.width}
								height={coverPhoto.thumbnail.height}
							/>
						</div>
					) : (
						<div className={styles.heroStamp} aria-hidden="true">
							<strong>18</strong>
							<span>{language === "en" ? "chapters" : "chapitres"}</span>
						</div>
					)}
				</section>
				{sharedPhotoId && !sharedPhoto && (
					<div className={styles.notice} role="status">
						{t.unavailable}
					</div>
				)}
				<div className={styles.toolbar}>
					<nav
						className={styles.categoryNav}
						aria-label={language === "en" ? "Photo categories" : "Catégories de photos"}
					>
						<button
							className={category === "all" ? styles.activeTab : ""}
							onClick={() => setCategory("all")}
						>
							{t.all} <span>{manifest.photos.length}</span>
						</button>
						<button
							className={category === "favourites" ? styles.activeTab : ""}
							onClick={() => setCategory("favourites")}
						>
							{t.favourites} <span>{favourites.size}</span>
						</button>
						{Object.keys(categories)
							.filter(key => categoryCounts[key])
							.map(key => (
								<button
									key={key}
									className={category === key ? styles.activeTab : ""}
									onClick={() => setCategory(key)}
								>
									{photoLabel(key, language)} <span>{categoryCounts[key]}</span>
								</button>
							))}
					</nav>
					<label className={styles.search}>
						<span className="srOnly">{t.search}</span>
						<span aria-hidden="true">⌕</span>
						<input placeholder={t.search} value={query} onChange={event => setQuery(event.target.value)} />
					</label>
				</div>
				{notice && <NoticeBox notice={notice} />}
				<p className={styles.resultCount}>
					{filtered.length} {t.results}
				</p>
				{filtered.length ? (
					<ul className={styles.grid}>
						{filtered.map(photo => (
							<li key={photo.id}>
								<article className={styles.photoCard}>
									<button
										className={styles.photoButton}
										onClick={() => {
											setViewer(photo);
											window.history.replaceState(
												{},
												"",
												`/photos/?photo=${encodeURIComponent(photo.id)}`,
											);
										}}
										aria-label={`${t.view}: ${photo.filename}`}
									>
										<img
											src={displayUrl(photo.thumbnail.url)}
											alt=""
											loading="lazy"
											width={photo.thumbnail.width}
											height={photo.thumbnail.height}
										/>
										<span className={styles.viewLabel}>{t.view}</span>
									</button>
									<div className={styles.cardMeta}>
										<div>
											<strong>{photoLabel(photo.category, language)}</strong>
											<span>{photo.filename}</span>
										</div>
										<button
											className={`${styles.favourite} ${favourites.has(photo.id) ? styles.favouriteOn : ""}`}
											onClick={() => toggleFavourite(photo.id)}
											aria-label={
												favourites.has(photo.id)
													? language === "en"
														? "Remove from favourites"
														: "Retirer des favoris"
													: language === "en"
														? "Add to favourites"
														: "Ajouter aux favoris"
											}
											aria-pressed={favourites.has(photo.id)}
										>
											♥
										</button>
									</div>
								</article>
							</li>
						))}
					</ul>
				) : (
					<div className={styles.empty}>
						<span aria-hidden="true">✦</span>
						<p>{t.empty}</p>
					</div>
				)}
			</main>
			{viewer && (
				<Viewer
					photo={viewer}
					photos={filtered}
					language={language}
					session={session}
					favourites={favourites}
					onToggleFavourite={toggleFavourite}
					onClose={closeViewer}
					onTerms={setTerms}
					onRemoval={setRemoval}
					setNotice={setNotice}
				/>
			)}
			{terms && (
				<LicenceDialog
					language={language}
					photo={terms}
					session={session}
					onClose={() => setTerms(null)}
					setNotice={setNotice}
				/>
			)}
			{removal && (
				<RemovalDialog
					language={language}
					photo={removal}
					session={session}
					onClose={() => setRemoval(null)}
					onHidden={photo => {
						setManifest({ ...manifest, photos: manifest.photos.filter(item => item.id !== photo.id) });
						closeViewer();
						setNotice({ kind: "success", text: t.hidden });
					}}
				/>
			)}
		</Shell>
	);
}

function Viewer({
	photo,
	photos,
	language,
	session,
	favourites,
	onToggleFavourite,
	onClose,
	onTerms,
	onRemoval,
	setNotice,
}: {
	photo: AlbumPhoto;
	photos: AlbumPhoto[];
	language: Language;
	session: PhotoSession;
	favourites: Set<string>;
	onToggleFavourite: (id: string) => void;
	onClose: () => void;
	onTerms: (p: AlbumPhoto) => void;
	onRemoval: (p: AlbumPhoto) => void;
	setNotice: (n: Notice) => void;
}) {
	const t = copy[language];
	const initialIndex = Math.max(
		0,
		photos.findIndex(item => item.id === photo.id),
	);
	const [position, setPosition] = useState(initialIndex);
	const current = photos[position] || photo;
	const dialog = useModalFocus(onClose);
	const touchStart = useRef<number | null>(null);
	const queue = useRef<Set<string>>(new Set());
	const navigate = useCallback(
		(delta: number) => {
			const nextPosition = (position + delta + photos.length) % photos.length;
			const next = photos[nextPosition];
			if (next) {
				setPosition(nextPosition);
				window.history.replaceState({}, "", `/photos/?photo=${encodeURIComponent(next.id)}`);
			}
		},
		[photos, position],
	);
	useEffect(() => {
		const key = (event: globalThis.KeyboardEvent) => {
			if (!isTopmostDialog(dialog.current)) return;
			if (event.key === "ArrowLeft") navigate(-1);
			if (event.key === "ArrowRight") navigate(1);
		};
		window.addEventListener("keydown", key);
		queue.current.add(current.id);
		const timer = window.setTimeout(() => {
			if (queue.current.size) {
				const ids = [...queue.current];
				queue.current.clear();
				void api("/photos/api/events", {
					method: "POST",
					body: JSON.stringify({ photoIds: ids, albumVisit: false }),
					headers: csrfHeaders(session),
				}).catch(() => undefined);
			}
		}, 700);
		return () => {
			window.removeEventListener("keydown", key);
			window.clearTimeout(timer);
		};
	}, [navigate, current.id, session, dialog]);
	const handleTouchStart = (event: TouchEvent) => {
		touchStart.current = event.changedTouches[0]?.clientX ?? null;
	};
	const handleTouchEnd = (event: TouchEvent) => {
		if (touchStart.current === null) return;
		const difference = (event.changedTouches[0]?.clientX ?? 0) - touchStart.current;
		if (Math.abs(difference) > 50) navigate(difference > 0 ? -1 : 1);
		touchStart.current = null;
	};
	return (
		<div className={styles.modalBackdrop} role="presentation">
			<div
				className={styles.viewer}
				role="dialog"
				aria-modal="true"
				aria-labelledby="viewer-title"
				tabIndex={-1}
				ref={dialog}
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
			>
				<div className={styles.viewerTop}>
					<span className={styles.eyebrow}>{photoLabel(current.category, language)}</span>
					<button className={styles.iconButton} onClick={onClose} aria-label={t.close}>
						×
					</button>
				</div>
				<div className={styles.viewerImageWrap}>
					<button
						className={`${styles.viewerArrow} ${styles.viewerPrev}`}
						onClick={() => navigate(-1)}
						aria-label={t.previous}
					>
						‹
					</button>
					<img
						className={styles.viewerImage}
						src={displayUrl(current.preview.url)}
						alt=""
						width={current.preview.width}
						height={current.preview.height}
					/>
					<button
						className={`${styles.viewerArrow} ${styles.viewerNext}`}
						onClick={() => navigate(1)}
						aria-label={t.next}
					>
						›
					</button>
				</div>
				<div className={styles.viewerInfo}>
					<div>
						<h2 id="viewer-title">{current.filename}</h2>
						<p>
							{current.width} × {current.height} px ·{" "}
							{formatBytes(current.downloads.full.bytes, language)}
						</p>
					</div>
					<button
						className={`${styles.favouriteLarge} ${favourites.has(current.id) ? styles.favouriteOn : ""}`}
						onClick={() => onToggleFavourite(current.id)}
						aria-pressed={favourites.has(current.id)}
					>
						♥
					</button>
				</div>
				<div className={styles.viewerActions}>
					<button className={styles.button} onClick={() => onTerms(current)}>
						↓ {t.download}
					</button>
					<button
						className={styles.outlineButton}
						onClick={() => {
							const link = `${window.location.origin}/photos/?photo=${encodeURIComponent(current.id)}`;
							void navigator.clipboard
								?.writeText(link)
								.then(() => setNotice({ kind: "success", text: t.copied }))
								.catch(() => setNotice({ kind: "info", text: link }));
						}}
					>
						{t.share}
					</button>
					<button className={styles.textButton} onClick={() => onRemoval(current)}>
						{t.removal}
					</button>
				</div>
				<details className={styles.details}>
					<summary>{t.details}</summary>
					<dl>
						<dt>{t.filename}</dt>
						<dd>{current.filename}</dd>
						<dt>{t.dimensions}</dt>
						<dd>
							{current.width} × {current.height}px
						</dd>
						<dt>{t.size}</dt>
						<dd>{formatBytes(current.downloads.full.bytes, language)}</dd>
					</dl>
				</details>
			</div>
		</div>
	);
}

function LicenceDialog({
	language,
	photo,
	session,
	onClose,
	setNotice,
}: {
	language: Language;
	photo: AlbumPhoto;
	session: PhotoSession;
	onClose: () => void;
	setNotice: (n: Notice) => void;
}) {
	const t = copy[language];
	const [busy, setBusy] = useState(false);
	const acknowledge = async (format: "full" | "quick") => {
		setBusy(true);
		try {
			await api("/photos/api/licence/acknowledge", {
				method: "POST",
				body: JSON.stringify({ version: LICENCE_VERSION }),
				headers: csrfHeaders(session),
			});
			const requestId = crypto.randomUUID();
			window.location.assign(
				`/photos/download/${encodeURIComponent(photo.id)}?format=${format}&requestId=${requestId}`,
			);
		} catch (error) {
			setNotice({ kind: "error", text: error instanceof Error ? error.message : t.serviceError });
			setBusy(false);
		}
	};
	return (
		<div className={styles.modalBackdrop}>
			<ModalDialog
				className={`${styles.dialog} ${styles.licenceDialog}`}
				onClose={onClose}
				labelledBy="licence-title"
			>
				<button className={styles.dialogClose} onClick={onClose} aria-label={t.cancel}>
					×
				</button>
				<div className={styles.eyebrow}>{t.terms}</div>
				<h2 id="licence-title">{t.licenceTitle}</h2>
				<p>{t.licenceIntro}</p>
				<p className={styles.licenceSummary}>{t.licenceSummary}</p>
				<div className={styles.licenceColumns}>
					<div lang="en">
						<h3>English</h3>
						{licence.en.map((line, index) => (
							<p key={index}>{line}</p>
						))}
					</div>
					<div lang="fr">
						<h3>Français</h3>
						{licence.fr.map((line, index) => (
							<p key={index}>{line}</p>
						))}
					</div>
				</div>
				<div className={styles.downloadChoices}>
					<button className={styles.button} disabled={busy} onClick={() => void acknowledge("full")}>
						{t.continue} · {t.full}
					</button>
					<button className={styles.outlineButton} disabled={busy} onClick={() => void acknowledge("quick")}>
						{t.continue} · {t.quick}
					</button>
					<button className={styles.textButton} onClick={onClose}>
						{t.cancel}
					</button>
				</div>
			</ModalDialog>
		</div>
	);
}

function RemovalDialog({
	language,
	photo,
	session,
	onClose,
	onHidden,
}: {
	language: Language;
	photo: AlbumPhoto;
	session: PhotoSession;
	onClose: () => void;
	onHidden: (p: AlbumPhoto) => void;
}) {
	const t = copy[language];
	const [explanation, setExplanation] = useState("");
	const [busy, setBusy] = useState(false);
	const submit = async (event: FormEvent) => {
		event.preventDefault();
		if (!explanation.trim()) return;
		setBusy(true);
		try {
			await api(`/photos/api/photos/${encodeURIComponent(photo.id)}/removal-requests`, {
				method: "POST",
				body: JSON.stringify({ explanation: explanation.trim(), requestId: crypto.randomUUID() }),
				headers: csrfHeaders(session),
			});
			onHidden(photo);
		} catch {
			setBusy(false);
		}
	};
	return (
		<div className={styles.modalBackdrop}>
			<ModalDialog onClose={onClose} labelledBy="removal-title">
				<button className={styles.dialogClose} onClick={onClose} aria-label={t.cancel}>
					×
				</button>
				<h2 id="removal-title">{t.removal}</h2>
				<p>{t.hidden}</p>
				<form onSubmit={submit}>
					<label htmlFor="removal-explanation">{t.explanation}</label>
					<textarea
						id="removal-explanation"
						rows={5}
						value={explanation}
						onChange={event => setExplanation(event.target.value)}
						required
					/>
					<div className={styles.dialogActions}>
						<button className={styles.button} disabled={busy || !explanation.trim()}>
							{busy ? t.processing : t.sendRemoval}
						</button>
						<button type="button" className={styles.textButton} onClick={onClose}>
							{t.cancel}
						</button>
					</div>
				</form>
			</ModalDialog>
		</div>
	);
}

function Manage({
	language,
	setLanguage,
	notice,
	setNotice,
}: {
	language: Language;
	setLanguage: (v: Language) => void;
	notice: Notice;
	setNotice: (n: Notice) => void;
}) {
	const t = copy[language];
	const rights = rightsCopy[language];
	const [adminSession, setAdminSession] = useState<PhotoSession | null>(null);
	const [summary, setSummary] = useState<GalleryManageSummary | null>(null);
	const [busy, setBusy] = useState(false);
	const [reason, setReason] = useState("");
	const [activeCase, setActiveCase] = useState<RemovalCase | null>(null);
	const [action, setAction] = useState<"dismiss" | "withdraw" | "duplicate" | "restore" | null>(null);
	const [crossChannelReviewed, setCrossChannelReviewed] = useState(false);
	const [highlightCaseId, setHighlightCaseId] = useState<string | null>(null);
	const [rightsPhoto, setRightsPhoto] = useState<RemovalCase | null>(null);
	const [rightsRequests, setRightsRequests] = useState<RightsRequest[] | null>(null);
	const [rightsNextCursor, setRightsNextCursor] = useState<string | null>(null);
	const [rightsBusy, setRightsBusy] = useState(false);
	const [summaryLoading, setSummaryLoading] = useState(false);
	const adminSessionRef = useRef<PhotoSession | null>(null);
	const load = useCallback(
		async (cursor?: string) => {
			setSummaryLoading(true);
			try {
				let currentSession = adminSessionRef.current;
				if (!currentSession) {
					currentSession = await api<PhotoSession>("/photos/api/manage/session");
					adminSessionRef.current = currentSession;
					setAdminSession(currentSession);
				}
				if (!currentSession.authenticated || !currentSession.administrator) return;
				if (!cursor) {
					const target = new URLSearchParams(window.location.search).get("case");
					const first = await api<GalleryManageSummary>("/photos/api/manage", {
						headers: csrfHeaders(currentSession),
					});
					const selected = target
						? await api<GalleryManageSummary>(`/photos/api/manage?case=${encodeURIComponent(target)}`, {
								headers: csrfHeaders(currentSession),
							})
						: null;
					setSummary({
						...first,
						cases: dedupeCases([...(selected?.selectedCases || []), ...first.cases]),
					});
					return;
				}
				const queryParams = new URLSearchParams();
				queryParams.set("cursor", cursor);
				const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
				const next = await api<GalleryManageSummary>(`/photos/api/manage${query}`, {
					headers: csrfHeaders(currentSession),
				});
				setSummary(previous => ({
					...next,
					cases: cursor
						? dedupeCases([...(previous?.cases || []), ...(next.selectedCases || []), ...next.cases])
						: dedupeCases([...(next.selectedCases || []), ...next.cases]),
				}));
			} catch (error) {
				setNotice({ kind: "error", text: error instanceof Error ? error.message : t.unauthorized });
			} finally {
				setSummaryLoading(false);
			}
		},
		[setNotice, t.unauthorized],
	);
	useEffect(() => {
		void load();
	}, [load]);
	useEffect(() => {
		const target = new URLSearchParams(window.location.search).get("case");
		if (target && summary?.cases.some(item => item.id === target)) setHighlightCaseId(target);
		else if (target && summary?.nextCursor && !summaryLoading) void load(summary.nextCursor);
	}, [load, summary, summaryLoading]);
	useEffect(() => {
		if (!highlightCaseId) return;
		document
			.getElementById(`photo-case-${highlightCaseId}`)
			?.scrollIntoView({ behavior: "smooth", block: "center" });
	}, [highlightCaseId]);
	const aggregateRows = summary?.aggregates || [];
	const categoryRows = useMemo(() => {
		const rows = new Map<string, { opens: number; fullDownloads: number; quickDownloads: number }>();
		for (const item of aggregateRows) {
			const key = item.category || "Other";
			const previous = rows.get(key) || { opens: 0, fullDownloads: 0, quickDownloads: 0 };
			rows.set(key, {
				opens: previous.opens + item.opens,
				fullDownloads: previous.fullDownloads + (item.fullDownloads ?? item.downloads),
				quickDownloads: previous.quickDownloads + (item.quickDownloads ?? 0),
			});
		}
		return [...rows.entries()].map(([category, values]) => ({ category, ...values }));
	}, [aggregateRows]);
	const formatTotals = useMemo(
		() => ({
			fullDownloads: aggregateRows.reduce((sum, item) => sum + (item.fullDownloads ?? item.downloads), 0),
			quickDownloads: aggregateRows.reduce((sum, item) => sum + (item.quickDownloads ?? 0), 0),
		}),
		[aggregateRows],
	);
	if (!adminSession?.authenticated || !adminSession.administrator)
		return (
			<Shell language={language} setLanguage={setLanguage} admin>
				<main className={styles.authPage}>
					<section className={styles.authCard}>
						<div className={styles.eyebrow}>{t.admin}</div>
						<h1>{t.manageTitle}</h1>
						<p>{t.signInAdmin}</p>
						<a className={styles.button} href="/photos/manage">
							{language === "en" ? "Continue with Google Workspace" : "Continuer avec Google Workspace"}
						</a>
						{notice && <NoticeBox notice={notice} />}
					</section>
				</main>
			</Shell>
		);
	const activeSession = adminSession;
	const viewRights = async (item: RemovalCase, cursor?: string) => {
		if (!cursor) {
			setRightsPhoto(item);
			setRightsRequests(null);
			setRightsNextCursor(null);
		}
		setRightsBusy(true);
		try {
			const query = cursor ? `?cursor=${encodeURIComponent(cursor)}` : "";
			const result = await api<RightsResponse>(
				`/photos/api/manage/rights/${encodeURIComponent(item.photoId)}${query}`,
				{ headers: csrfHeaders(activeSession) },
			);
			setRightsRequests(previous =>
				cursor ? dedupeRights([...(previous || []), ...result.requests]) : dedupeRights(result.requests),
			);
			setRightsNextCursor(result.nextCursor || null);
		} catch (error) {
			setNotice({ kind: "error", text: error instanceof Error ? error.message : t.serviceError });
			setRightsPhoto(null);
		} finally {
			setRightsBusy(false);
		}
	};
	const saveAction = async () => {
		if (!activeCase || !action || !reason.trim()) return;
		setBusy(true);
		try {
			await api(`/photos/api/manage/cases/${encodeURIComponent(activeCase.id)}`, {
				method: "POST",
				body: JSON.stringify({
					action,
					reason: reason.trim(),
					expectedVersion: activeCase.photoVersion,
					crossChannelReviewed,
				}),
				headers: csrfHeaders(activeSession),
			});
			setActiveCase(null);
			setAction(null);
			setReason("");
			setCrossChannelReviewed(false);
			await load();
		} catch (error) {
			setNotice({ kind: "error", text: error instanceof Error ? error.message : t.serviceError });
		} finally {
			setBusy(false);
		}
	};
	return (
		<Shell language={language} setLanguage={setLanguage} admin>
			<main className={styles.managePage}>
				<div className={styles.manageHeader}>
					<div>
						<div className={styles.eyebrow}>{t.admin}</div>
						<h1>{t.manageTitle}</h1>
					</div>
					<div className={styles.diagnostic}>
						<span>{t.diagnostics}</span>
						<strong>{summary?.diagnostics.failedNotifications || 0}</strong>
					</div>
				</div>
				{notice && <NoticeBox notice={notice} />}
				{summary && (
					<>
						<div className={styles.manageStats}>
							<div>
								<strong>
									{summary.pendingTotal ??
										summary.cases.filter(item => item.status === "pending").length}
								</strong>
								<span>{t.pending}</span>
							</div>
							<div>
								<strong>{summary.albumVisits ?? 0}</strong>
								<span>{t.albumVisits}</span>
							</div>
							<div>
								<strong>{summary.aggregates.reduce((sum, item) => sum + item.opens, 0)}</strong>
								<span>{t.opens}</span>
							</div>
							<div>
								<strong>{summary.diagnostics.pendingNotifications}</strong>
								<span>{t.diagnostics}</span>
							</div>
							<div>
								<strong>{formatTotals.fullDownloads + formatTotals.quickDownloads}</strong>
								<span>{t.downloadRequests}</span>
							</div>
						</div>
						<details className={styles.aggregateDetails}>
							<summary>
								{language === "en" ? "Open aggregate reporting" : "Ouvrir les rapports agrégés"}
							</summary>
							<div className={styles.aggregateTables}>
								<section>
									<h2>{t.photoAggregates}</h2>
									<div className={styles.tableScroll}>
										<table>
											<thead>
												<tr>
													<th>{t.photo}</th>
													<th>{t.category}</th>
													<th>{t.opens}</th>
													<th>{t.fullDownloads}</th>
													<th>{t.quickDownloads}</th>
												</tr>
											</thead>
											<tbody>
												{aggregateRows.map(item => (
													<tr key={item.photoId}>
														<td>{item.filename || item.photoId}</td>
														<td>{photoLabel(item.category || "Other", language)}</td>
														<td>{item.opens}</td>
														<td>{item.fullDownloads ?? item.downloads}</td>
														<td>{item.quickDownloads ?? 0}</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</section>
								<section>
									<h2>{t.categoryAggregates}</h2>
									<div className={styles.tableScroll}>
										<table>
											<thead>
												<tr>
													<th>{t.category}</th>
													<th>{t.opens}</th>
													<th>{t.fullDownloads}</th>
													<th>{t.quickDownloads}</th>
												</tr>
											</thead>
											<tbody>
												{categoryRows.map(item => (
													<tr key={item.category}>
														<td>{photoLabel(item.category, language)}</td>
														<td>{item.opens}</td>
														<td>{item.fullDownloads}</td>
														<td>{item.quickDownloads}</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</section>
								<section>
									<h2>{t.formatAggregates}</h2>
									<div className={styles.tableScroll}>
										<table>
											<thead>
												<tr>
													<th>{t.format}</th>
													<th>{t.downloadRequests}</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>{t.full}</td>
													<td>{formatTotals.fullDownloads}</td>
												</tr>
												<tr>
													<td>{t.quick}</td>
													<td>{formatTotals.quickDownloads}</td>
												</tr>
											</tbody>
										</table>
									</div>
								</section>
							</div>
						</details>
						<section className={styles.caseList} aria-label={t.manageTitle}>
							{summary.cases.length ? (
								summary.cases.map(item => (
									<article
										id={`photo-case-${item.id}`}
										className={`${styles.caseCard} ${highlightCaseId === item.id ? styles.highlightCase : ""}`}
										key={item.id}
									>
										<div className={styles.casePreview}>
											<img
												src={displayUrl(item.previewUrl)}
												alt=""
												loading="lazy"
												decoding="async"
											/>
										</div>
										<div className={styles.caseContent}>
											<div className={styles.caseTop}>
												<span className={styles.caseId}>#{item.id.slice(0, 8)}</span>
												<span
													className={
														item.status === "pending"
															? styles.statusPending
															: styles.statusClosed
													}
												>
													{item.status}
												</span>
											</div>
											<h2>{item.filename}</h2>
											<p>
												{photoLabel(item.category, language)} ·{" "}
												{new Date(item.createdAt).toLocaleDateString(
													language === "fr" ? "fr-CA" : "en-CA",
												)}
											</p>
											<p className={styles.caseReason}>{item.explanation}</p>
											<dl>
												<dt>{t.requester}</dt>
												<dd>{item.requesterEmail}</dd>
												<dt>{t.status}</dt>
												<dd>{item.photoStatus}</dd>
											</dl>
											<div className={styles.caseActions}>
												<button
													className={styles.outlineButton}
													onClick={() => void viewRights(item)}
												>
													{rights.button}
												</button>
												{item.status === "pending" && (
													<>
														<button
															className={styles.outlineButton}
															onClick={() => {
																setActiveCase(item);
																setAction("dismiss");
															}}
														>
															{t.dismiss}
														</button>
														<button
															className={styles.button}
															onClick={() => {
																setActiveCase(item);
																setAction("withdraw");
															}}
														>
															{t.withdraw}
														</button>
														<button
															className={styles.textButton}
															onClick={() => {
																setActiveCase(item);
																setAction("duplicate");
															}}
														>
															{t.duplicate}
														</button>
													</>
												)}
												{item.status !== "pending" && item.photoStatus === "quarantined" && (
													<button
														className={styles.outlineButton}
														onClick={() => {
															setActiveCase(item);
															setAction("restore");
														}}
													>
														{t.restore}
													</button>
												)}
											</div>
										</div>
									</article>
								))
							) : (
								<div className={styles.empty}>
									<p>{t.noCases}</p>
								</div>
							)}
						</section>
						{summary.nextCursor && (
							<button
								className={styles.outlineButton}
								disabled={summaryLoading}
								onClick={() => void load(summary.nextCursor || undefined)}
							>
								{summaryLoading ? t.loadingMore : t.loadMore}
							</button>
						)}
					</>
				)}
			</main>
			{activeCase && action && (
				<div className={styles.modalBackdrop}>
					<ModalDialog
						onClose={() => {
							setActiveCase(null);
							setAction(null);
						}}
						labelledBy="action-title"
					>
						<button
							className={styles.dialogClose}
							onClick={() => setActiveCase(null)}
							aria-label={t.cancel}
						>
							×
						</button>
						<h2 id="action-title">
							{action === "restore"
								? t.restore
								: action === "withdraw"
									? t.withdraw
									: action === "duplicate"
										? t.duplicate
										: t.dismiss}
						</h2>
						<label htmlFor="action-reason">{action === "restore" ? t.restoreReason : t.reason}</label>
						<textarea
							id="action-reason"
							value={reason}
							onChange={event => setReason(event.target.value)}
							rows={4}
							required
						/>
						{(action === "withdraw" || action === "restore") && (
							<label className={styles.checkbox}>
								<input
									type="checkbox"
									checked={crossChannelReviewed}
									onChange={event => setCrossChannelReviewed(event.target.checked)}
								/>
								{t.crossChannel}
							</label>
						)}
						<div className={styles.dialogActions}>
							<button
								className={styles.button}
								disabled={busy || !reason.trim()}
								onClick={() => void saveAction()}
							>
								{busy ? t.processing : t.confirm}
							</button>
							<button className={styles.textButton} onClick={() => setActiveCase(null)}>
								{t.cancel}
							</button>
						</div>
					</ModalDialog>
				</div>
			)}
			{rightsPhoto && (
				<div className={styles.modalBackdrop}>
					<ModalDialog onClose={() => setRightsPhoto(null)} labelledBy="rights-title">
						<button
							className={styles.dialogClose}
							onClick={() => setRightsPhoto(null)}
							aria-label={t.cancel}
						>
							×
						</button>
						<h2 id="rights-title">{rights.title}</h2>
						<p className={styles.muted}>{rightsPhoto.filename}</p>
						<p>{rights.purpose}</p>
						{rightsBusy ? (
							<p aria-live="polite">{t.loading}</p>
						) : rightsRequests?.length ? (
							<ul className={styles.rightsList}>
								{rightsRequests.map(request => (
									<li key={request.requestId}>
										<strong>{request.email}</strong>
										<span>
											{rights.format}: {request.format}
										</span>
										<time dateTime={new Date(request.createdAt).toISOString()}>
											{rights.requested}:{" "}
											{new Date(request.createdAt).toLocaleString(
												language === "fr" ? "fr-CA" : "en-CA",
											)}
										</time>
										<small>
											{rights.requestId}: {request.requestId}
										</small>
									</li>
								))}
							</ul>
						) : (
							<p>{rights.empty}</p>
						)}
						{rightsNextCursor && rightsPhoto && (
							<button
								className={styles.outlineButton}
								disabled={rightsBusy}
								onClick={() => void viewRights(rightsPhoto, rightsNextCursor)}
							>
								{rightsBusy ? rights.loadingMore : rights.loadMore}
							</button>
						)}
						<p className={styles.muted}>{rights.audit}</p>
					</ModalDialog>
				</div>
			)}
		</Shell>
	);
}
