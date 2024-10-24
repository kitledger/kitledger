import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";
import { useEffect } from 'react';
import { themeChange } from 'theme-change';
import { useTheme } from "@/Utils/Theme";

export default function Guest({ children }: PropsWithChildren) {

	useEffect(() => {
		themeChange(false);
	}, []);

	const theme = useTheme();

	return (

		<div className="flex flex-col lg:flex-row min-h-screen min-w-full">
			<Link href="/" className="py-12 lg:hidden">
				<figure className="w-48 h-auto mx-auto">
					<img src={theme === 'dark' ? '/brand/logo-wt.svg' : '/brand/logo.svg'} alt="Logo" />
				</figure>
			</Link>
			<div className="lg:w-1/2 lg:min-h-screen lg:flex lg:flex-col lg:items-center lg:justify-center">
				<div className="w-full overflow-hidden px-6 py-6 sm:max-w-md mx-auto">
					{children}
				</div>
			</div>
			<div className="hidden lg:flex lg:flex-col lg:w-1/2 lg:min-h-screen lg:items-center lg:justify-center">
				<Link href="/">
					<figure className="w-48 h-auto mx-auto">
						<img src={theme === 'dark' ? '/brand/logo-wt.svg' : '/brand/logo.svg'} alt="Logo" />
					</figure>
				</Link>
			</div>
		</div>
	);
}
