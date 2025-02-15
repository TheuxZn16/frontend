import { toast, ToastContainer } from 'react-toastify';
import Header from './components/Header';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { Check, X } from 'lucide-react';
import { Toggle } from './components/ui/toggle';
import ExcludTaskAlert from './components/ExcludTaskAlert/index';
import LoadingSpinner from './components/Loading';
import EditTask from './components/EditTask';

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
	const queryClient = useQueryClient();
	const [user, setUser] = useState<User | null>(null);

	const { data: userData } = useQuery({
		queryKey: ['user'],
		queryFn: async () => {
			return queryClient.getQueryData<User>(['user']) || null;
		},
	});

	useEffect(() => {
		setUser(userData || null);
	}, [userData]);

	const { data: tasks = [], isLoading } = useQuery<Task[]>({
		queryKey: ['tasks'],
		queryFn: async () => {
			if (!user) return [];
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

	const { mutate: toggleTaskCompletion } = useMutation({
		mutationKey: ['tasks'],
		mutationFn: async (task: Task) => {
			if (!user) throw new Error('Usuário não encontrado');
			await axios.patch(
				`https://to-do-list-u0q3.onrender.com/tasks/${task.id}`,
				{ isCompleted: !task.isCompleted },
				{
					headers: { Authorization: `Bearer ${user.token}` },
				},
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] });
		},
		onError: () => {
			toast.error('Erro ao atualizar a tarefa.');
		},
	});

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
							{isLoading ? (
								<LoadingSpinner />
							) : tasks.length > 0 ? (
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
													<EditTask task={task} />
												</TableCell>
												<TableCell>
													<ExcludTaskAlert idTask={task.id} />
												</TableCell>
												<TableCell>
													<Toggle onClick={() => toggleTaskCompletion(task)}>
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
								<p>Você ainda não possui nenhuma tarefa. Crie agora!</p>
							)}
						</div>
					</div>
				) : (
					<p>Por favor, entre em sua conta para continuar...</p>
				)}
			</main>
		</div>
	);
}

export default App;
