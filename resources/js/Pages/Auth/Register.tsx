import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function Register() {
	const { data, setData, post, processing, errors, reset } = useForm({
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		password_confirmation: "",
	});

	const submit: FormEventHandler = (e) => {
		e.preventDefault();

		post(route("register"), {
			onFinish: () => reset("password", "password_confirmation"),
		});
	};

	return (
		<GuestLayout>
			<Head title="Register" />

			<form onSubmit={submit}>
				<div>
					<label className="label" htmlFor="first_name">Name</label>

					<input
						id="first_name"
						type="text"
						name="first_name"
						value={data.first_name}
						className="mt-1 input input-bordered w-full"
						autoComplete="first_name"
						autoFocus={true}
						onChange={(e) => setData("first_name", e.target.value)}
						required
					/>

					{
						errors.first_name && (
							<label className="text-error">{errors.first_name}</label>
						)
					}
				</div>

				<div className="mt-4">
					<label className="label" htmlFor="last_name">Last Name</label>

					<input
						id="last_name"
						type="text"
						name="last_name"
						value={data.last_name}
						className="mt-1 input input-bordered w-full"
						autoComplete="last_name"
						onChange={(e) => setData("last_name", e.target.value)}
						required
					/>

					{
						errors.last_name && (
							<label className="text-error">{errors.last_name}</label>
						)
					}
				</div>

				<div className="mt-4">
					<label className="label" htmlFor="email">Email</label>

					<input
						id="email"
						type="email"
						name="email"
						value={data.email}
						className="mt-1 input input-bordered w-full"
						autoComplete="username"
						onChange={(e) => setData("email", e.target.value)}
						required
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
						autoComplete="new-password"
						onChange={(e) => setData("password", e.target.value)}
						required
					/>

					{
						errors.password && (
							<label className="text-error">{errors.password}</label>
						)
					}
				</div>

				<div className="mt-4">
					<label className="label" htmlFor="password_confirmation">Password Confirmation</label>

					<input
						id="password_confirmation"
						type="password"
						name="password_confirmation"
						value={data.password_confirmation}
						className="mt-1 input input-bordered w-full"
						autoComplete="new-password"
						onChange={(e) => setData("password_confirmation", e.target.value)}
						required
					/>

					{
						errors.password_confirmation && (
							<label className="text-error">{errors.password_confirmation}</label>
						)
					}
				</div>

				<div className="mt-4 flex items-center justify-end">
					<Link
						href={route("login")}
						className="link"
					>
						Already registered?
					</Link>

					<button className="ms-4 btn btn-primary" disabled={processing}>
						Register
					</button>
				</div>
			</form>
		</GuestLayout>
	);
}
