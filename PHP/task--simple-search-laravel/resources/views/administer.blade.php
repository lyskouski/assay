@extends('layouts.app')

@section('title', 'Administer')

@section('navigation')
    <a class="nav-link" href="/">Home</a>
    <a class="nav-link" href="{{ route('search') }}">Search</a>
    <a class="nav-link" href="{{ route('listen') }}">Listen</a>
    <a class="nav-link active" href="{{ route('administer') }}">Administer</a>
@endsection
