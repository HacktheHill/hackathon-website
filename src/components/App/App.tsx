// Must run before any FontAwesome icon renders — disables the runtime CSS
// injection that causes the giant icon flash on load.
import "@/fontawesome";
import Navigation from "../Navigation/Navigation";
import Hero from "../Hero/Hero";
import Landing2026 from "../Landing2026/Landing2026";
import "@/global.css";

function App() {
	return (
		<>
			<Navigation />
			<Hero />
			<Landing2026 />
		</>
	);
}

export default App;
