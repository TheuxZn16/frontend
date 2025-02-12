import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { LogIn } from 'lucide-react';
import { useState, type FormEvent } from 'react';

function Login() {
	const [dialogState, setDialogState] = useState(false);

	function handleUserCreateSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		console.log('Creating user:', { name, email, password });

		setDialogState(false);

		e.currentTarget.reset();
	}

	return (
		<>
			<Dialog open={dialogState} onOpenChange={setDialogState}>
				<DialogTrigger asChild>
					<button
						type="button"
						className="h-full flex items-center justify-center px-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
					>
						<LogIn className="w-5 h-5" />
					</button>
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

					<form className="mt-4 space-y-4" onSubmit={handleUserCreateSubmit}>
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-dark-text dark:text-light-text"
							>
								Email
							</label>
							<input
								type="email"
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
						>
							Entrar
						</button>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}

export default Login;
