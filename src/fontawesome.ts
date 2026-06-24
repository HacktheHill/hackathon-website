// FontAwesome renders inline SVGs and, by default, injects its sizing CSS at
// runtime while the app hydrates. Until that CSS lands, the server-rendered
// icons paint at full intrinsic size in the default link colour — the giant
// blue icon flash. Import the stylesheet up front (so it ships in the <head>
// before first paint) and turn the runtime injection off.
//
// Import this once, before any FontAwesome icon renders (see App.tsx).
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;
