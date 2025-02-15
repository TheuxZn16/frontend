import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import LoadingSpinner from '../Loading';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar as CalendarIcon, Edit } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { type AxiosError } from 'axios';
import { Input } from '../ui/input';

const FormSchema = z.object({
	title: z.string().min(1, { message: 'O título é obrigatório.' }),
	description: z.string().min(1, { message: 'A descrição é obrigatória.' }),
	dueDate: z.date(),
});

interface ApiErrorResponse {
	errors?: string[];
}

interface userCache {
	email: string;
	id: string;
	name: string;
	token: string;
}

interface Task {
	id: string;
	title: string;
	description: string;
	dueDate: Date;
}

function EditTask({ task }: { task: Task }) {
	const [dialogState, setDialogState] = useState(false);
	const queryClient = useQueryClient();

	const user = queryClient.getQueryData<userCache>(['user']);

	if (!user) return toast.error('Primeiro faça login');
	if (!task) return toast.error('Task não enviada');

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			title: '',
			description: '',
			dueDate: new Date(),
		},
	});

	useEffect(() => {
		if (task) {
			form.reset({
				title: task.title,
				description: task.description,
				dueDate: new Date(task.dueDate),
			});
		}
	}, [task, form]);

	const mutation = useMutation({
		mutationFn: async (updatedTask: z.infer<typeof FormSchema>) => {
			return axios.put(
				`https://to-do-list-u0q3.onrender.com/tasks/${task.id}`,
				updatedTask,
				{
					headers: { Authorization: `Bearer ${user.token}` },
				},
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] });
			form.reset();
			setDialogState(false);
			toast.success('Tarefa editada com sucesso!');
		},
		onError: (error: AxiosError<ApiErrorResponse>) => {
			const errors = error.response?.data?.errors;
			if (errors) {
				errors.map((err) => toast.error(err));
			} else {
				toast.error('Erro ao editar a tarefa.');
			}
		},
	});

	function onSubmit(values: z.infer<typeof FormSchema>) {
		const updatedTask = {
			title: values.title,
			description: values.description,
			dueDate: values.dueDate,
		};
		mutation.mutate(updatedTask);
	}

	return (
		<li className="flex justify-center items-center">
			<Dialog open={dialogState} onOpenChange={setDialogState}>
				<DialogTrigger asChild>
					<button type="button">
						<Edit />
					</button>
				</DialogTrigger>

				<DialogContent className="bg-white dark:bg-dark-blue p-6 rounded-lg shadow-lg w-[400px]">
					<DialogHeader>
						<DialogTitle className="text-xl font-bold text-dark-text dark:text-light-text">
							Editar tarefa
						</DialogTitle>
						<DialogDescription>
							Preencha os campos abaixo para editar a tarefa.
						</DialogDescription>
					</DialogHeader>

					{mutation.isPending ? (
						<LoadingSpinner />
					) : (
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Nome da tarefa</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="Digite o nome da tarefa"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Descrição da tarefa</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="Digite uma descrição para a tarefa"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="dueDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Data limite</FormLabel>
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button variant="outline" className="w-full">
															{field.value
																? format(field.value, 'dd/MM/yyyy')
																: 'Selecione uma data'}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent>
													<Calendar
														mode="single"
														selected={field.value}
														onSelect={field.onChange}
													/>
												</PopoverContent>
											</Popover>
										</FormItem>
									)}
								/>
								<Button type="submit">Salvar</Button>
							</form>
						</Form>
					)}
				</DialogContent>
			</Dialog>
		</li>
	);
}

export default EditTask;
