/*
 * Check for undefined stuff.
 */
if (typeof civitas === 'undefined') {
	var civitas = {};
}

if (typeof civitas.objects === 'undefined') {
	civitas.objects = {};
}

if (typeof civitas.controls === 'undefined') {
	civitas.controls = {};
}

if (typeof civitas.modules === 'undefined') {
	civitas.modules = {};
}

/**
 * i8n function.
 * 
 * @param {String} value
 * @returns {String}
 */
civitas.l = function (value) {
	if (typeof civitas.lang[value] !== 'undefined' &&
		civitas.lang[value] !== '') {
		return civitas.lang[value];
	} else {
		return value;
	}
};

/**
 * Autostart music or not.
 * 
 * @constant
 * @type {Boolean}
 */
civitas.AUTOSTART_MUSIC = false;

/**
 * Enable encryption or not.
 * 
 * @constant
 * @type {Boolean}
 */
civitas.ENCRYPTION = false;

/**
 * Max level a settlement can have.
 * 
 * @constant
 * @type {Number}
 */
civitas.MAX_SETTLEMENT_LEVEL = 45;

/**
 * URL to the game assets
 * 
 * @constant
 * @type {String}
 */
civitas.ASSETS_URL = './';

/**
 * Amount of influence your settlement loses each year.
 * 
 * @constant
 * @type {Number}
 */
civitas.YEARLY_INFLUENCE_LOSS = 2;

/**
 * Amount of influence your settlement gains each year.
 * 
 * @constant
 * @type {Number}
 */
civitas.YEARLY_INFLUENCE_GAIN = 2;

/**
 * How many real seconds has a game day.
 *
 * constant
 * @type {Number}
 */
civitas.SECONDS_TO_DAY = 10;

/**
 * Number of city ruler avatars available to choose.
 * 
 * @constant
 * @type {Number}
 */
civitas.AVATARS = 10;

civitas.TRADES_ADDITION = 10;

civitas.TRADES_DISCOUNT = 20;

/**
 * Getting total city population is city_level * civitas.POPULATION_PER_LEVEL.
 *
 * @constant
 * @type {Number}
 */
civitas.POPULATION_PER_LEVEL = 2300;

/**
 * The black market discount.
 * 
 * @constant
 * @type {Number}
 */
civitas.BLACK_MARKET_DISCOUNT = 80;

/**
 * Total number of world maps.
 *
 * @constant
 * @type {Number}
 */
civitas.WORLDMAPS = 9;

/**
 * Fame required for each city level.
 * 
 * @constant
 * @type {Array}
 */
civitas.LEVELS = [
	0, 100, 500, 1000, 3000,
	6500, 12000, 20000, 30000, 45000,
	60000, 85000, 100000, 140000, 180000,
	220000, 290000, 350000, 400000, 500000,
	610000, 730000, 800000, 930000, 1100000,
	1300000, 1500000, 1800000, 2500000, 3000000, 
	4000000, 5500000, 6500000, 8000000, 9000000, 
	10000000, 12000000, 16000000, 20000000, 50000000,
	60000000, 70000000, 80000000, 90000000, 100000000
];

/**
 * Application version.
 * 
 * @constant
 * @type {String}
 */
civitas.VERSION = '0.3.0.' +
	((new Date()).getMonth() + 1) + '' +
	(new Date()).getDate() + '' + 
	(new Date()).getFullYear();

/**
 * Whether the application is in debug mode.
 * 
 * @default false
 * @constant
 * @type {Boolean}
 */
civitas.DEBUG = true;

/**
 * Browser localStorage key to store game data into.
 *
 * @constant
 * @type {String}
 */
civitas.STORAGE_KEY = 'civitas';

/**
 * Goods importance, vital means at most 50 stacks of goods will be up
 * for importing or exporting.
 *
 * @constant
 * @type {Number}
 */
civitas.IMPORTANCE_VITAL = 50;

/**
 * Goods importance, high means at most 30 stacks of goods will be up
 * for importing or exporting.
 *
 * @constant
 * @type {Number}
 */
civitas.IMPORTANCE_HIGH = 30;

/**
 * Goods importance, medium means at most 20 stacks of goods will be up
 * for importing or exporting.
 *
 * @constant
 * @type {Number}
 */
civitas.IMPORTANCE_MEDIUM = 20;

/**
 * Goods importance, low means at most 10 stacks of goods will be up
 * for importing or exporting.
 *
 * @constant
 * @type {Number}
 */
civitas.IMPORTANCE_LOW = 10;

/**
 * Difficulty level of the game is easy.
 * 
 * @constant
 * @type {Number}
 */
civitas.DIFFICULTY_EASY = 1;

/**
 * Difficulty level of the game is medium.
 * 
 * @constant
 * @type {Number}
 */
civitas.DIFFICULTY_MEDIUM = 2;

/**
 * Difficulty level of the game is hard.
 * 
 * @constant
 * @type {Number}
 */
civitas.DIFFICULTY_HARD = 3;

/**
 * Difficulty level of the game is hardcore.
 * 
 * @constant
 * @type {Number}
 */
civitas.DIFFICULTY_HARDCORE = 4;

/**
 * When a building is notifying the player it's out of resources (the
 * building, not the player).
 *
 * @constant
 * @type {Number}
 */
civitas.NOTIFICATION_MISSING_RESOURCES = 1;

/**
 * When a building is notifying the player its production is paused
 * manually by the player.
 *
 * @constant
 * @type {Number}
 */
civitas.NOTIFICATION_PRODUCTION_PAUSED = 2;

/**
 * When a building is notifying the player it is missing its requirements.
 *
 * @constant
 * @type {Number}
 */
civitas.NOTIFICATION_MISSING_REQUIREMENTS = 3;

/**
 * When a building is notifying the player the level of the city is too low.
 *
 * @constant
 * @type {Number}
 */
civitas.NOTIFICATION_SETTLEMENT_LOW_LEVEL = 4;

/**
 * Game type as single player (campaign, local).
 *
 * @constant
 * @type {Number}
 */
civitas.MODE_SINGLEPLAYER = 0;

/**
 * Game type as multi player (networked).
 *
 * @constant
 * @type {Number}
 */
civitas.MODE_MULTIPLAYER = 1;

/**
 * Diplomacy proposal action.
 *
 * @constant
 * @type {Number}
 */
civitas.ACTION_DIPLOMACY = 0;

/**
 * Campaign action.
 *
 * @constant
 * @type {Number}
 */
civitas.ACTION_CAMPAIGN = 1;

/**
 * Error notification
 *
 * @constant
 * @type {Number}
 */
civitas.NOTIFY_ERROR = 0;

/**
 * Achievement notification
 *
 * @constant
 * @type {Number}
 */
civitas.NOTIFY_ACHIEVEMENT = 1;

/**
 * Normal notification
 *
 * @constant
 * @type {Number}
 */
civitas.NOTIFY_NORMAL = 2;

/**
 * Event notification.
 *
 * @constant
 * @type {Number}
 */
civitas.NOTIFY_EVENT = 3;

/**
 * Max numbers of lines to show in the console. Too many will overload the DOM.
 *
 * @constant
 * @type {Number}
 */
civitas.MAX_CONSOLE_LINES = 5000;
