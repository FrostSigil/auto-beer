module.exports = function AutoBeer(mod) {

	mod.game.initialize(["me.abnormalities", "inventory"]);
	const { player } = mod.require.library;
	let delay = false;

	mod.command.add("beer", {
		$default() {
			mod.settings.enabled = !mod.settings.enabled;
			mod.command.message(`Автоматическое использование пива: ${mod.settings.enabled ? "Вкл" : "Выкл"}ючено`);
		},
		abnormal() {
			mod.settings.abnormal = !mod.settings.abnormal
			if (mod.settings.skill || mod.settings.skill_inst) {mod.settings.skill = false; mod.settings.skill_inst = false}
			mod.command.message(`Автопиво по абнормали: ${mod.settings.abnormal ? "Вкл" : "Выкл"}ючено`);
		},
		skill(arg) {
			if (arg != null) {mod.settings.skill_id = parseInt(arg);	mod.settings.skill = true;
				mod.command.message(`Обновлен триггер скилл ${mod.settings.skill_id}`);
				if (mod.settings.abnormal || mod.settings.skill_inst) {mod.settings.abnormal = false; mod.settings.skill_inst = false}}
			if (!arg) {
				mod.settings.skill = !mod.settings.skill
				if (mod.settings.abnormal || mod.settings.skill_inst) {mod.settings.abnormal = false; mod.settings.skill_inst = false}
			}
			mod.command.message(`Автопиво по скиллу: ${mod.settings.skill ? "Вкл" : "Выкл"}ючено`);
		},
		skillinst(arg) {
			if (arg != null) {mod.settings.skill_id = parseInt(arg);	mod.settings.skill_inst = true;
				mod.command.message(`Обновлен триггер инстанc скилл ${mod.settings.skill_id}`);
				if (mod.settings.abnormal || mod.settings.skill) {mod.settings.abnormal = false; mod.settings.skill = false}}
			if (!arg) {
				mod.settings.skill_inst = !mod.settings.skill_inst;
				if (mod.settings.abnormal || mod.settings.skill) {mod.settings.abnormal = false; mod.settings.skill = false}
			}
			mod.command.message(`Автопиво по инстанc скиллу: ${mod.settings.skill_inst ? "Вкл" : "Выкл"}ючено`);
		},
		item(arg) {
			if (isNaN(arg)) {
				const idMatch = arg.match(/#(\d*)@/);
				if (idMatch) {
					const newItemId = parseInt(idMatch[1]);
					mod.settings.item = newItemId;
				}
			} else {
				mod.settings.item = parseInt(arg);
			}
			mod.command.message(`Айди предмета для использования изменён на: ${mod.settings.item}`);
			mod.saveSettings();
		}
		
	});
	
	mod.hook("S_ABNORMALITY_BEGIN", "*", { order: Infinity, filter: { fake: null } }, event => {
		if (!mod.game.me.is(event.target) && !mod.settings.abnormal) return;
		if (mod.settings.burst_abnormal[mod.game.me.class] && mod.settings.burst_abnormal[mod.game.me.class].includes(event.id)) {
			useBeer();
		}
	});

	mod.hook("C_START_SKILL", "*", { order: Infinity, filter: { fake: null } }, event => {
		if (event.skill.id === mod.settings.skill_id && mod.settings.skill) {
			useBeer();
		}
	});

	mod.hook("C_START_INSTANCE_SKILL", "*", { order: Infinity, filter: { fake: null } }, event => {
		if (event.skill.id === mod.settings.skill_id && mod.settings.skill_inst) {
			useBeer();
		}
	});

	function useBeer() {
		if (!mod.game.me.alive || delay) return;
		delay = true; mod.setTimeout(()=> delay = false, 5000);
		const item = mod.settings.item;
		const beer = mod.game.inventory.bagOrPocketItems.find(x => x.id === item);
		if (beer && mod.game.inventory.findAllInBagOrPockets(beer.id).length !== 0) {
			useItem(beer.id, beer.dbid);
		}
	}
	
	function useItem(id, dbid) {
		if (!player) return;
		mod.send("C_USE_ITEM", "*", {
			gameId: mod.game.me.gameId,
			id,
			dbid,
			amount: 1,
			loc: player.loc,
			w: player.loc.w,
			unk4: true
		});
	}
};