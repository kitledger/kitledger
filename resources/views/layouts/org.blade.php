@extends('layouts.general')

@section('general_content')
@include('navigation.org_topbar')
<main class="pt-16">
@yield('org_content')	
</main>
@include('navigation.org_bottombar')
@endsection

@stack('scripts')