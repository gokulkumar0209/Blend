/** @type {import('tailwindcss').Config} */
import { heroui } from "@heroui/react";
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
	],

	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: "#1DA1F2", // Twitter blue (light mode default)
					dark: "#1A91DA", // Dark mode Twitter blue
				},
				secondary: {
					DEFAULT: "#657786", // Muted gray for secondary (light mode default)
					dark: "#AAB8C2", // Lighter gray for secondary in dark mode
				},
				success: {
					DEFAULT: "#17BF63", // Green for success (light mode default)
					dark: "#1A9A51", // Dark green for success in dark mode
				},
				danger: {
					DEFAULT: "#E0245E", // Red for danger (light mode default)
					dark: "#D6003A", // Dark red for danger in dark mode
				},
				warning: {
					DEFAULT: "#F45D22", // Orange for warning (light mode default)
					dark: "#F57C00", // Dark orange for warning in dark mode
				},
				background: {
					DEFAULT: "#FFFFFF", // Light background color (light mode default)
					dark: "#15202B", // Dark background for dark mode
				},
				text: {
					DEFAULT: "#14171A", // Dark text color for light mode
					dark: "#FFFFFF", // Light text color for dark mode
				},
			},
		},
	},
	darkMode: "class", // or 'media' or 'class'
	plugins: [heroui()],
};
