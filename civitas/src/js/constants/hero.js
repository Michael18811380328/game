/**
 * Warrior class
 *
 * @constant
 * @type {Number}
 */
civitas.HERO_CLASS_WARRIOR = 1;

/**
 * Mage class
 *
 * @constant
 * @type {Number}
 */
civitas.HERO_CLASS_MAGE = 2;

/**
 * Druid class
 *
 * @constant
 * @type {Number}
 */
civitas.HERO_CLASS_DRUID = 3;

/**
 * Priest class
 *
 * @constant
 * @type {Number}
 */
civitas.HERO_CLASS_PRIEST = 4;

/**
 * Rogue class
 *
 * @constant
 * @type {Number}
 */
civitas.HERO_CLASS_ROGUE = 5;

/**
 * Shaman class
 *
 * @constant
 * @type {Number}
 */
civitas.HERO_CLASS_SHAMAN = 6;

/**
 * List of names for hero classes
 *
 * @constant
 * @type {Array}
 */
civitas.HERO_CLASS_LIST = [
	'',
	'Warrior',
	'Mage',
	'Druid',
	'Priest',
	'Rogue',
	'Shaman'
];

/**
 * List of in-game heroes.
 *
 * @constant
 * @type {Object}
 */
civitas.HEROES = {
	1: {
		name: 'Achilles',
		description: 'Achilles is a Greek hero of the Trojan War and the central character and ' +
			'greatest warrior of Homer`s Iliad. His mother is the immortal nymph Thetis, and ' +
			'his father, the mortal Peleus, is the king of the Myrmidons.',
		price: 5000000,
		link: 'https://en.wikipedia.org/wiki/Achilles',
		stats: {
			strength: 10,
			stamina: 10,
			agility: 10,
			spirit: 5,
			intellect: 7
		},
		class: civitas.HERO_CLASS_WARRIOR,
		items: [
			civitas.ITEM_TROJAN_BASTARD_SWORD
		],
		backpack: [
		]
	},
	2: {
		name: 'Hector',
		description: 'In Greek mythology and Roman Mythology, Hector is a Trojan prince and ' +
			'the greatest fighter for Troy in the Trojan War. As the first-born son of King ' +
			'Priam and Queen Hecuba, who was a descendant of Dardanus and Tros, the founder ' +
			'of Troy, he is a prince of the royal house and the heir apparent to his father`s ' +
			'throne.',
		price: 4000000,
		link: 'https://en.wikipedia.org/wiki/Hector',
		stats: {
			strength: 8,
			stamina: 10,
			agility: 6,
			spirit: 4,
			intellect: 6
		},
		class: civitas.HERO_CLASS_WARRIOR,
		items: [
			civitas.ITEM_EXCALIBUR,
			civitas.ITEM_GOLDEN_KATANA
		],
		backpack: [
		]
	},
	3: {
		name: 'Hannibal',
		description: 'Hannibal Barca is a Carthaginian general, considered one of the greatest ' +
			'military commanders in history.',
		price: 3000000,
		link: 'https://en.wikipedia.org/wiki/Hannibal',
		stats: {
			strength: 7,
			stamina: 7,
			agility: 4,
			spirit: 2,
			intellect: 9
		},
		class: civitas.HERO_CLASS_WARRIOR,
		items: [
		],
		backpack: [
		]
	},
	4: {
		name: 'Heracles',
		description: 'Heracles is a divine hero in Greek mythology, the son of Zeus and ' +
			'Alcmene, foster son of Amphitryon and great-grandson and half-brother (as they ' +
			'are both sired by the god Zeus) of Perseus.<br /><br />He is the greatest of the Greek heroes, ' +
			'a paragon of masculinity, the ancestor of royal clans who claim to be Heracleidae, ' +
			'and a champion of the Olympian order against chthonic monsters.',
		price: 5000000,
		link: 'https://en.wikipedia.org/wiki/Heracles',
		stats: {
			strength: 9,
			stamina: 9,
			agility: 6,
			spirit: 7,
			intellect: 9
		},
		class: civitas.HERO_CLASS_WARRIOR,
		items: [
			civitas.ITEM_SPEAR_OF_DESTINY,
			civitas.ITEM_CROWN_OF_KINGS,
			civitas.ITEM_BULWARK_OF_GODS,
			civitas.ITEM_CHESTPIECE_OF_ZEUS,
			civitas.ITEM_ARCHAIC_WAIST_BAND,
			civitas.ITEM_ALCMENE_BAND,
			civitas.ITEM_SUN_NECKLACE,
			civitas.ITEM_ETHEREAL_BOOTS,
			civitas.ITEM_SHOULDERPADS_OF_VALOR,
			civitas.ITEM_MOUNTAIN_TROLLS,
			civitas.ITEM_GAUNTLETS_OF_GHASTLY_GLARE
		],
		backpack: [
		]
	},
	5: {
		name: 'Akhenaten',
		description: 'Akhenaten, known before the fifth year of his reign as Amenhotep IV ' +
			'(sometimes given its Greek form, Amenophis IV, and meaning "Amun Is Satisfied"), ' +
			'is an Ancient Egyptian pharaoh of the 18th Dynasty who ruled for 17 years.',
		price: 1000000,
		link: 'https://en.wikipedia.org/wiki/Akhenaten',
		stats: {
			strength: 4,
			stamina: 4,
			agility: 8,
			spirit: 9,
			intellect: 9
		},
		class: civitas.HERO_CLASS_WARRIOR,
		items: [
		],
		backpack: [
		]
	}
};
