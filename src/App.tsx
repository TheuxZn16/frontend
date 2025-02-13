import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

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
			<main>
				{user ? (
					<>
						<div>
							<h1>Aqui estão suas tarefas</h1>
						</div>
						<div>
							<button type="button">Criar nova tarefa</button>
						</div>
					</>
				) : (
					<div>
						<h1>Please sign in to continue</h1>
					</div>
				)}
			</main>
		</div>
	);
}

export default App;
