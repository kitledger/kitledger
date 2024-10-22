import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { error } from "console";
import { FormEventHandler } from "react";

export default function Login({
	status,
	canResetPassword,
}: {
	status?: string;
	canResetPassword: boolean;
}) {
	const { data, setData, post, processing, errors, reset } = useForm({
		email: "",
		password: "",
		remember: false,
	});

	const submit: FormEventHandler = (e) => {
		e.preventDefault();

		post(route("login"), {
			onFinish: () => reset("password"),
		});
	};

	return (
		<GuestLayout>
			<Head title="Log in" />

			{status && (
				<div className="mb-4 text-sm font-medium text-primary">{status}</div>
			)}

			<form onSubmit={submit}>
				<div>
					<label className="label" htmlFor="email">Email</label>

					<input
						id="email"
						type="email"
						name="email"
						value={data.email}
						className="mt-1 input input-bordered w-full"
						autoComplete="username"
						autoFocus={true}
						onChange={(e) => setData("email", e.target.value)}
					/>
					{
						errors.email && (
						<label className="text-error">{errors.email}</label>
						)
					}
				</div>

				<div className="mt-4">
					<label className="label" htmlFor="password">Password</label>

					<input
						id="password"
						type="password"
						name="password"
						value={data.password}
						className="mt-1 input input-bordered w-full"
						autoComplete="current-password"
						onChange={(e) => setData("password", e.target.value)}
					/>

					{
						errors.password && (
						<label className="text-error">{errors.password}</label>
						)
					}
				</div>

				<div className="mt-4 block">
					<label className="flex items-center">
						<input
							type="checkbox"
							name="remember"
							defaultChecked={data.remember}
							onChange={(e) => setData("remember", e.target.checked)}
							className="checkbox"
						/>
						<span className="ms-2 text-sm text-gray-600">Remember me</span>
					</label>
				</div>

				<div className="mt-4 flex items-center justify-end">
					{canResetPassword && (
						<Link
							href={route("password.request")}
							className="link"
						>
							Forgot your password?
						</Link>
					)}

					<button className="ms-4 btn btn-primary" disabled={processing}>
						Log in
					</button>
				</div>
			</form>
		</GuestLayout>
	);
}
