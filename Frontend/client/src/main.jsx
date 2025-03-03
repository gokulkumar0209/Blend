import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { HeroUIProvider } from "@heroui/react";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<HeroUIProvider>
			<main className="dark">
				<App />
			</main>
		</HeroUIProvider>
	</StrictMode>
);
