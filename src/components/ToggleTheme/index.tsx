import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeSwitch = () => {
	const [isDarkMode, setIsDarkMode] = useState(false);

	// Verifica o tema salvo no localStorage ou o preferido do sistema
	useEffect(() => {
		const savedTheme = localStorage.getItem('theme');
		const prefersDark = window.matchMedia(
			'(prefers-color-scheme: dark)',
		).matches;

		if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
			setIsDarkMode(true);
			document.documentElement.classList.add('dark');
		} else {
			setIsDarkMode(false);
			document.documentElement.classList.remove('dark');
		}
	}, []);

	// Alterna entre os temas e salva no localStorage
	const toggleTheme = () => {
		const newTheme = !isDarkMode;
		setIsDarkMode(newTheme);
		document.documentElement.classList.toggle('dark');
		localStorage.setItem('theme', newTheme ? 'dark' : 'light');
	};

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
			aria-label="Alternar tema"
		>
			{isDarkMode ? (
				<Sun className="w-6 h-6 text-yellow-400" />
			) : (
				<Moon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
			)}
		</button>
	);
};

export default ThemeSwitch;
