import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";
import { useEffect } from 'react'
import { themeChange } from 'theme-change'

export default function Guest({ children }: PropsWithChildren) {

	useEffect(() => {
		themeChange(false)
		// 👆 false parameter is required for react project
	}, []);

	return (
		<div className="flex min-h-screen flex-col items-cente pt-6 sm:justify-center sm:pt-0 bg-base-300">
			<div>
				<Link href="/">
					<figure className="w-48 h-auto mx-auto">
						<img src="/brand/logo.png" alt="Logo" />
					</figure>
				</Link>
			</div>

			<div className="mt-6 w-full overflow-hidden px-6 py-6 sm:max-w-md mx-auto bg-base-100 shadow">
				{children}
			</div>
		</div>
	);
}
