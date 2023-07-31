Node.js-based application.

Start the game:
> node index.js --start --home=Mexico --away=Canada

Update score (`id` is taken from `--start`): 
> node index.js --id 0 --home=0 --away=0

Finish a game (by `id`):
> node index.js --finish=0 

Get a summary of all games:
> node index.js --summary

Get a scoreboard of active games:
> node index.js --scoreboard

Get a scoreboard (by `id`):
> node index.js --scoreboard=0
