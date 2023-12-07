module.exports = function AutoBeer(mod) {

	mod.game.initialize(["me.abnormalities"]);
	const { player } = mod.require.library;
	const beer = 80081;
	const bustAbn = {
		warrior: [ 100800, 100801 ], //Смертельная игра (Воин)
		lancer: [ 201903, 201904 ], // Адреналин (Рыцарь)
		slayer: [ 300800, 300805 ], // Холодная кровь (Убийца)
		berserker: [ 401705 ], // Бешенство (Берсерк)
		sorcerer: [ 503061 ], // Мана буст (Маг)
		archer: [ 602221 ], // Мелодия (Лучник)
		priest: [ 805800 ], // Крылья (Священник)
		elementalist: [ 702004 ], // Разрушитель (Мистик)
		soulless: [ 10151010 ], // Жатва (Жнец)
		engineer: [ 10152340 ], // Джет панель (Инженер)
		fighter: [ 10153210 ], // Ураганная серия (Крушитель)
		assassin: [ 10154480 ], // Гармония (Шиноби)	
		valkyrie: [ 10155130, 10155512 ] // Багровка / Последняя песня(Валькирия)
	};
    let enable = true;

	mod.command.add('beer', {
		$default() {
			enable = !enable;
			mod.command.message(`${enable ? 'en' : 'dis'}abled`);
		}
	});
	
	mod.hook('S_ABNORMALITY_BEGIN', "*", event => { useBeer(event); });

	function useBeer(event) {
		if (!mod.game.me.is(event.target) || !mod.game.me.alive) return;
		if (bustAbn[mod.game.me.class] && bustAbn[mod.game.me.class].includes(event.id)) {
			useItem(beer);
		}
	}

	function useItem(id) {
		if (!player)
			return;
		mod.send("C_USE_ITEM", "*", {
			gameId: mod.game.me.gameId,
			id: id,
			amount: 1,
			loc: player.loc,
			w: player.loc.w,
			unk4: true
		});
	}
}