/**
 * List of the possible ruler personality types.
 * 
 * @constant
 * @type {Array}
 */
civitas.PERSONALITIES = [
    'none',
    'balanced',
    'diplomat',
    'warlord'
];

/**
 * Balanced type, the ruler weights in all the possibilities before deciding
 * whether to go to war or let diplomacy win.
 * 
 * @constant
 * @type {Number}
 */
civitas.PERSONALITY_BALANCED = 1;

/**
 * The ruler will always consider diplomacy before going to war.
 * 
 * @constant
 * @type {Number}
 */
civitas.PERSONALITY_DIPLOMAT = 2;

/**
 * If you upset this ruler, he will go to war and give you hell.
 * 
 * @constant
 * @type {Number}
 */
civitas.PERSONALITY_WARLORD = 3;
