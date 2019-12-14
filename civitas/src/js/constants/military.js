/**
 * The attacking side (left) in a battleground.
 *
 * @type {Number}
 * @constant
 */
civitas.BATTLEGROUND_ATTACK = 1;

/**
 * The defending side (right) in a battleground.
 *
 * @type {Number}
 * @constant
 */
civitas.BATTLEGROUND_DEFENSE = 2;

/**
 * List of soldier types, their attributes and cost.
 * 
 * @type {Object}
 * @constant
 */
civitas.SOLDIERS = {
	militia: {
		name: 'Militia',
		attack: 1,
		defense: 1,
		moves: 1,
		cost: {
			coins: 100,
			bread: 1,
			weapons: 1
		}
	},
	swordsman: {
		name: 'Swordsman',
		attack: 2,
		defense: 2,
		moves: 2,
		cost: {
			coins: 300,
			bread: 1,
			meat: 1,
			weapons: 2
		}
	},
	axeman: {
		name: 'Axeman',
		attack: 3,
		defense: 1,
		moves: 2,
		cost: {
			coins: 400,
			bread: 1,
			meat: 3,
			weapons: 2
		}
	},
	bowman: {
		name: 'Bowman',
		attack: 3,
		defense: 1,
		ranged: 5,
		moves: 3,
		cost: {
			coins: 500,
			bread: 1,
			meat: 3,
			weapons: 4
		}
	},
	pikeman: {
		name: 'Pikeman',
		attack: 2,
		defense: 4,
		moves: 2,
		cost: {
			coins: 700,
			provisions: 1,
			iron: 1,
			leather: 1,
			weapons: 5,
			armor: 1
		}
	},
	crossbowman: {
		name: 'Crossbowman',
		attack: 5,
		defense: 2,
		moves: 3,
		ranged: 8,
		cost: {
			coins: 1000,
			provisions: 2,
			clothes: 1,
			iron: 1,
			weapons: 7,
			armor: 1
		}
	},
	knight: {
		name: 'Knight',
		attack: 6,
		defense: 6,
		moves: 4,
		cost: {
			coins: 1500,
			provisions: 3,
			clothes: 1,
			iron: 1,
			weapons: 9,
			armor: 4
		}
	},
	legionnaire: {
		name: 'Legionnaire',
		attack: 7,
		defense: 7,
		moves: 2,
		cost: {
			coins: 2500,
			provisions: 6,
			leather: 2,
			iron: 2,
			weapons: 12,
			armor: 12
		}
	},
	crusader: {
		name: 'Crusader',
		attack: 9,
		defense: 9,
		moves: 4,
		cost: {
			coins: 3000,
			provisions: 8,
			leather: 3,
			iron: 4,
			weapons: 15,
			armor: 15
		}
	},
	cannon: {
		name: 'Cannon',
		attack: 15,
		defense: 1,
		moves: 0,
		siege: true,
		ranged: 20,
		cost: {
			coins: 25000,
			provisions: 30,
			gunpowder: 30,
			iron: 40,
			cannons: 1
		}
	},
	heavycannon: {
		name: 'Heavy Cannon',
		attack: 25,
		defense: 1,
		moves: 0,
		siege: true,
		ranged: 20,
		cost: {
			coins: 80000,
			provisions: 80,
			gunpowder: 80,
			iron: 100,
			cannons: 10
		}
	},
	catapult: {
		name: 'Catapult',
		attack: 50,
		defense: 1,
		ranged: 20,
		siege: true,
		moves: 0,
		cost: {
			coins: 100000,
			provisions: 150,
			gunpowder: 150,
			iron: 140,
			catapults: 1
		}
	}
};

/**
 * List of mercenary armies available for hire.
 * 
 * @constant
 * @type {Object}
 */
