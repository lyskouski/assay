-module(edu_sum).

-export([sum/1, interval/2, reverse_create/1, create/1, print/1, odd_print/1]).

sum(0) -> 
    0;
sum(N) when N < 0 ->
    N + sum(N+1);
sum(N) when N > 0 ->
    N + sum(N-1).
    
interval(0, 0) ->
    0;
interval(A, A) ->
    A;
interval(A, B) when A > B ->
    B + interval(A, B + 1);
interval(A, B) when B > A ->
    A + interval(A+1, B).
    
reverse_create(1) ->
    [1];
reverse_create(N) when N > 1 ->
    [N | create(N-1)];
reverse_create(N) when N < 1 ->
    [N | create(N+1)].
    
create(1) ->
    [1];
create(N) ->
    [1 | create(1, N)].
create(B, N) when N > B ->
    Val = B+1,
    [Val|create(Val,N)];
create(B, N) when N < B ->
    Val = B-1,
    [Val|create(Val,N)];
create(B, N) when N == B ->
    [].
    
print(N) ->
    io:format("Number:~p~n", [create(N)]).
    
get_odd(A, N) ->
    if
        A < N and (A rem 2) == 1 -> [A | get_odd(A+1, N)];
        A < N -> [[] | get_odd(A+1, N)];
	A == N and (A rem 2) == 1 -> [N];
        true -> [].
    
odd_print(N) ->
    io:format("Number:~p~n", [get_odd(1, N)]).
    
