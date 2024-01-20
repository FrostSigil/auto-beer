"use strict"

const DefaultSettings = {
    "enabled": true,
    "item": 80081, // Пиво
    "burst_abnormal":
    {
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
	},
    "abnormal": true, // S_ABNORMALITY_BEGIN
    "skill_id": 170240, // Адреналин к примеру
    "skill": false, // C_START_SKILL
    "skill_inst": false // C_START_INSTANCE_SKILL
}

module.exports = function MigrateSettings(from_ver, to_ver, settings) {
    if (from_ver === undefined) {
        // Migrate legacy config file
        return Object.assign(Object.assign({}, DefaultSettings), settings);
    } else if (from_ver === null) {
        // No config file exists, use default settings
        return DefaultSettings;
    } else {
        // Migrate from older version (using the new system) to latest one
        if (from_ver + 1 < to_ver) {
            // Recursively upgrade in one-version steps
            settings = MigrateSettings(from_ver, from_ver + 1, settings);
            return MigrateSettings(from_ver + 1, to_ver, settings);
        }

        // If we reach this point it's guaranteed that from_ver === to_ver - 1, so we can implement
        // a switch for each version step that upgrades to the next version. This enables us to
        // upgrade from any version to the latest version without additional effort!
        switch (to_ver) {
            case 2:
                settings.dungeon_only = false;
                break;
            case 3:
                settings.civil_unrest = false;
                break;
        }

        return settings;
    }
}
