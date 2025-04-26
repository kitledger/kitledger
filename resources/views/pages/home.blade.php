@extends('layouts.general')

@section('general_content')
<label for="org-creation-drawer" class="drawer-button btn btn-primary">Open drawer</label>
<ul>
	@foreach ($organizations as $organization)
	<li>
		<a href="/web/{{ $organization->id }}">
			{{ $organization->name }}
		</a>
	</li>
	@endforeach
</ul>
<div class="drawer drawer-end">
	<input id="org-creation-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-side">
		<label for="org-creation-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<section class="menu bg-base-200 text-base-content min-h-full w-1/2 p-4">
			<form method="POST" action="/organizations">
				@csrf
				<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
					<legend class="fieldset-legend">New Organization</legend>

					<label class="label">Name</label>
					<input type="text" class="input" placeholder="My amazing Organization" name="name" />
					@error('name')
					<span class="text-red-500 text-sm">{{ $message }}</span>
					@enderror

					<button type="submit" class="btn btn-primary mt-4">
						Create Organization
					</button>

				</fieldset>
			</form>
		</section>
	</div>
</div>
@endsection