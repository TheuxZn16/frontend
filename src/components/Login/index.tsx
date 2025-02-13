import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { type AxiosResponse, type AxiosError } from 'axios';
import { LogIn } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { toast, Zoom } from 'react-toastify';
import { z } from 'zod';
import LoadingSpinner from '../Loading';

interface userLogin {
	email: string;
	password: string;
}

interface ApiErrorResponse {
	errors?: string[];
}

interface ApiSuccessResponse {
	user?: {
		email: string;
		id: string;
		name: string;
		token: string;
	};
}

function Login() {
	const queryClient = useQueryClient();
	const [dialogState, setDialogState] = useState(false);

	const loginSchema = z.object({
		email: z.string().email({
			message: 'O e-mail deve ser válido.',
		}),
		password: z
			.string()
			.min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
	});

	const mutation = useMutation({
		mutationFn: (userLogin: userLogin) =>
			axios.post('https://to-do-list-u0q3.onrender.com/token', userLogin),
		onSuccess: (response: AxiosResponse<ApiSuccessResponse>) => {
			const user = response.data;
			if (user.user) {
				toast.success('Login realizado com sucesso!');
				queryClient.setQueryData(['user'], user.user);
				setDialogState(false);
			} else {
				toast.error('Erro ao entrar', {
					transition: Zoom,
				});
			}
		},
		onError: (error: AxiosError<ApiErrorResponse>) => {
			const errors = error.response?.data?.errors;

			if (errors) {
				errors.map((err) => toast.error(err));
			} else {
				toast.error('Ocorreu um erro ao tentar entrar');
			}
		},
	});

	function handleUserCreateSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const userLogin = { email, password };

		const userLoginIsValid = loginSchema.safeParse(userLogin);

		if (!userLoginIsValid.success) {
			userLoginIsValid.error.issues.map((error) => {
				toast.error(error.message, {
					transition: Zoom,
				});
			});
			return;
		}

		mutation.mutate(userLogin);

		e.currentTarget.reset();
	}

	return (
		<>
			<li className="flex justify-center items-center w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
				<Dialog open={dialogState} onOpenChange={setDialogState}>
					<DialogTrigger>
						<LogIn className="w-6 h-6" />
					</DialogTrigger>

					<DialogContent className="bg-white dark:bg-dark-blue p-6 rounded-lg shadow-lg">
						<DialogHeader>
							<DialogTitle className="text-xl font-bold text-dark-text dark:text-light-text">
								Entrar
							</DialogTitle>
							<DialogDescription>
								Preencha os campos abaixo para entrar em sua conta.
							</DialogDescription>
						</DialogHeader>

						{mutation.isPending ? (
							<LoadingSpinner />
						) : (
							<form
								className="mt-4 space-y-4"
								onSubmit={handleUserCreateSubmit}
							>
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
									{mutation.isPending ? 'Entrando...' : 'Entrar'}
								</button>
							</form>
						)}
					</DialogContent>
				</Dialog>
			</li>
		</>
	);
}

export default Login;
