/**
 * List of all the resources available in-game.
 * 
 * @constant
 * @type {Object}
 */
civitas.RESOURCES = {
	coins: {
		name: 'Coins'
	},
	fame: {
		name: 'Fame'
	},
	prestige: {
		name: 'Prestige'
	},
	espionage: {
		name: 'Espionage'
	},
	research: {
		name: 'Research'
	},
	faith: {
		name: 'Faith'
	},
	almonds: {
		name: 'Almonds',
		price: 180
	},
	armor: {
		name: 'Armor',
		price: 220
	},
	barrels: {
		name: 'Barrels',
		price: 60
	},
	beer: {
		name: 'Beer',
		price: 30
	},
	books: {
		name: 'Books',
		price: 100
	},
	bottles: {
		name: 'Bottles',
		price: 10,
		imported: true
	},
	bread: {
		name: 'Bread',
		price: 30
	},
	brine: {
		name: 'Brine',
		price: 10
	},
	brass: {
		name: 'Brass',
		price: 60
	},
	camels: {
		name: 'Camels',
		price: 110,
		imported: true
	},
	candles: {
		name: 'Candles',
		price: 100
	},
	candlesticks: {
		name: 'Candlesticks',
		price: 170
	},
	cannons: {
		name: 'Cannons',
		price: 700
	},
	carpets: {
		name: 'Carpets',
		price: 400
	},
	catapults: {
		name: 'Catapults',
		price: 1200
	},
	cattle: {
		name: 'Cattle',
		price: 43
	},
	cider: {
		name: 'Cider',
		price: 45
	},
	clay: {
		name: 'Clay',
		price: 20
	},
	clothes: {
		name: 'Clothes',
		price: 104
	},
	coal: {
		name: 'Coal',
		price: 36
	},
	coffee: {
		name: 'Coffee',
		price: 300
	},
	coffeebeans: {
		name: 'Coffee Beans',
		price: 220
	},
	copper: {
		name: 'Copper',
		price: 43
	},
	dates: {
		name: 'Dates',
		price: 160
	},
	donkeys: {
		name: 'Donkeys',
		price: 90,
		imported: true
	},
	fibers: {
		name: 'Fibers',
		price: 80
	},
	fish: {
		name: 'Fish',
		price: 16
	},
	flour: {
		name: 'Flour',
		price: 40
	},
	furcoats: {
		name: 'Fur coats',
		price: 122
	},
	furs: {
		name: 'Furs',
		price: 78
	},
	gems: {
		name: 'Gems',
		price: 460
	},
	glass: {
		name: 'Glass',
		price: 86
	},
	glasses: {
		name: 'Glasses',
		price: 140
	},
	gold: {
		name: 'Gold',
		price: 260
	},
	goldores: {
		name: 'Gold ores',
		price: 80
	},
	grapes: {
		name: 'Grapes',
		price: 35
	},
	gunpowder: {
		name: 'Gunpowder',
		price: 420
	},
	hemp: {
		name: 'Hemp',
		price: 46
	},
	herbs: {
		name: 'Herbs',
		price: 18
	},
	hides: {
		name: 'Hides',
		price: 25
	},
	indigo: {
		name: 'Indigo',
		price: 80
	},
	iron: {
		name: 'Iron',
		price: 82
	},
	ironores: {
		name: 'Iron ores',
		price: 42
	},
	jewelery: {
		name: 'Jewelery',
		price: 900
	},
	leather: {
		name: 'Leather',
		price: 60
	},
	marzipan: {
		name: 'Marzipan',
		price: 150
	},
	meat: {
		name: 'Meat',
		price: 30
	},
	milk: {
		name: 'Milk',
		price: 30
	},
	mosaic: {
		name: 'Mosaic',
		price: 200
	},
	oil: {
		name: 'Oil',
		price: 370,
		imported: true
	},
	paper: {
		name: 'Paper',
		price: 70
	},
	pearls: {
		name: 'Pearls',
		price: 450
	},
	perfume: {
		name: 'Perfume',
		price: 305
	},
	pottery: {
		name: 'Pottery',
		price: 55
	},
	provisions: {
		name: 'Provisions',
		price: 300
	},
	quartz: {
		name: 'Quartz',
		price: 18
	},
	robes: {
		name: 'Robes',
		price: 400
	},
	ropes: {
		name: 'Ropes',
		price: 42
	},
	roses: {
		name: 'Roses',
		price: 70
	},
	salt: {
		name: 'Salt',
		price: 20
	},
	silk: {
		name: 'Silk',
		price: 320
	},
	silver: {
		name: 'Silver',
		price: 300,
		imported: true
	},
	spices: {
		name: 'Spices',
		price: 285
	},
	spyglasses: {
		name: 'Spyglasses',
		price: 280,
		imported: true
	},
	statues: {
		name: 'Statues',
		price: 1200,
		imported: true
	},
	stones: {
		name: 'Stones',
		price: 16
	},
	sugar: {
		name: 'Sugar',
		price: 145
	},
	sugarcane: {
		name: 'Sugarcane',
		price: 120
	},
	sulphur: {
		name: 'Sulphur',
		price: 180
	},
	tools: {
		name: 'Tools',
		price: 35
	},
	wax: {
		name: 'Wax',
		price: 40
	},
	weapons: {
		name: 'Weapons',
		price: 220
	},
	wheat: {
		name: 'Wheat',
		price: 25
	},
	wine: {
		name: 'Wine',
		price: 95
	},
	wood: {
		name: 'Wood',
		price: 17
	},
	woodplanks: {
		name: 'Wood Planks',
		price: 40
	}
};

/**
 * Resources that don't actually use up storage space, they're more ...
 * virtual.
 *
 * @constant
 * @type {Array}
 */
civitas.NON_RESOURCES = [
	'coins', 'fame', 'prestige', 'espionage', 'research', 'faith'
];

/**
 * Resources that will be shown on the main Storage Panel side.
 *
 * @constant
 * @type {Array}
 */
civitas.MAIN_RESOURCES = [
	'beer', 'bread', 'brass', 'brine', 'cannons', 'cattle', 'cider',
	'clay', 'clothes', 'coal', 'copper', 'fish', 'flour', 'furs', 'gold',
	'goldores', 'herbs', 'hides', 'iron', 'ironores', 'meat', 'milk',
	'ropes', 'salt', 'stones', 'weapons', 'wheat', 'wine', 'wood',
	'woodplanks'
];

/**
 * The resources that will be shown on the toolbar.
 * 
 * @constant
 * @type {Array}
 */
civitas.TOOLBAR_RESOURCES = [
	'coins',
	'wood',
	'stones',
	'clay',
	'woodplanks',
	'bread',
	'meat',
	'iron',
	'weapons',
	'tools',
	'gold',
	'brass',
	'salt',
	'coal'
];
