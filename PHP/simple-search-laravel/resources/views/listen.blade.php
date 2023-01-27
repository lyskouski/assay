@extends('layouts.app')

@section('title', 'Listen')

@section('navigation')
    <a class="nav-link" href="/">Home</a>
    <a class="nav-link" href="{{ route('search') }}">Search</a>
    <a class="nav-link active" href="{{ route('listen') }}">Listen</a>
    <a class="nav-link" href="{{ route('administer') }}">Administer</a>
@endsection

@section('content')
    <img src="" id="spa-image" />
    <script type="module">
        window.onload = function () {
            Echo.channel('image')
                .listen('ImageShown', (e) => {
                    document.getElementById('spa-image').src = '/images/' + e.image + '.png';
                });
        };
    </script>
@endsection
