#!/usr/bin/env node

import { execSync } from "child_process";
import prompts from "prompts";
import chalk from "chalk";
import fs from "fs";
import path from "path";

(async () => {
	try {
		console.log(
			chalk.bold.blue(
				"\nWelcome to the Vitify CLI!\n"
			)
		);

		// Prompt to get the project folder name
		const { folderName } =
			await prompts({
				type: "text",
				name: "folderName",
				message:
					"Enter your project folder name:",
				initial: "my-app",
			});

		if (!folderName) {
			console.log(
				chalk.red(
					"\nFolder name is required. Exiting...\n"
				)
			);
			process.exit(1);
		}

		// Check if folder already exists
		const folderPath = path.join(
			process.cwd(),
			folderName
		);
		if (fs.existsSync(folderPath)) {
			console.log(
				chalk.red(
					`\nThe folder ${folderName} already exists. Exiting...\n`
				)
			);
			process.exit(1);
		}

		// Create the folder
		console.log(
			chalk.green(
				`\nCreating project folder: ${folderName}...`
			)
		);
		fs.mkdirSync(folderPath);

		// Move into the created folder
		process.chdir(folderPath);

		// Prompt for project type
		const responses = await prompts([
			{
				type: "select",
				name: "projectType",
				message:
					"Choose a project type:",
				choices: [
					{
						title: "React (JavaScript)",
						value: "react",
					},
					{
						title: "React (TypeScript)",
						value: "react-ts",
					},
				],
			},
			{
				type: "toggle",
				name: "tailwind",
				message: "Add TailwindCSS?",
				initial: true,
				active: "Yes",
				inactive: "No",
			},
			{
				type: "toggle",
				name: "zustand",
				message:
					"Add Zustand for state management?",
				initial: false,
				active: "Yes",
				inactive: "No",
			},
			{
				type: "toggle",
				name: "lucide",
				message:
					"Add Lucide-react (icon library)?",
				initial: false,
				active: "Yes",
				inactive: "No",
			},
			{
				type: "select",
				name: "animation",
				message:
					"Choose an animation library:",
				choices: [
					{
						title: "GSAP",
						value: "gsap",
					},
					{
						title: "Framer Motion",
						value: "framer-motion",
					},
					{
						title: "None",
						value: null,
					},
				],
			},
		]);

		// Handle canceled prompt (exit if user cancels any prompt)
		if (!responses.projectType) {
			console.log(
				chalk.red(
					"\nProject type is required. Exiting...\n"
				)
			);
			process.exit(1);
		}

		// Scaffolding the Vite project
		console.log(
			chalk.green(
				"\nScaffolding your Vite project..."
			)
		);
		const viteCommand =
			responses.projectType === "react"
				? "npm create vite@latest . -- --template react"
				: "npm create vite@latest . -- --template react-ts";

		try {
			execSync(viteCommand, {
				stdio: "inherit",
			});
		} catch (error) {
			console.log(
				chalk.red(
					"\nError scaffolding Vite project. Exiting...\n"
				)
			);
			process.exit(1);
		}

		// Install TailwindCSS
		if (responses.tailwind) {
			console.log(
				chalk.green(
					"\nInstalling TailwindCSS..."
				)
			);
			try {
				execSync(
					"npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init",
					{ stdio: "inherit" }
				);
				
				// Tailwind CSS getComputedStyle
				fs.writeFileSync("src/index.css", "@tailwind base; \n @tailwind components; \n @tailwind utilities;")

				// Tailwind configuration files
				fs.writeFileSync(
					"tailwind.config.js",
					`module.exports = {
            content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
            theme: { extend: {} },
            plugins: [],
          };`
				);

				fs.writeFileSync(
					"postcss.config.js",
					`module.exports = {
            plugins: { tailwindcss: {}, autoprefixer: {} },
          };`
				);

				console.log(
					chalk.green(
						"\nTailwindCSS configuration added."
					)
				);
			} catch (error) {
				console.log(
					chalk.red(
						"\nError installing TailwindCSS. Skipping...\n"
					)
				);
			}
		}

		// Install Zustand
		if (responses.zustand) {
			console.log(
				chalk.green(
					"\nInstalling Zustand..."
				)
			);
			try {
				execSync(
					"npm install zustand",
					{ stdio: "inherit" }
				);
				console.log(
					chalk.green(
						"\nZustand installation completed."
					)
				);
			} catch (error) {
				console.log(
					chalk.red(
						"\nError installing Zustand. Skipping...\n"
					)
				);
			}
		}

		// Install Lucide-react
		if (responses.lucide) {
			console.log(
				chalk.green(
					"\nInstalling Lucide-react..."
				)
			);
			try {
				execSync(
					"npm install lucide-react",
					{ stdio: "inherit" }
				);
				console.log(
					chalk.green(
						"\nLucide-react installation completed."
					)
				);
			} catch (error) {
				console.log(
					chalk.red(
						"\nError installing Lucide-react. Skipping...\n"
					)
				);
			}
		}

		// Install Animation Library
		if (responses.animation) {
			console.log(
				chalk.green(
					`\nInstalling ${responses.animation}...`
				)
			);
			try {
				execSync(
					`npm install ${responses.animation}`,
					{ stdio: "inherit" }
				);
				console.log(
					chalk.green(
						`\n${responses.animation} installation completed.`
					)
				);
			} catch (error) {
				console.log(
					chalk.red(
						`\nError installing ${responses.animation}. Skipping...\n`
					)
				);
			}
		}

		console.log(
			chalk.bold.green(
				"\nProject setup is complete! 🎉"
			)
		);
		console.log(
			chalk.cyan(
				"\nNavigate to your project folder and start coding:\n"
			)
		);
		console.log(
			chalk.bold.magenta(
				`cd ${folderName}`
			)
		);
		console.log(
			chalk.bold.magenta("npm run dev")
		);
	} catch (error) {
		console.log(
			chalk.red(
				"\nAn error occurred. Exiting...\n"
			)
		);
		process.exit(1);
	}
})();
