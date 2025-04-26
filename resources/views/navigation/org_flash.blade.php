@php
use App\Enums\FlashMessageTypes;
@endphp


@if(session(FlashMessageTypes::SUCCESS->value))
<div role="alert" class="alert alert-soft alert-success rounded-none px-2 py-4">
	<i data-lucide="circle-check-big" class="h-6 w-6"></i>
	<div>
		<h3 class="font-bold">Success!</h3>
		<div class="text-xs">{!! session(FlashMessageTypes::SUCCESS->value) !!}</div>
	</div>
</div>
@endif

@if(session(FlashMessageTypes::ERROR->value))
<div role="alert" class="alert alert-soft alert-error rounded-none">
	<i data-lucide="circle-x" class="h-6 w-6"></i>
	<div>
		<h3 class="font-bold">Error!</h3>
		<div class="text-xs">{!! session(FlashMessageTypes::ERROR->value) !!}</div>
	</div>
</div>
@endif

@if(session(FlashMessageTypes::WARNING->value))
<div role="alert" class="alert alert-soft alert-warning rounded-none">
	<i data-lucide="triangle-alert" class="h-6 w-6"></i>
	<div>
		<h3 class="font-bold">Warning!</h3>
		<div class="text-xs">{!! session(FlashMessageTypes::WARNING->value) !!}</div>
	</div>
</div>
@endif

@if(session(FlashMessageTypes::INFO->value))
<div role="alert" class="alert alert-soft alert-info rounded-none">
	<i data-lucide="info" class="h-6 w-6"></i>
	<div>
		<h3 class="font-bold">Info!</h3>
		<div class="text-xs">{!! session(FlashMessageTypes::INFO->value) !!}</div>
	</div>
</div>
@endif