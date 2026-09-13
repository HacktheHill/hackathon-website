import en from "../locales/en";
import fr from "../locales/fr";

type TranslationShape<T> = { [K in keyof T]: T[K] extends string ? string : TranslationShape<T[K]> };
type Messages = TranslationShape<typeof en>;

const messages = { en, fr } satisfies Record<string, Messages>;
export type Locale = keyof typeof messages;

type MessagePath<T> = {
	[K in keyof T & string]: T[K] extends string ? K : `${K}.${MessagePath<T[K]>}`;
}[keyof T & string];
export type TranslationKey = MessagePath<Messages>;
export type Translate = (key: TranslationKey) => string;

/** A pure lookup, also usable outside React. Both locales must have the same keys. */
export function translate(language: Locale, key: TranslationKey): string {
	let value: unknown = messages[language];
	for (const segment of key.split(".")) {
		value = (value as Record<string, unknown>)[segment];
	}
	return value as string;
}
