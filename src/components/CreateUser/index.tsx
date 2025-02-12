import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { useMutation } from '@tanstack/react-query';
import { UserPlus } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { toast, ToastContainer, Zoom } from 'react-toastify';
import axios, { type AxiosError } from 'axios';
import * as z from 'zod';
import LoadingSpinner from '../Loading';

interface NewUser {
	name: string;
	email: string;
	password: string;
}

interface ApiErrorResponse {
	errors?: string[];
}

const userSchema = z.object({
	name: z
		.string()
		.min(3, {
			message: 'O nome de usuário deve ter pelo menos 3 caracteres.',
		})
		.max(20, {
			message: 'O nome de usuário deve ter no máximo 20 caracteres.',
		}),
	email: z.string().email({
		message: 'O e-mail deve ser válido.',
	}),
	password: z
		.string()
		.min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
});

function CreateUser() {
	const [dialogState, setDialogState] = useState(false);

	const mutation = useMutation({
		mutationFn: (newUser: NewUser) =>
			axios.post('https://to-do-list-u0q3.onrender.com/users', newUser),
		onSuccess: () => {
			setDialogState(false);
			toast.success('Usuário criado com sucesso!');
		},
		onError: (error: AxiosError<ApiErrorResponse>) => {
			const errors = error.response?.data?.errors;

			if (errors) {
				errors.map((err) => toast.error(`${err}: email já cadastrado`));
			} else {
				toast.error('Ocorreu um erro ao tentar cadastrar o usuário.');
			}
		},
	});

	function handleUserCreateSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const newUser = { name, email, password };

		const validationResult = userSchema.safeParse(newUser);

		if (!validationResult.success) {
			validationResult.error.issues.map((issue) => {
				toast.error(issue.message, {
					transition: Zoom,
				});
			});
			return;
		}

		mutation.mutate(newUser);
		e.currentTarget.reset();
	}

	return (
		<>
			<ToastContainer position="top-right" autoClose={2000} theme="colored" />
			<Dialog open={dialogState} onOpenChange={setDialogState}>
				<DialogTrigger asChild>
					<button
						type="button"
						className="h-full flex items-center justify-center px-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
					>
						<UserPlus className="w-5 h-5" />
					</button>
				</DialogTrigger>

				<DialogContent className="bg-white dark:bg-dark-blue p-6 rounded-lg shadow-lg">
					<DialogHeader>
						<DialogTitle className="text-xl font-bold text-dark-text dark:text-light-text">
							Criar Novo Usuário
						</DialogTitle>
						<DialogDescription>
							Preencha os campos abaixo para criar um novo usuário.
						</DialogDescription>
					</DialogHeader>

					{mutation.isPending ? (
						<LoadingSpinner />
					) : (
						<form className="mt-4 space-y-4" onSubmit={handleUserCreateSubmit}>
							<div>
								<label
									htmlFor="name"
									className="block text-sm font-medium text-dark-text dark:text-light-text"
								>
									Nome
								</label>
								<input
									type="text"
									id="name"
									name="name"
									className="w-full px-3 py-2 border rounded-lg bg-light-gray dark:bg-medium-blue text-dark-text dark:text-light-text"
									placeholder="Digite o nome"
								/>
							</div>

							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-dark-text dark:text-light-text"
								>
									Email
								</label>
								<input
									type="text"
									name="email"
									id="email"
									className="w-full px-3 py-2 border rounded-lg bg-light-gray dark:bg-medium-blue text-dark-text dark:text-light-text"
									placeholder="Digite o email"
								/>
							</div>

							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-dark-text dark:text-light-text"
								>
									Senha
								</label>
								<input
									type="password"
									id="password"
									name="password"
									className="w-full px-3 py-2 border rounded-lg bg-light-gray dark:bg-medium-blue text-dark-text dark:text-light-text"
									placeholder="Digite a senha"
								/>
							</div>

							<button
								type="submit"
								className="w-full bg-primary-blue text-white py-2 rounded-lg hover:bg-secondary-blue transition-colors"
								disabled={mutation.isPending}
							>
								{mutation.isPending ? 'Criando...' : 'Criar Usuário'}
							</button>
						</form>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}

export default CreateUser;
