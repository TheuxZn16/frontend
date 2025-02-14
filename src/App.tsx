import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import CreateTask from './components/CreateTask';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from './components/ui/table';
import axios from 'axios';
import { Check, Edit, X } from 'lucide-react';
import { Toggle } from './components/ui/toggle';
import ExcludTaskAlert from './components/ExcludTaskAlert';

interface User {
	id: string;
	name: string;
	email: string;
	token: string;
}

interface Task {
	description: string;
	dueDate: Date;
	id: string;
	isCompleted: boolean;
	title: string;
	userId: string;
}

function App() {
	const [user, setUser] = useState<User | null>(null);
	const [tasks, setTasks] = useState<Task[]>([]);
	const queryClient = useQueryClient();

	const { data: userData } = useQuery({
		queryKey: ['user'],
		queryFn: async () => {
			return queryClient.getQueryData<User>(['user']) || null;
		},
	});

	const { data: tasksData } = useQuery({
		queryKey: ['tasks'],
		queryFn: async () => {
			if (!user) return null;
			const response = await axios.get(
				'https://to-do-list-u0q3.onrender.com/tasks',
				{
					headers: { Authorization: `Bearer ${user.token}` },
				},
			);
			return response.data;
		},
		enabled: !!user,
	});

	useEffect(() => {
		setUser(userData || null);
	}, [userData]);

	useEffect(() => {
		if (tasksData) {
			setTasks(tasksData);
		}
	}, [tasksData]);

	return (
		<div>
			<ToastContainer position="top-right" autoClose={2000} theme="colored" />
			<Header />
			<main className="flex justify-center pt-8">
				{user ? (
					<div className="w-1/2 bg-light-gray dark:bg-medium-blue p-6 rounded-lg shadow-lg">
						<div className="flex justify-between items-center">
							<h1 className="text-3xl text-dark-text dark:text-light-text">
								Aqui estão suas tarefas:
							</h1>
							<CreateTask />
						</div>

						<div className="p-5 mt-10">
							{tasks.length > 0 ? (
								<Table>
									<TableCaption>Tarefas</TableCaption>
									<TableHeader>
										<TableRow>
											<TableHead>Tarefa</TableHead>
											<TableHead>Descrição</TableHead>
											<TableHead>Data de vencimento</TableHead>
											<TableHead>Concluída?</TableHead>
											<TableHead>Editar</TableHead>
											<TableHead>Excluir</TableHead>
											<TableHead>Marcar</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{tasks.map((task) => (
											<TableRow key={task.id}>
												<TableCell>{task.title}</TableCell>
												<TableCell>{task.description}</TableCell>
												<TableCell>
													{new Date(task.dueDate).toLocaleDateString()}
												</TableCell>
												<TableCell>
													{task.isCompleted ? 'Sim' : 'Não'}
												</TableCell>
												<TableCell>
													<button type="button">
														<Edit />
													</button>
												</TableCell>
												<TableCell>
													<ExcludTaskAlert idTask={task.id} />
												</TableCell>
												<TableCell>
													<Toggle>
														{task.isCompleted ? (
															<X className="text-red-800" />
														) : (
															<Check className="text-green-700" />
														)}
													</Toggle>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							) : (
								<p className="text-center text-dark-text dark:text-light-text">
									Você ainda não possui nenhuma tarefa. Crie agora!
								</p>
							)}
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
