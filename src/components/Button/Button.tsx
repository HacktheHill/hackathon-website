import type { ButtonHTMLAttributes, HTMLAttributeAnchorTarget, ReactNode } from "react";
import { Link } from "react-scroll";
import styles from "./Button.module.css";

type InnerButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	children: ReactNode;
};

type ButtonProps = InnerButtonProps & {
	href?: string;
	target?: HTMLAttributeAnchorTarget;
	offset?: number;
};

function InnerButton({ children, ...rest }: InnerButtonProps) {
	return <button {...rest}>{children}</button>;
}

export default function Button({ children, href, target, offset = 0, ...rest }: ButtonProps) {
	if (href?.startsWith("#")) {
		return (
			<Link className={styles.button} to={href.slice(1)} smooth={true} offset={offset} duration={500} href={href}>
				<InnerButton {...rest}>{children}</InnerButton>
			</Link>
		);
	} else if (href) {
		return (
			<a href={href} target={target} rel={target === "_blank" ? "noreferrer" : ""} className={styles.button}>
				<InnerButton {...rest}>{children}</InnerButton>
			</a>
		);
	} else {
		return (
			<InnerButton className={styles.button} {...rest}>
				{children}
			</InnerButton>
		);
	}
}
