/**
 * List of game diplomacy options.
 *
 * @constant
 * @type {Array}
 */
civitas.DIPLOMACIES = [
	'truce',
	'war',
	'pact',
	'alliance',
	'cease fire',
	'pact proposed',
	'alliance proposed',
	'cease fire proposed',
	'proposed to join you',
	'vassal'
];

/**
 * The campaign is an army.
 *
 * @constant
 * @type {Number}
 */
civitas.CAMPAIGN_ARMY = 1;

/**
 * The campaign is a caravan.
 *
 * @constant
 * @type {Number}
 */
civitas.CAMPAIGN_CARAVAN = 2;

/**
 * The campaign is a spy.
 *
 * @constant
 * @type {Number}
 */
civitas.CAMPAIGN_SPY = 3;

/**
 * The campaign is an army returning home with spoils of war.
 *
 * @constant
 * @type {Number}
 */
civitas.CAMPAIGN_ARMY_RETURN = 4;

/**
 * Just met, temporary truce, can declare war, can trade.
 * 
 * @constant
 * @type {Number}
 */
civitas.DIPLOMACY_TRUCE = 0;

/**
 * At war, no trades possible.
 * 
 * @constant
 * @type {Number}
 */
civitas.DIPLOMACY_WAR = 1;

/**
 * In a pact, can declare war, can trade.
 * 
 * @constant
 * @type {Number}
 */
civitas.DIPLOMACY_PACT = 2;

/**
 * In an alliance, cannot declare war, can trade with discounts,
 * can share armies.
 * 
 * @constant
 * @type {Number}
 */
civitas.DIPLOMACY_ALLIANCE = 3;

/**
 * A cease fire means a temporary peace.
 * 
 * @constant
 * @type {Number}
 */
civitas.DIPLOMACY_CEASE_FIRE = 4;

/**
 * Propose pact.
 * 
 * @constant
 * @type {Number}
 */
civitas.DIPLOMACY_PROPOSE_PACT = 5;

/**
 * Propose alliance.
 * 
 * @constant
 * @type {Number}
 */
civitas.DIPLOMACY_PROPOSE_ALLIANCE = 6;

/**
 * Propose cease fire.
 * 
 * @constant
 * @type {Number}
 */
civitas.DIPLOMACY_PROPOSE_CEASE_FIRE = 7;

/**
 * Propose to join your settlement.
 * 
 * @constant
 * @type {Number}
 */
civitas.DIPLOMACY_PROPOSE_JOIN = 8;

/**
 * Vassal villages count as part of your empire.
 * 
 * @constant
 * @type {Number}
 */
civitas.DIPLOMACY_VASSAL = 9;

/**
 * Influence gained when selling goods to a settlement.
 *
 * @constant
 * @type {Number}
 */
civitas.EXPORT_INFLUENCE = 2;

/**
 * Influence gained when buying goods from a settlement.
 *
 * @constant
 * @type {Number}
 */
civitas.IMPORT_INFLUENCE = 1;

/**
 * Prestige gained when selling goods to a settlement.
 *
 * @constant
 * @type {Number}
 */
civitas.EXPORT_PRESTIGE = 2;

/**
 * Prestige gained when buying goods from a settlement.
 *
 * @constant
 * @type {Number}
 */
civitas.IMPORT_PRESTIGE = 1;

/**
 * The minimum value settlement prestige can have.
 *
 * @constant
 * @type {Number}
 */
civitas.MIN_PRESTIGE_VALUE = 1;

/**
 * The maximum value settlement prestige can have.
 *
 * @constant
 * @type {Number}
 */
civitas.MAX_PRESTIGE_VALUE = 10000;

/**
 * The minimum value settlement research can have.
 *
 * @constant
 * @type {Number}
 */
civitas.MIN_RESEARCH_VALUE = 1;

/**
 * The maximum value settlement research can have.
 *
 * @constant
 * @type {Number}
 */
civitas.MAX_RESEARCH_VALUE = 1000;

/**
 * The minimum value settlement espionage can have.
 *
 * @constant
 * @type {Number}
 */
civitas.MIN_ESPIONAGE_VALUE = 1;

/**
 * The maximum value settlement espionage can have.
 *
 * @constant
 * @type {Number}
 */
civitas.MAX_ESPIONAGE_VALUE = 1000;

/**
 * The success rate of an espionage mission is the espionage points
 * assigned to the mission divided by this value.
 *
 * @constant
 * @type {Number}
 */
civitas.MAX_ESPIONAGE_SUCESS_RATE = 100;

/**
 * The minimum value settlement influence can have.
 *
 * @constant
 * @type {Number}
 */
civitas.MIN_INFLUENCE_VALUE = 1;

/**
 * The maximum value settlement influence can have.
 *
 * @constant
 * @type {Number}
 */
civitas.MAX_INFLUENCE_VALUE = 100;

/**
 * List of game diplomacy options.
 *
 * @constant
 * @type {Array}
 */
civitas.SPY_MISSIONS = [
	'none',
	'adopt religion',
	'influence settlement',
	'steal resources',
	'instigate turmoil'
];

/**
 * Spy mission to do absolutely nothing in the target city (except
 * maybe get noticed?).
 *
 * @constant
 * @type {Number}
 */
civitas.SPY_MISSION_NONE = 0;

/**
 * Spy mission to persuade the target city to take the same religion
 * as the spy home city.
 *
 * @constant
 * @type {Number}
 */
civitas.SPY_MISSION_RELIGION = 1;

/**
 * Spy mission to raise the influence of the spy's home city with the
 * target city.
 *
 * @constant
 * @type {Number}
 */
civitas.SPY_MISSION_INFLUENCE = 2;

/**
 * Spy mission to steal resources from the target city.
 *
 * @constant
 * @type {Number}
 */
civitas.SPY_MISSION_STEAL_RESOURCES = 3;

/**
 * Spy mission to instigate turmoil in the target city.
 *
 * @constant
 * @type {Number}
 */
civitas.SPY_MISSION_INSTIGATE = 4;

/**
 * Initial resource costs for sending a caravan.
 *
 * @constant
 * @type {Object}
 */
civitas.CARAVAN_COSTS = {
	coins: 1000,
	donkeys: 10,
	wood: 10,
	ropes: 2,
	provisions: 1
}

/**
 * Initial resource costs for sending a spy mission.
 *
 * @constant
 * @type {Object}
 */
civitas.SPY_COSTS = {
	coins: 500,
	spyglasses: 1,
	weapons: 1,
	provisions: 1
}

/**
 * Initial resource costs for sending an army.
 *
 * @constant
 * @type {Object}
 */
civitas.ARMY_COSTS = {
	coins: 2000,
	provisions: 1
}

/**
 * Amount of influence a settlement gains when sending a caravan
 * to another settlement.
 *
 * @constant
 * @type {Number}
 */
civitas.CARAVAN_INFLUENCE = 5;
