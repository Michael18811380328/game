/**
 * Main Game UI interface.
 */
civitas.ui = {

	/**
	 * Create an item tooltip.
	 *
	 * @public
	 * @param {Object} item
	 * @returns {String}
	 */
	item_tooltip: function(item) {
		var out = '<h4 style="color: ' + civitas.ITEM_QUALITY_COLORS[item.quality] + '">' + item.name + '</h4>';
		if (item.flavour) {
			out += '<span class="flavour">"' + item.flavour + '"</span>' + ' <br />';
		}
		out += civitas.l('Slot') + ': ' + civitas.ITEM_SLOTS_LIST[item.slot] + ' <br />';
		if (item.type === civitas.ITEM_TYPE_WEAPON) {
			out += civitas.l('Damage') + ': <span class="red">' + item.stats.damageMin + '-' + item.stats.damageMax + '</span><br />' + civitas.l('Speed') + ': ' + item.stats.speed + '<br />';
		} else {
			out += civitas.l('Armor') + ': ' + item.stats.armor + '<br />';
		}
		if (item.stats.strength) {
			out += civitas.l('Strength') + ': <span class="green">+' + item.stats.strength + '</span><br />';
		}
		if (item.stats.stamina) {
			out += civitas.l('Stamina') + ': <span class="green">+' + item.stats.stamina + '</span><br />';
		}
		if (item.stats.agility) {
			out += civitas.l('Agility') + ': <span class="green">+' + item.stats.agility + '</span><br />';
		}
		if (item.stats.intellect) {
			out += civitas.l('Intellect') + ': <span class="green">+' + item.stats.intellect + '</span><br />';
		}
		if (item.stats.spirit) {
			out += civitas.l('Spirit') + ': <span class="green">+' + item.stats.spirit + '</span><br />';
		}
		out += civitas.l('Type') + ': <span style="color: ' + civitas.ITEM_QUALITY_COLORS[item.quality] + '">' + civitas.ITEM_QUALITY_LIST[item.quality] + '</span>';
		return out;
	},

	/**
	 * Build the About section of the UI.
	 *
	 * @public
	 * @returns {String}
	 */
	window_about_section: function() {
		var out = '<a href="#" class="do-about button">' + civitas.l('About') + '</a>' +
			'<div class="about-game">' +
				'<a class="github" target="_blank" href="https://github.com/sizeofcat/civitas"><img class="tips" title="' + civitas.l('Visit the project page on GitHub') + '" src="' + civitas.ASSETS_URL + '/images/ui/github.png" /></a>' +
				'<p>' + civitas.l('Civitas is written by <a target="_blank" href="https://sizeof.cat">sizeof(cat)</a>.') + '</p>' +
				'<p>' + civitas.l('Big thanks to') + ':</p>' +
				'<ul>' +
					'<li><a target="_blank" href="https://soundcloud.com/shantifax">Shantifax</a> for the music (Glandula Pinealis).</li>' +
					'<li><a target="_blank" href="http://bluebyte.com">Blue Byte</a> for Anno 1404.</li>' +
				'</ul>' +
			'</div>';
		return out;
	},

	/**
	 * Generate a generic panel template.
	 *
	 * @public
	 * @param {String} title
	 * @returns {String}
	 */
	generic_panel_template: function(title) {
		if (typeof title === 'undefined') {
			title = '';
		}
		var out = '<div id="panel-{ID}" class="panel">' +
			'<header>' + title +
				'<a class="tips close" title="' + civitas.l('Close') + '"></a>' +
			'</header>' +
			'<section></section>' +
		'</div>';
		return out;
	},

	building_panel_template: function(title) {
		if (typeof title === 'undefined') {
			title = '';
		}
		var out = '<div id="panel-{ID}" class="panel">' +
			'<header>' + title +
				'<a class="tips close" title="' + civitas.l('Close') + '"></a>' +
			'</header>' +
			'<section></section>' +
			'<footer>' +
				'<a class="tips demolish" title="' + civitas.l('Demolish this building') + '" href="#"></a>' +
				'<a class="tips pause start" href="#"></a>' +
				'<a class="tips upgrade" title="' + civitas.l('Upgrade building') + '" href="#"></a>' +
				'<a class="tips downgrade" title="' + civitas.l('Downgrade building') + '" href="#"></a>' +
			'</footer>' +
		'</div>';
		return out;
	},

	building_panel: function (params, level) {
		if (typeof params.levels === 'undefined') {
			params.levels = 1;
		}
		var building_image = params.handle;
		if (params.handle.slice(0, 5) === 'house') {
			building_image = params.handle.slice(0, 5);
		}
		var image = (typeof params.visible_upgrades === 'undefined' || 
			params.visible_upgrades === false) ? building_image: building_image + params.level;
		var out = '<div class="column">' +
			'<img src="' + civitas.ASSETS_URL + 'images/assets/buildings/' + image + '_large.png" />' +
		'</div>' +
		'<div class="column">' +
			'<p>' + params.description + '</p>' +
			'<dl>' +
				civitas.ui.level_panel(params.level, level, params.levels) +
				civitas.ui.cost_panel(params.cost, level, params.levels) +
				civitas.ui.materials_panel(params.materials) +
				civitas.ui.production_panel(params.production, level) +
				civitas.ui.requires_panel(params.requires) +
				civitas.ui.chance_panel(params.chance, level) +
				civitas.ui.tax_panel(params.tax, level) +
				civitas.ui.storage_panel(params.storage, level) +
			'</dl>' +
		'</div>'; 
		return out;
	},

	normal_panel: function (section, contents) {
		var out = '<fieldset>' +
				'<legend>' + section + '</legend>' +
				contents +
			'</fieldset>';
		return out;
	},

	level_panel: function (level, new_level, max_level) {
		var out = '<dt>' + civitas.l('Level') + '</dt>' +
			'<dd>' + new_level + ' / ' + max_level + ' </dd>';
		return out;
	},

	cost_panel: function (costs, level, levels) {
		var out = '';
		if (typeof costs !== 'undefined') {
			out += '<dt>' + civitas.l('Cost') + '</dt>';
			for (var item in costs) {
				out += '<dd>' + civitas.utils.nice_numbers(costs[item]) + civitas.ui.resource_small_img(item) + (typeof levels !== 'undefined' && level < levels ? ' / ' + civitas.utils.nice_numbers(costs[item] * (level + 1)) + civitas.ui.resource_small_img(item) : '') + '</dd>';
			}
		}
		return out;
	},

	progress: function(value, progress_type, show_value) {
		if (typeof progress_type === 'undefined') {
			progress_type = 'small';
		}
		var _e = '';
		if (value < 10) {
			_e = ' ubad';
		} else if (value >= 10 && value < 30) {
			_e = ' vbad';
		} else if (value >= 30 && value < 40) {
			_e = ' bad';
		} else if (value >= 40 && value < 60) {
			_e = ' good';
		} else if (value >= 60 && value < 90) {
			_e = ' vgood';
		} else if (value >= 90) {
			_e = ' ugood';
		}
		return '<div class="progress ' + progress_type + '">' +
			'<div class="bar' + _e + '" style="width:' + value + '%">' +
				'<p>' + (typeof show_value !== 'undefined' ? show_value : value) + '</p>' +
			'</div>' +
		'</div>';
	},

	navy_img: function (name) {
		return '<img class="tips" title="' + civitas.SHIPS[name].name + '" src="' + civitas.ASSETS_URL + 'images/assets/army/' + name.toLowerCase().replace(/ /g,"_") + '_small.png" />';
	},

	army_img: function (name) {
		return '<img class="tips" title="' + civitas.SOLDIERS[name].name + '" src="' + civitas.ASSETS_URL + 'images/assets/army/' + name.toLowerCase().replace(/ /g,"_") + '_small.png" />';
	},

	army_list: function (army, no_margin) {
		var out2 = '<p>' + civitas.l('There are no soldiers in this army.') + '</p>';
		var out = '<dl' + ((typeof no_margin !== 'undefined' && no_margin === true) ? ' class="nomg"' : '') + '>';
		var total = 0;
		for (var soldier in army) {
			if (army[soldier] > 0) {
				out += '<dt>' + army[soldier] + '</dt>' + '<dd>' + civitas.ui.army_img(soldier) + '</dd>';
				total += army[soldier];
			}
		}
		out += '<dt>' + total + '</dt>' +
				'<dd>' + civitas.l('Total') + '</dd>' +
			'</dl>';
		if (total > 0) {
			return out;
		} else {
			return out2;
		}
	},

	/**
	 * Check if a window exists and is opened.
	 * 
	 * @param {String} id
	 * @public
	 * @returns {Boolean}
	 */
	window_exists: function (id) {
		if ($(id).length == 0) {
			return false;
		}
		return true;
	},

	/**
	 * Check if a panel exists and is opened.
	 * 
	 * @param {String} id
	 * @public
	 * @returns {Boolean}
	 */
	panel_exists: function (id) {
		if ($(id).length == 0) {
			return false;
		}
		return true;
	},

	panel_btn: function (text, title, handle, class_name, disabled) {
		return '<a title="' + title + '" data-handle="' + handle + '" class="tips ' + class_name + (disabled === true ? ' disabled' : '') + '" href="#">' + text + '</a></td>';
	},

	trades_list: function (trades, mode) {
		mode = (typeof mode === 'undefined' || mode === 'imports') ? 'imports' : 'exports';
		var out = '';
		if (trades !== null) {
			var trade = trades[mode];
			for (var item in trade) {
				if (trade[item] > 0) {
					out += civitas.ui.resource_storage_small_el(item, trade[item]);
				}
			}
		}
		return out;
	},

	navy_list: function (army, no_margin) {
		var out2 = '<p>' + civitas.l('There are no ships in this navy.') + '</p>';
		var out = '<dl' + ((typeof no_margin !== 'undefined' && no_margin === true) ? ' class="nomg"' : '') + '>';
		var total = 0;
		for (var ship in army) {
			if (army[ship] > 0) {
				out += '<dt>' + army[ship] + '</dt>' + '<dd>' + civitas.ui.navy_img(ship) + '</dd>';
				total += army[ship];
			}
		}
		out += '<dt>' + total + '</dt>' +
				'<dd>' + civitas.l('Total') + '</dd>' +
			'</dl>';
		if (total > 0) {
			return out;
		} else {
			return out2;
		}
	},

	building_element: function (params) {
		var building_image = params.type;
		var description = '<br /><span class="smalldesc">' + params.data.description + '</span>';
		if (params.type.slice(0, 5) === 'house') {
			building_image = params.type.slice(0, 5);
		}
		var image = (typeof params.data.visible_upgrades === 'undefined' || params.data.visible_upgrades === false) ? building_image : building_image + params.data.level;
		return '<div data-type="' + params.type + '" data-level="' + params.data.level + '" ' + 'style="background:transparent url(' + civitas.ASSETS_URL + 'images/assets/buildings/' + image + '.png) no-repeat;left:' + params.data.position.x + 'px;top:' + params.data.position.y + 'px" title=\'' + params.data.name + '\' ' + 'id="building-' + params.data.handle + '"' + 'class="tips building' + (params.data.large === true ? ' large' : '') + (params.data.extralarge === true ? ' extralarge' : '') + '"></div>';
	},

	resource_storage_small_el: function (resource, amount) {
		return '<div class="tips storage-item small" title="' + civitas.utils.get_resource_name(resource) + '"><img src="' + civitas.ASSETS_URL + 'images/assets/resources/' + resource + '_small.png" /><span class="amount">' + amount + '</span></div>';
	},

	resource_storage_el: function (resource, amount) {
		return '<div class="storage-item"><span class="title">' + civitas.utils.get_resource_name(resource) + '</span><img src="' + civitas.ASSETS_URL + 'images/assets/resources/' +  resource + '.png" /><span class="amount">' + amount + '</span></div>';
	},

	tabs: function (data) {
		var out = '<div class="tabs">' +
				'<ul>';
		for (var i = 0; i < data.length; i++) {
			out += '<li><a href="#tab-' + data[i].toLowerCase().replace(/ /g, "-") + '">' + data[i] + '</a></li>';
		}
		out += '</ul>';
		for (var i = 0; i < data.length; i++) {
			out += '<div id="tab-' + data[i].toLowerCase().replace(/ /g, "-") + '"></div>';
		}
		out += '</div>';
		return out;
	},

	materials_panel: function (materials) {
		var out = '';
		if (typeof materials !== 'undefined') {
			out += '<dt>' + civitas.l('Uses') + '</dt>';
			for (var item in materials) {
				out += '<dd>' + materials[item] + civitas.ui.resource_small_img(item) + '</dd>';
			}
		}
		return out;
	},

	chance_panel: function (materials, level) {
		var out = '';
		if (typeof materials !== 'undefined') {
			out += '<dt>' + civitas.l('Extra materials') + '</dt>';
			for (var item in materials) {
				out += '<dd>' + (level * materials[item]).toFixed(4) * 100 + '%' + civitas.ui.resource_small_img(item) + '</dd>';
			}
		}
		return out;
	},

	production_panel: function (materials, level) {
		var out = '';
		if (typeof materials !== 'undefined') {
			out += '<dt>' + civitas.l('Produces') + '</dt>';
			for (var item in materials) {
				out += '<dd>' + (level * materials[item]) + civitas.ui.resource_small_img(item) + '</dd>';
			}
		}
		return out;
	},

	requires_panel: function (requires) {
		var out = '';
		if (typeof requires.buildings !== 'undefined' || typeof requires.settlement_level !== 'undefined') {
			out += '<dt>' + civitas.l('Requires') + '</dt>';
			out += '<dd>';
			if (typeof requires.buildings !== 'undefined') {
				for (var item in requires.buildings) {
					var b = civitas.BUILDINGS[civitas.BUILDINGS.findIndexM(item)];
					out += b.name + ' level ' + requires.buildings[item] + '<br />'
				}
			}
			if (typeof requires.settlement_level !== 'undefined') {
				out += civitas.l('City level') + ' ' + requires.settlement_level;
			}
			out += '</dd>';
		}
		return out;
	},

	tax_panel: function (tax, level) {
		var out = '';
		if (typeof tax !== 'undefined') {
			out += '<dt>' + civitas.l('Tax') + '</dt>';
			out += '<dd>' + (level * tax) + civitas.ui.resource_small_img('coins') + '</dd>';
		}
		return out;
	},

	storage_panel: function (storage, level) {
		var out = '';
		if (typeof storage !== 'undefined') {
			out += '<dt>' + civitas.l('Storage') + '</dt>';
			out += '<dd>' + (level * storage) + '<img alt="Storage space" class="tips" title="' + civitas.l('Storage Space') + '" src="' + civitas.ASSETS_URL + 'images/assets/resources/storage_small.png" /></dd>';
		}
		return out;
	},

	resource_small_img: function (resource) {
		return '<img alt="' + civitas.utils.get_resource_name(resource) + '" class="tips" title="' + civitas.utils.get_resource_name(resource) + '" src="' + civitas.ASSETS_URL + 'images/assets/resources/' + resource + '_small.png" />';
	}
};
