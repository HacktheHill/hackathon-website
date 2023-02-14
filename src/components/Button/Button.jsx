import React from "react";
import "./Button.css";
function InnerButton({ children, ...rest }) {
	return <button {...rest}>{children}</button>;
}

export default function Button({ children, href, target, ...rest }) {
	return href ? (
		<a href={href} target={target} referrer={target === "_blank" ? "noreferrer" : ""} className="button">
			<InnerButton {...rest}>{children}</InnerButton>
		</a>
	) : (
		<InnerButton {...rest}>{children}</InnerButton>
	);
}