civitas.MERCENARIES = [{
	name: 'Legio I Adiutrix',
	description: 'Legio prima Adiutrix is a Roman legion.',
	handle: 'legio1',
	icon: 1,
	army: {
		axeman: 300,
		knight: 100,
		crossbowman: 220,
		pikeman: 200,
		legionnaire: 100
	},
	cost: 120000
}, {
	name: 'Legio II Augusta',
	description: 'Legio secunda Augusta is a Roman legion.',
	handle: 'legio2',
	icon: 8,
	army: {
		axeman: 220,
		knight: 100,
		crossbowman: 300,
		pikeman: 100,
		legionnaire: 100
	},
	cost: 130000
}, {
	name: 'Legio III Cyrenaica',
	description: 'Legio tertia Cyrenaica is a Roman legion.',
	handle: 'legio3',
	icon: 15,
	army: {
		axeman: 280,
		crossbowman: 500,
		pikeman: 180,
		legionnaire: 100
	},
	cost: 100000
}, {
	name: 'Legio IV Flavia Felix',
	description: 'Legio quarta Flavia Felix is a Roman legion.',
	handle: 'legio4',
	icon: 9,
	army: {
		militia: 140,
		axeman: 190,
		knight: 90,
		bowman: 20,
		crossbowman: 100,
		pikeman: 180,
		legionnaire: 100
	},
	cost: 190000
}, {
	name: 'Legio V Alaudae',
	description: 'Legio quinta Alaudae is a Roman legion.',
	handle: 'legio5',
	icon: 16,
	army: {
		militia: 100,
		axeman: 200,
		bowman: 190,
		legionnaire: 130
	},
	cost: 110000
}, {
	name: 'Legio VI Victrix',
	description: 'Legio sexta Victrix is a Roman legion.',
	handle: 'legio6',
	icon: 22,
	army: {
		militia: 330,
		axeman: 230,
		knight: 100,
		bowman: 100,
		legionnaire: 100
	},
	cost: 140000
}, {
	name: 'Varangian Guard',
	description: 'The Varangian Guard is an elite unit of the Byzantine Army.',
	handle: 'varangian',
	icon: 18,
	army: {
		militia: 410,
		axeman: 210,
		bowman: 190,
		crossbowman: 100,
		pikeman: 220
	},
	cost: 120000
}, {
	name: 'Magna Societas Catalanorum',
	description: 'The Catalan Company of the East, officially the Magna ' +
		'Societas Catalanorum is a company of mercenaries founded by Roger de ' +
		'Flor.',
	handle: 'catalan',
	icon: 23,
	army: {
		axeman: 310,
		knight: 120,
		bowman: 210,
		pikeman: 310
	},
	cost: 100000
}, {
	name: 'Army of the Western Garden',
	description: 'The Army of the Western Garden is an army established ' +
		'during the reign of Emperor Ling in the Eastern Han Dynasty.',
	handle: 'western',
	icon: 27,
	army: {
		axeman: 290,
		knight: 40,
		bowman: 170,
		pikeman: 300
	},
	cost: 90000
}, {
	name: 'Scholae Palatinae',
	description: 'The Scholae Palatinae are an elite military guard unit, ' +
		'usually ascribed to the Roman Emperor Constantine the Great as a ' +
		'replacement for the equites singulares Augusti, the cavalry arm ' +
		'of the Praetorian Guard.',
	handle: 'scholae',
	icon: 26,
	army: {
		axeman: 10,
		knight: 200,
		bowman: 100,
		pikeman: 210
	},
	cost: 290000
}, {
	name: 'Imperial Guards',
	description: 'The Imperial Guards of the Tang Dynasty, also known as ' +
		'the Forbidden Troops were initially honor guards of the emperor ' +
		'and garrisons of the imperial capitals during the Tang`s dinasty ' +
		'formation in early 7th century.',
	handle: 'forbidden',
	icon: 25,
	army: {
		axeman: 290,
		knight: 80,
		bowman: 100,
		pikeman: 210
	},
	cost: 130000
}, {
	name: 'Navy of the Order of Saint John',
	description: 'The navy of the Order of Saint John, also known as the ' +
		'Maltese Navy, was the first navy of a chivalric order, established ' +
		'in the Middle Ages, around the late 12th century.',
	handle: 'maltesenavy',
	icon: 28,
	navy: {
		corsair: 19,
		caravel: 14,
		warship: 12,
		shipoftheline: 10
	},
	cost: 1500000
}];

/**
 * List of ship types, their attributes and cost.
 * 
 * @type {Object}
 * @constant
 */
civitas.SHIPS = {
	corsair: {
		name: 'Corsair',
		attack: 5,
		defense: 5,
		cost: {
			coins: 1000,
			wood: 200,
			leather: 50,
			iron: 50,
			provisions: 50,
			pottery: 10,
			clothes: 50,
			ropes: 10,
			cannons: 5,
			gunpowder: 2
		}
	},
	caravel: {
		name: 'Caravel',
		attack: 10,
		defense: 10,
		cost: {
			coins: 3000,
			wood: 400,
			leather: 60,
			iron: 80,
			provisions: 60,
			pottery: 20,
			clothes: 60,
			ropes: 30,
			cannons: 20,
			gunpowder: 5,
			weapons: 10
		}
	},
	frigate: {
		name: 'Frigate',
		attack: 17,
		defense: 8,
		cost: {
			coins: 3000,
			wood: 400,
			leather: 60,
			iron: 80,
			provisions: 60,
			pottery: 30,
			clothes: 60,
			ropes: 30,
			cannons: 20,
			gunpowder: 10,
			weapons: 10
		}
	},
	galleon: {
		name: 'Galleon',
		attack: 15,
		defense: 15,
		cost: {
			coins: 5000,
			wood: 600,
			leather: 70,
			iron: 120,
			provisions: 100,
			pottery: 50,
			clothes: 70,
			ropes: 80,
			cannons: 30,
			gunpowder: 15,
			weapons: 15
		}
	},
	warship: {
		name: 'Warship',
		attack: 35,
		defense: 30,
		cost: {
			coins: 10000,
			wood: 1000,
			leather: 200,
			iron: 500,
			provisions: 200,
			pottery: 100,
			clothes: 200,
			ropes: 100,
			cannons: 50,
			weapons: 20,
			gunpowder: 20,
			carpets: 10
		}
	},
	shipoftheline: {
		name: 'Ship of the Line',
		attack: 55,
		defense: 50,
		cost: {
			coins: 15000,
			wood: 2000,
			coal: 500,
			leather: 400,
			iron: 1500,
			provisions: 200,
			pottery: 140,
			barrels: 100,
			clothes: 200,
			ropes: 100,
			cannons: 100,
			gunpowder: 30,
			weapons: 50
		}
	}
};
