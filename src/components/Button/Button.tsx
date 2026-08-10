import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
	children: ReactNode;
	href: string;
};

type NativeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	children: ReactNode;
	href?: never;
};

type ButtonProps = LinkButtonProps | NativeButtonProps;

const getClassName = (className?: string) => (className ? `${styles.button} ${className}` : styles.button);
const isLinkButton = (props: ButtonProps): props is LinkButtonProps => typeof props.href === "string";

export default function Button(props: ButtonProps) {
	if (isLinkButton(props)) {
		const { children, className, href, target, ...rest } = props;
		const buttonClassName = getClassName(className);

		return (
			<a
				{...rest}
				href={href}
				target={target}
				rel={target === "_blank" ? "noreferrer" : rest.rel}
				className={buttonClassName}
			>
				{children}
			</a>
		);
	}

	const { children, className, type = "button", ...rest } = props;
	return (
		<button {...rest} type={type} className={getClassName(className)}>
			{children}
		</button>
	);
}
