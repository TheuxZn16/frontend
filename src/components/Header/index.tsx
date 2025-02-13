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
		toast.success('Você foi desconectado');
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
			<nav className="flex items-center">
				<ul className="flex items-center gap-2">
					{user ? (
						<>
							<li>
								<AlertDialog>
									<AlertDialogTrigger className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
										<LogOut className="w-6 h-6" />
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Você deseja se desconectar?
											</AlertDialogTitle>
											<AlertDialogDescription>
												Ao confirmar, você irá se desconectar de sua conta.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancelar</AlertDialogCancel>
											<AlertDialogAction
												onClick={handleLogout}
												className="bg-red-500 hover:bg-red-600"
											>
												Continuar
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</li>
							<li>
								<AlertDialog>
									<AlertDialogTrigger className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
										<UserX className="w-6 h-6" />
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Você deseja excluir sua conta?
											</AlertDialogTitle>
											<AlertDialogDescription>
												Ao confirmar, você irá excluir sua conta
												permanentemente.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancelar</AlertDialogCancel>
											<AlertDialogAction
												onClick={handleExcludUser}
												className="bg-red-500 hover:bg-red-600"
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
							<CreateUser />
							<Login />
						</>
					)}
					<li>
						<ThemeSwitch />
					</li>
				</ul>
			</nav>
		</header>
	);
}

export default Header;
