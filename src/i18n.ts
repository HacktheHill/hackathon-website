import { useStore } from "@nanostores/react";
import en from "./locales/en";
import fr from "./locales/fr";

import { atom } from "nanostores";

const i18n = atom({
	en,
	fr,
} as const);
type I18n = ReturnType<typeof i18n.get>;
type Locale = keyof I18n;

const defaultLocale: Locale = "en" as const;
export const locale = atom<Locale>(defaultLocale);

/**
 * Get a translation from the i18n store
 * @param path A dot notation path to the value
 * @returns The value at the path
 */
export function t<P extends Path<I18n[typeof defaultLocale]>>(path: P): PathValue<I18n[typeof defaultLocale], P>;
export function t(path: Path<I18n[typeof defaultLocale]>): any {
	return get(useStore(i18n)[useStore(locale)], path);
}

// https://stackoverflow.com/questions/68411508/typescript-type-safe-string-with-dot-notation-for-query-nested-object
type PathImpl<T, K extends keyof T> = K extends string
	? T[K] extends Record<string, any>
		? T[K] extends ArrayLike<any>
			? K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof any[]>>}`
			: K | `${K}.${PathImpl<T[K], keyof T[K]>}`
		: K
	: never;
type Path<T> = PathImpl<T, keyof T> | keyof T;
type PathValue<T, P extends Path<T>> = P extends `${infer K}.${infer Rest}`
	? K extends keyof T
		? Rest extends Path<T[K]>
			? PathValue<T[K], Rest>
			: never
		: never
	: P extends keyof T
	? T[P]
	: never;

/**
 * Get a value from an object using a path string
 * @param obj An object to get a value from
 * @param path A dot notation path to the value
 * @returns The value at the path
 */
const get = (obj: unknown, path: string): any => {
	let value = obj;

	for (const key of path.split(".")) {
		if (value === null || (typeof value !== "object" && typeof value !== "function")) {
			return undefined;
		}

		value = Reflect.get(value, key);
	}

	return value;
};
