import { t } from "@/i18n";
import styles from "./FourOFour.module.css";
import beaver from "@/assets/assets/beaver404.png?url";
import "@/global.css";

function FourOFour() {
	return (
		<main id="four-o-four" className={styles["four-o-four"]}>
			<div className={styles["content-404"]}>
				<div className={styles["text-404"]}>
					<h1>404</h1>
					<h2>{t("four-o-four.title")}</h2>
					<p>{t("four-o-four.description")}</p>
					<a href="/">{t("four-o-four.button")}</a>
				</div>
				<div className={styles["image-404"]}>
					<img src={beaver} alt={t("four-o-four.image_alt")} width="540" height="350" />
				</div>
			</div>
		</main>
	);
}

export default FourOFour;
