import ThemeSwitch from '../ToggleTheme';
import CreateUser from '../CreateUser';
import Login from '../Login';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '../ui/alert-dialog';
import { LogOut, UserX } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface User {
	id: string;
	name: string;
	email: string;
	token: string;
}

function Header() {
	const [user, setUser] = useState<User | null>(null);
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async () => {
			if (!user) throw new Error('Usuário não encontrado');
			await axios.delete(
				`https://to-do-list-u0q3.onrender.com/users/${user.id}`,
				{
					headers: { Authorization: `Bearer ${user.token}` },
				},
			);
		},
		onSuccess: () => {
			toast.success('Usuário excluído com sucesso!');
			handleLogout();
		},
		onError: () => {
			toast.error('Erro ao excluir usuário. Tente novamente.');
		},
	});

	const { data: userData } = useQuery({
		queryKey: ['user'],
		queryFn: async () => {
			return queryClient.getQueryData<User>(['user']) || null;
		},
	});

	useEffect(() => {
		setUser(userData ?? null);
	}, [userData]);

	const handleLogout = () => {
		queryClient.removeQueries({ queryKey: ['user'] });
		setUser(null);
	};

	const handleExcludUser = () => {
		mutation.mutate();
	};

	return (
		<header className="bg-secondary-blue text-dark-text dark:text-light-text dark:bg-medium-blue h-28 flex justify-around items-center">
			<div>
				<h1 className="text-5xl">
					{user ? `Olá ${user.name}` : 'Cadastre-se primeiro'}
				</h1>
			</div>
			<div>
				<nav className="flex justify-between items-stretch gap-2">
					<ul className="flex items-center gap-2">
						{user ? (
							<>
								<li className="flex items-center">
									<AlertDialog>
										<AlertDialogTrigger>
											<button
												type="button"
												className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
											>
												<LogOut className="w-6 h-6" />
											</button>
										</AlertDialogTrigger>
										<AlertDialogContent className="bg-white text-gray-900 border border-gray-200 dark:bg-dark-blue dark:text-light-text dark:border-gray-700">
											<AlertDialogHeader>
												<AlertDialogTitle className="text-lg font-semibold">
													Você deseja se desconectar?
												</AlertDialogTitle>
												<AlertDialogDescription className="text-gray-600 dark:text-gray-300">
													Ao confirmar, você irá se desconectar de sua conta.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel className="bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-light-text dark:hover:bg-gray-600">
													Cancelar
												</AlertDialogCancel>
												<AlertDialogAction
													onClick={handleLogout}
													className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
												>
													Continuar
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</li>
								<li className="flex items-center">
									<AlertDialog>
										<AlertDialogTrigger>
											<button
												type="button"
												className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
											>
												<UserX className="w-6 h-6" />
											</button>
										</AlertDialogTrigger>
										<AlertDialogContent className="bg-white text-gray-900 border border-gray-200 dark:bg-dark-blue dark:text-light-text dark:border-gray-700">
											<AlertDialogHeader>
												<AlertDialogTitle className="text-lg font-semibold">
													Você deseja excluir sua conta?
												</AlertDialogTitle>
												<AlertDialogDescription className="text-gray-600 dark:text-gray-300">
													Ao confirmar, você irá excluir sua conta
													permanentemente.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel className="bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-light-text dark:hover:bg-gray-600">
													Cancelar
												</AlertDialogCancel>
												<AlertDialogAction
													onClick={handleExcludUser}
													className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
												>
													Excluir
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</li>
							</>
						) : (
							<>
								<li className="flex items-stretch">
									<CreateUser />
								</li>
								<li className="flex items-stretch">
									<Login />
								</li>
							</>
						)}
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
