@extends('layouts.app')

@section('title', 'Search')

@section('navigation')
    <a class="nav-link" href="/">Home</a>
    <a class="nav-link active" href="{{ route('search') }}">Search</a>
    <a class="nav-link" href="{{ route('listen') }}">Listen</a>
    <a class="nav-link" href="{{ route('administer') }}">Administer</a>
@endsection

@section('content')
    <link href="/css/search.css?4" rel="stylesheet" />
    <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-8">
            <form class="card card-sm" method="POST" action="/search">
                @csrf
                <div class="card-body row no-gutters align-items-center">
                    <div class="col-auto">
                        <i class="fas fa-search h4 text-body"></i>
                    </div>
                    <div class="col">
                        <input name="search" value="{{ $searchInput }}" class="form-control form-control-lg form-control-borderless" type="search" placeholder="Search by ID or keywords">
                    </div>
                    <div class="col-auto">
                        <button class="btn btn-lg btn-success" type="submit">Search</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="row">&nbsp;</div>
    <div class="row">
        @foreach ($output as $product)
        <div class="col-md-4 col-lg-3 mb-2 spa-item">
            <div class="card">
                <img src="{{ asset("/images/${product['id']}.png") }}" class="card-img-top img-card btn spa-image">
                <div class="card-body text-center">
                    <div>[{{ $product["id"] }}] {{ $product["name"] }}</div>
                    <span class="btn bg-primary text-white spa-save" data-scope="|{{ $product["id"] }}:{{ $product["name"] }}">Add to Favorite</span>
                </div>
            </div>
        </div>
        @endforeach
    </div>
    <div class="py-4">
        <h2>Favorites</h2>
    </div>
    <div class="row" id="spa-favorites">
        @foreach ($savedOutput as $product)
        <div class="col-md-4 col-lg-3 mb-2">
            <div class="card">
                <img src="{{ asset("/images/${product[0]}.png") }}" class="card-img-top img-card btn spa-image">
                <div class="card-body text-center">
                    <div>[{{ $product[0] }}] {{ $product[1] }}</div>
                </div>
            </div>
        </div>
        @endforeach
    </div>
    <script src="/js/search.js?4"></script>
@endsection
