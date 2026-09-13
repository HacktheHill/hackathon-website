import { useStore } from "@nanostores/react";
import { atom } from "nanostores";
import { translate, type Locale, type Translate } from "./translate";

export type { Locale, Translate, TranslationKey } from "./translate";
export { translate } from "./translate";

export const locale = atom<Locale>("en");

/** Subscribe once per component. Calling the returned lookup never calls a hook. */
export function useTranslations(): Translate {
	const language = useStore(locale);
	return key => translate(language, key);
}
