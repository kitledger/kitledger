<header class="flex justify-between fixed top-0 p-2 font-mono w-full z-10 border-b border-base-200 h-16">
	<nav class="flex justify-start gap-4 items-center w-1/3">
		<label class="drawer-button btn btn-soft btn-primary btn-circle btn-sm" for="smartbox-drawer">
			<i data-lucide="menu" class="w-4 h-4"></i>
		</label>
		<div class="flex flex-col gap-0">
			<span class="text-md font-bold">
				Title
			</span>
			<div class="p-0 text-xs font-mono breadcrumbs">
				<ul>
					<li><a>Home</a></li>
					<li><a>Documents</a></li>
					<li>Add Document</li>
				</ul>
			</div>
		</div>
	</nav>
	<nav class="hidden lg:flex lg:gap-2 lg:items-center w-1/3 justify-center">
		
	</nav>
	<nav class="flex justify-end gap-4 items-center w-1/3">
		<div class="flex gap-2">
			@yield('page_actions')
		</div>
		@yield('page_icon')
	</nav>
</header>

@include('navigation.org_smartbox')