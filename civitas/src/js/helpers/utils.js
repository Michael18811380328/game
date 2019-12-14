/**
 * Utils object.
 */
civitas.utils = {

	/**
	 * Get the total damage points of a hero, modified by the items
	 * he's using.
	 *
	 * @public
	 * @param {Object} hero
	 * @returns {Object}
	 */
	get_damage_points: function(hero) {
		var damage_val = (hero.stats.strength * 2) + hero.stats.agility;
		var damage_min = 0;
		var damage_max = 0;
		for (var i = 0; i < hero.items.length; i++) {
			if (hero.items[i]) {
				if (hero.items[i].stats.strength) {
					damage_val += hero.items[i].stats.strength * 2;
				}
				if (hero.items[i].stats.agility) {
					damage_val += hero.items[i].stats.agility;
				}
			}
		}
		for (var i = 0; i < hero.items.length; i++) {
			if (hero.items[i].type === civitas.ITEM_TYPE_WEAPON) {
				damage_min += hero.items[i].stats.damageMin + damage_val;
				damage_max += hero.items[i].stats.damageMax + damage_val;
			}
		}
		return {
			value: damage_val,
			min: damage_min !== 0 ? damage_min : 1,
			max: damage_max !== 0 ? damage_max : damage_val
		}
	},

	/**
	 * Get the total mana points of a hero, modified by the items
	 * he's using.
	 *
	 * @public
	 * @param {Object} hero
	 * @returns {Number}
	 */
	get_mana_points: function(hero) {
		var mana = hero.stats.intellect * 50 + hero.stats.spirit * 10;
		for (var i = 0; i < hero.items.length; i++) {
			if (hero.items[i]) {
				if (hero.items[i].stats.intellect) {
					mana += hero.items[i].stats.intellect * 50;
				}
				if (hero.items[i].stats.spirit) {
					mana += hero.items[i].stats.spirit * 10;
				}
			}
		}
		return mana;
	},

	/**
	 * Get the total health points of a hero, modified by the items
	 * he's using.
	 *
	 * @public
	 * @param {Object} hero
	 * @returns {Number}
	 */
	get_health_points: function(hero) {
		var health = hero.stats.stamina * 30 + hero.stats.strength * 5;
		for (var i = 0; i < hero.items.length; i++) {
			if (hero.items[i]) {
				if (hero.items[i].stats.stamina) {
					health += hero.items[i].stats.stamina * 30;
				}
				if (hero.items[i].stats.strength) {
					health += hero.items[i].stats.strength * 5;
				}
			}
		}
		return health;
	},

	/**
	 * Check if resource exists.
	 *
	 * @public
	 * @param {String} resource
	 * @returns {Boolean}
	 */
	resource_exists: function(resource) {
		for (var item in civitas.RESOURCES) {
			if (item === resource) {
				return true;
			}
		}
		return false;
	},

	/**
	 * Get the distance between two points.
	 *
	 * @public
	 * @param {Number} source
	 * @param {Number} destination
	 * @returns {Number}
	 */
	get_distance: function(source, destination) {
		return Math.floor(Math.sqrt(Math.pow(destination.x - source.x, 2) + Math.pow(destination.y - source.y, 2)));
	},

	/**
	 * Get the distance between two points in days
	 *
	 * @public
	 * @param {Number} source
	 * @param {Number} destination
	 * @returns {Number}
	 */
	get_distance_in_days: function(source, destination) {
		return Math.floor(Math.sqrt(Math.pow(destination.x - source.x, 2) + Math.pow(destination.y - source.y, 2)) / 10);
	},

	/**
	 * Format a timestamp to a more human form (x ago).
	 *
	 * @public
	 * @param {Number} time
	 * @returns {Number}
	 */
	time_since: function(time) {
		var time_formats = [
			[
				2, 
				"One second", 
				"1 second from now"
			], [
				60, 
				"seconds", 
				1
			], [
				120, 
				"One minute", 
				"1 minute from now"
			], [
				3600, 
				"minutes", 
				60
			], [
				7200, 
				"One hour", 
				"1 hour from now"
			], [
				86400, 
				"hours", 
				3600
			], [
				172800, 
				"One day", 
				"tomorrow"
			], [
				604800, 
				"days", 
				86400
			], [
				1209600, 
				"One week", 
				"next week"
			], [
				2419200, 
				"weeks", 
				604800
			], [
				4838400, 
				"One month", 
				"next month"
			], [
				29030400, 
				"months", 
				2419200
			], [
				58060800, 
				"One year", 
				"next year"
			], [
				2903040000, 
				"years", 
				29030400
			], [
				5806080000, 
				"One century", 
				"next century"
			], [
				58060800000, 
				"centuries", 
				2903040000
			]
		];
		var seconds = (new Date - time) / 1000;
		var list_choice = 1;
		if (seconds < 0) {
			seconds = Math.abs(seconds);
			list_choice = 1;
		}
		var i = 0, format;
		while (format = time_formats[i++]) {
			if (seconds < format[0]) {
				if (typeof format[2] === "string") {
					return format[list_choice];
				} else {
					return Math.floor(seconds / format[2]) + " " + format[1];
				}
			}
		}
		return time;
	},

	/**
	 * Round the number to nearest 10.
	 *
	 * @public
	 * @param {Number} value
	 * @returns {Number}
	 */
	get_up_number: function(value) {
		return Math.floor(value / 10) * 10;
	},

	/**
	 * Return a random number between min and max.
	 *
	 * @public
	 * @param {Number} min
	 * @param {Number} max
	 * @returns {Number}
	 */
	get_random: function(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	/**
	 * Return a random number based on importance.
	 *
	 * @public
	 * @param {Number} importance
	 * @returns {Number}
	 */
	get_random_by_importance: function(importance) {
		return civitas.utils.get_up_number(
			civitas.utils.get_random(
				Math.floor(Math.random() * importance) * 10 + 10,
				Math.floor(Math.random() * importance) * 10 + 20
			)
		);
	},

	/**
	 * Return the resource name by handle.
	 *
	 * @public
	 * @param {String} handle
	 * @returns {String}
	 */
	get_resource_name: function(handle) {
		return civitas.RESOURCES[handle].name;
	},

	/**
	 * Calculate the resource price for the specified amount minus the discount.
	 * 
	 * @param {Number} amount
	 * @param {String} resource
	 * @param {Number} discount
	 * @returns {Number}
	 * @public
	 */
	calc_price_minus_discount: function (amount, resource, discount) {
		return Math.ceil(Math.ceil(civitas.RESOURCES[resource].price - discount) * amount);
	},

	/**
	 * Calculate the resource price for the specified amount.
	 * 
	 * @param {Number} amount
	 * @param {String} resource
	 * @returns {Number}
	 * @public
	 */
	calc_price: function (amount, resource) {
		return Math.ceil(amount * (civitas.RESOURCES[resource].price));
	},

	/**
	 * Calculate the resource price for the specified amount plus the discount.
	 * 
	 * @param {Number} amount
	 * @param {String} resource
	 * @param {Number} discount
	 * @returns {Number}
	 * @public
	 */
	calc_price_plus_discount: function (amount, resource, discount) {
		return Math.ceil(Math.ceil(civitas.RESOURCES[resource].price + discount) * amount);
	},

	/**
	 * Format the current time.
	 * 
	 * @returns {String}
	 * @public
	 */
	get_now: function () {
		var today = new Date();
		var hh = today.getHours();
		var mm = today.getMinutes();
		var ss = today.getSeconds();
		return hh + ':' + mm + ':' + ss;
	},

	/**
	 * Format a number so that it's more user-friendly.
	 *
	 * @returns {String}
	 * @public
	 */
	nice_numbers: function(num) {
		if (num >= 1000000000) {
			return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
		}
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
		}
		if (num >= 1000) {
			return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
		}
		return num;
	},

	/**
	 * Return a random world location.
	 *
	 * @public
	 * @returns {Object}
	 */
	get_random_world_location: function() {
		return {
			x: civitas.utils.get_random(1, civitas.WORLD_SIZE_WIDTH),
			y: civitas.utils.get_random(1, civitas.WORLD_SIZE_HEIGHT)
		}
	},

	/**
	 * Return a random unique array element.
	 *
	 * @public
	 * @param {Array} from
	 * @returns {Mixed}
	 */
	get_random_unique: function(from) {
		var id = civitas.utils.get_random(0, from.length - 1);
		var element = from[id];
		from.splice(id, 1);
		return element;
	},

	sanitize_string: function(string) {
		return string.replace(/[^a-z0-9+]-/gi, '-');
	}
};
