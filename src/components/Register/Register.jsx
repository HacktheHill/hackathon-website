import "./Register.module.css";

// import and run the js file found at embed.typeform.com/next/embed.js
import { useEffect } from "react";

const Register = () => {
	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://embed.typeform.com/next/embed.js";
		script.async = true;
		document.body.appendChild(script);
		return () => {
			document.body.removeChild(script);
		};
	}, []);

	return (
		<div
			id="formwrapper"
			data-tf-widget="" // this is the id of the typeform
			data-tf-inline-on-mobile
			data-tf-hide-headers
			data-tf-medium="snippet"
		></div>
	);
};

export default Register;
