@extends('layouts.app')

@section('title', 'Home page')

@section('navigation')
    <a class="nav-link active" href="/">Home</a>
    <a class="nav-link" href="{{ route('search') }}">Search</a>
    <a class="nav-link" href="{{ route('listen') }}">Listen</a>
    <a class="nav-link" href="{{ route('administer') }}">Administer</a>
@endsection