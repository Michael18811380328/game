/**
 * List of the possible climate types.
 * 
 * @constant
 * @type {Array}
 */
civitas.CLIMATES = [
	'none',
	'temperate',
	'tropical',
	'arid',
	'polar'
];

/**
 * Temperate climate, all balanced.
 * 
 * @constant
 * @type {Number}
 */
civitas.CLIMATE_TEMPERATE = 1;

/**
 * Tropical climate, favoring farms and exotic goods.
 * 
 * @constant
 * @type {Number}
 */
civitas.CLIMATE_TROPICAL = 2;

/**
 * Arid climate, favoring ore mines.
 * 
 * @constant
 * @type {Number}
 */
civitas.CLIMATE_ARID = 3;

/**
 * Polar climate, very extreme.
 * 
 * @constant
 * @type {Number}
 */
civitas.CLIMATE_POLAR = 4;

/**
 * Worldmap position of city when the climate is temperate.
 * 
 * @constant
 * @type {Object}
 */
civitas.SETTLEMENT_LOCATION_TEMPERATE = {
	x: 500,
	y: 500
};

/**
 * Worldmap position of city when the climate is tropical.
 * 
 * @constant
 * @type {Object}
 */
civitas.SETTLEMENT_LOCATION_TROPICAL = {
	x: 500,
	y: 450
};

/**
 * Worldmap position of city when the climate is arid.
 * 
 * @constant
 * @type {Object}
 */
civitas.SETTLEMENT_LOCATION_ARID = {
	x: 500,
	y: 300
};

/**
 * Worldmap position of city when the climate is polar.
 * 
 * @constant
 * @type {Object}
 */
civitas.SETTLEMENT_LOCATION_POLAR = {
	x: 500,
	y: 60
};
