<footer class="flex flex-col lg:flex-row bg-base-300 justify-between lg:fixed bottom-0 w-full text-xs font-mono items-center">
	<div class="dropdown dropdown-top">
		<nav tabindex="0" role="button" class="tooltip tooltip-top flex gap-2 py-1 px-2 hover:bg-base-200 cursor-pointer" data-tip="User name and action">
			<i data-lucide="circle-user-round" class="h-4 w-4"></i><p>{{ Auth::user()->name }}</p>
		</nav>
		<ul tabindex="0" class="dropdown-content bg-base-200 menu z-1 w-52 p-0">
			<li><a href="/profile">Profile</a></li>
			<li><a href="/logout">Log out</a></li>
		</ul>
	</div>

	<nav class="tooltip tooltip-top flex gap-2 py-1 px-2 hover:bg-base-200" data-tip="Org name and environment">
		<i class="h-4 w-4" data-lucide="store"></i><p>{{ session()->get('organization')->name }} {{ config('app.env') ? '(' . config('app.env') . ')' : '' }}</p>
	</nav>

	<nav class="tooltip tooltip-top flex gap-2 py-1 px-2 hover:bg-base-200" data-tip="Version, region and language">
		<i data-lucide="git-branch" class="h-4 w-4"></i>
		<p>
			{{ config('app.version') ?? '' }}
			{{ config('app.region') ?? '' }}
			{{ app()->getLocale() ?? '' }}
		</p>
	</nav>
</footer>