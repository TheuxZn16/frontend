import ThemeSwitch from '../ToggleTheme';
import CreateUser from '../CreateUser';
import Login from '../Login';

function Header() {
	return (
		<header className="bg-secondary-blue text-dark-text dark:text-light-text dark:bg-medium-blue h-28 flex justify-around items-center">
			<div>
				<h1 className="text-5xl">Olá...</h1>
			</div>
			<div>
				<nav className="flex justify-between items-stretch gap-2">
					<ul className="flex items-stretch">
						<li className="flex items-stretch">
							<CreateUser />
						</li>
						<li className="flex items-stretch">
							<Login />
						</li>
					</ul>
					<div className="flex items-stretch">
						<ThemeSwitch />
					</div>
				</nav>
			</div>
		</header>
	);
}

export default Header;
