import { PackageX } from 'lucide-react';
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
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { type AxiosError } from 'axios';

interface DeleteTaskAlertProps {
	idTask: string;
}

interface userCache {
	email: string;
	id: string;
	name: string;
	token: string;
}

interface ApiErrorResponse {
	errors?: string[];
}

function DeleteTaskAlert({ idTask }: DeleteTaskAlertProps) {
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData<userCache>(['user']);

	if (!user) {
		toast.error('Erro: Usuário não autenticado.');
		return null;
	}

	const { mutate, isPending } = useMutation({
		mutationFn: async () => {
			await axios.delete(
				`https://to-do-list-u0q3.onrender.com/tasks/${idTask}`,
				{
					headers: { Authorization: `Bearer ${user.token}` },
				},
			);
		},
		onError: (error: AxiosError<ApiErrorResponse>) => {
			const errors = error.response?.data?.errors;

			if (errors) {
				errors.map((err) => toast.error(err));
			} else {
				toast.error('Ocorreu um erro ao tentar criar uma nova tarefa.');
			}
		},
		onSuccess: () => {
			toast.success('Tarefa excluída com sucesso!');
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] });
		},
	});

	return (
		<AlertDialog>
			<AlertDialogTrigger
				className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
				aria-label="Excluir tarefa"
			>
				<PackageX className="w-6 h-6" />
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Você deseja excluir a tarefa?</AlertDialogTitle>
					<AlertDialogDescription>
						Ao confirmar, você irá excluir essa tarefa permanentemente.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => mutate()}
						className="bg-red-500 hover:bg-red-600 disabled:opacity-50"
						disabled={isPending}
					>
						{isPending ? 'Excluindo...' : 'Excluir'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default DeleteTaskAlert;
