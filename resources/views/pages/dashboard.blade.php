@extends('layouts.org')

@section('org_content')

<h1>{{ session()->get('organization')->name }}</h1>

@endsection