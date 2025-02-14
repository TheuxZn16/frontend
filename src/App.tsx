import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import CreateTask from './components/CreateTask';

interface User {
	id: string;
	name: string;
	email: string;
	token: string;
}

function App() {
	const [user, setUser] = useState<User | null>(null);
	const queryClient = useQueryClient();

	const { data: userData } = useQuery({
		queryKey: ['user'],
		queryFn: async () => {
			return queryClient.getQueryData<User>(['user']) || null;
		},
	});

	useEffect(() => {
		setUser(userData || null);
	}, [userData]);

	return (
		<div>
			<ToastContainer position="top-right" autoClose={2000} theme="colored" />
			<Header />
			<main className="flex justify-center pt-8">
				{user ? (
					<div className="flex justify-between items-center w-1/2 bg-light-gray dark:bg-medium-blue p-6 rounded-lg shadow-lg">
						<div>
							<h1 className="text-3xl text-dark-text dark:text-light-text">
								Aqui estão suas tarefas:
							</h1>
						</div>
						<div>
							<CreateTask />
						</div>
					</div>
				) : (
					<div>
						<h1 className="lg:text-6xl text-3xl text-center text-dark-text dark:text-light-text">
							Por favor, entre em sua conta para continuar...
						</h1>
					</div>
				)}
			</main>
		</div>
	);
}

export default App;
