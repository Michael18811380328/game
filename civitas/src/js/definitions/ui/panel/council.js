/**
 * City Council panel data.
 *
 * @type {Object}
 */
civitas.PANEL_COUNCIL = {
	template: civitas.ui.generic_panel_template(civitas.l('City Council')),
	id: 'council',
	on_show: function(params) {
		var core = this.core();
		$(this.handle + ' section').append(civitas.ui.tabs([civitas.l('Info'), 
			civitas.l('Tips'), civitas.l('Production'), civitas.l('Housing'), 
			civitas.l('Municipal'), civitas.l('Mercenary'), civitas.l('Achievements')]));
		var _t = '<div class="achievements-list">';
		for (var i = 0; i < civitas.ACHIEVEMENTS.length; i++) {
			_t += '<div data-id="' + civitas.ACHIEVEMENTS[i].id + '" class="achievement">' +
				'<div class="left">' +
					'<div class="ach img"></div>' +
					'<div class="ach points">' + civitas.ACHIEVEMENTS[i].points + '</div>' +
				'</div>' +
				'<div class="right">' +
					'<div class="inner">' +
						'<h2>' + civitas.ACHIEVEMENTS[i].name + '</h2>' +
						civitas.ACHIEVEMENTS[i].description +
					'</div>' +
					'<div class="time"></div>' +
				'</div>' +
			'</div>';
		}
		_t += '</div>';
		$(this.handle + ' #tab-achievements').empty().append(_t);
		$(this.handle).on('click', '.view-merc', function () {
			var _army = parseInt($(this).data('id'));
			var data = civitas.MERCENARIES[_army];
			core.open_panel(civitas.PANEL_ARMY, data);
			return false;
		}).on('click', '.raid-merc', function () {
			var _army = parseInt($(this).data('id'));
			core.error('Not implemented yet.');
			return false;
		}).on('click', '.disband-merc', function () {
			core.open_modal(
				function(button) {
					if (button === 'yes') {
						var _army = parseInt($(this).data('id'));
						core.get_settlement().release_mercenary(_army);
						core.save_and_refresh();
					}
				},
				'Are you sure you want to release this mercenary army? You won`t be able to use them anymore!'
			);
			return false;
		}).on('click', '.building-info', function() {
			var handle = $(this).data('handle');
			var panel = civitas['PANEL_' + handle.toUpperCase()];
			var building_data = core.get_building_config_data(handle);
			if (handle && building_data) {
				if (typeof panel !== 'undefined') {
					core.open_panel(panel, building_data);
				} else {
					core.open_panel(civitas.PANEL_BUILDING, building_data);
				}
			}
			return false;
		}).on('click', '.pause', function () {
			var handle = $(this).data('handle');
			var building = core.get_settlement().get_building(handle);
			if (building && building.stop_production()) {
				$(this).removeClass('pause').addClass('start');
				$(this).attr('title', civitas.l('Start production'));
			}
			return false;
		}).on('click', '.start', function () {
			var handle = $(this).data('handle');
			var building = core.get_settlement().get_building(handle);
			if (building && building.start_production()) {
				$(this).removeClass('start').addClass('pause');
				$(this).attr('title', civitas.l('Stop production'));
			}
			return false;
		});
	},
	on_refresh: function() {
		var core = this.core();
		var settlement = core.get_settlement();
		var settlements = core.get_settlements();
		var buildings = settlement.get_buildings();
		var resources = settlement.get_resources();
		var achievements = core.achievements();
		var advices = settlement.city_council();
		var total_costs = 0;
		var total_tax = 0;
		var army_data;
		var achievement_data;
		var building_data;
		var _z = '';
		var total_benefits = {
			fame: 0,
			espionage: 0,
			research: 0,
			faith: 0
		}
		var mercenary = settlement.mercenary();
		var _t = '<p>' + civitas.l('Mercenary armies are available to hire for a fixed price, they do not cost additional resources but they are only available for raiding and campaign missions, they do not participate in the defense of your city.') + '</p>' +
			'<p>' + civitas.l('Also, keep in mind that once a mercenary army is hired, they are at your disposal until the end of the current year.') + '</p>' +
			'<div class="hired-mercenaries-list">';
		if (mercenary.length > 0) {
			_t += '<table class="normal">';
			for (var i = 0; i < mercenary.length; i++) {
				army_data = civitas.MERCENARIES[mercenary[i].id];
				_t += '<tr>' +
						'<td class="icon">' +
							'<img src="' + civitas.ASSETS_URL + 'images/assets/emblems/' + 
								army_data.icon + '.png" />' +
						'</td>' +
						'<td>' +
							'<p class="title">' + army_data.name + '</p>' +
							'<p class="description">' + army_data.description + '</p>' +
						'</td>' +
						'<td class="large">' +
							'<a title="' + civitas.l('View info on this mercenary army.') + 
							'" data-id="' + mercenary[i].id + 
							'" class="tips view-merc" href="#">' + civitas.l('view') +
							'</a> ' +
							'<a title="' + civitas.l('Send this mercenary army on a raiding ' +
							'mission towards a specific settlement.') + '" data-id="' + i + 
							'" class="tips raid-merc" href="#">' + civitas.l('raid') + '</a> ' +
							'<a title="' + civitas.l('Disband this mercenary army? They will ' +
							'be available for hire later when you need them.') + '" data-id="' + 
							i + '" class="tips disband-merc" href="#">' + civitas.l('release') + 
							'</a>' +
						'</td>' +
					'</tr>';

			}
			_t += '</table>';
		} else {
			_t += '<p>' + civitas.l('You have no mercenary armies hired for your city. Go to the World Market Trades and hire one.') + '</p>';
		}
		_t += '</div>';
		$(this.handle + ' #tab-mercenary').empty().append(_t);
		for (var f = 0; f < achievements.length; f++) {
			if (typeof achievements[f] !== 'undefined') {
				$(this.handle + ' .achievement[data-id=' + achievements[f].id + ']').addClass('has');
				$(this.handle + ' .achievement[data-id=' + achievements[f].id + '] .time')
					/*.attr("title", achievements[f].date)*/
					.html('<strong>' + civitas.utils.time_since(achievements[f].date) + '</strong> ' + civitas.l('ago'));
			}
		}
		_t = '<img class="avatar" src="' + civitas.ASSETS_URL + 'images/assets/avatars/avatar' + 
			settlement.ruler().avatar + '.png" />' +
				'<dl>' +
				'<dt>' + civitas.l('Current date') + '</dt><dd class="citydate">' + core.format_date() + '</dd>' +
				'<dt>' + civitas.l('Ruler') + '</dt><dd>' + settlement.ruler().name + '</dd>' +
				'<dt>' + civitas.l('Climate') + '</dt><dd>' + settlement.climate().name + '</dd>' +
				'<dt>' + civitas.l('Personality') + '</dt><dd>' + settlement.personality().name + '</dd>' +
				'<dt>' + civitas.l('Nationality') + '</dt><dd>' + settlement.nationality().name + '</dd>' +
				'<dt>' + civitas.l('Population') + '</dt><dd>' + civitas.utils.nice_numbers(settlement.population()) + '</dd>' +
				'<dt>' + civitas.l('Achievement Points') + '</dt><dd>' + core.achievement_points() + '</dd>' +
				'<dt>' + civitas.l('Religion') + '</dt><dd>' + settlement.religion().name + '</dd>' +
				'<dt>' + civitas.l('Level') + '</dt><dd>' + civitas.ui.progress((settlement.level() * 100) / civitas.MAX_SETTLEMENT_LEVEL, 'small', settlement.level()) + '</dd>' +
				'<dt>' + civitas.l('Fame') + '</dt><dd>' + civitas.ui.progress((settlement.fame() * 100) / civitas.LEVELS[settlement.level()], 'small', civitas.utils.nice_numbers(settlement.fame()) + ' / ' + civitas.utils.nice_numbers(civitas.LEVELS[settlement.level()])) + '</dd>' +
				'<dt>' + civitas.l('Prestige') + '</dt><dd>' + civitas.ui.progress((settlement.prestige() * 100) / civitas.MAX_PRESTIGE_VALUE, 'small', settlement.prestige()) + '</dd>' +
				'<dt>' + civitas.l('Espionage') + '</dt><dd>' + civitas.ui.progress((settlement.espionage() * 100) / civitas.MAX_ESPIONAGE_VALUE, 'small', settlement.espionage()) + '</dd>' +
				'<dt>' + civitas.l('Faith') + '</dt><dd>' + civitas.ui.progress((settlement.faith() * 100) / civitas.MAX_FAITH_VALUE, 'small', settlement.faith()) + '</dd>' +
				'<dt>' + civitas.l('Research') + '</dt><dd>' + civitas.ui.progress((settlement.research() * 100) / civitas.MAX_RESEARCH_VALUE, 'small', settlement.research()) + '</dd>' +
			'</dl>';
		$(this.handle + ' #tab-info').empty().append(_t);
		_t = '';
		if (advices.length > 0) {
			_t += '<ul class="advices">';
			for (var z = 0; z < advices.length; z++) {
				_t += '<li>' + advices[z] + '</li>';
			}
			_t += '</ul>';
		}
		$(this.handle + ' #tab-tips').empty().append(_t);
		_t = '<table class="normal">' +
			'<thead>' +
				'<tr>' +
					'<td></td>' +
					'<td class="tips center" title="' + civitas.l('Current level / Maximum level') +
					'">' + civitas.l('Level') + '</td>' +
					'<td>' + civitas.l('Raises') + '</td>' +
					'<td>' + civitas.l('Uses') + '</td>' +
				'</tr>' +
			'</thead>';
		for (var l = 0; l < buildings.length; l++) {
			if (buildings[l].is_municipal_building()) {
				building_data = buildings[l].get_building_data();
				_t += '<tr' + ((buildings[l].has_problems() === false) ? '' : ' class="notify"') +'>' +
					'<td><a href="#" class="building-info" data-handle="' + buildings[l].get_handle() + '">' + buildings[l].get_name() + '</a></td>' +
					'<td class="center">' + buildings[l].get_level() + ' / ' + (typeof building_data.levels !== 'undefined' ? building_data.levels : 1) + '</td>' +
					'<td>';
					if (building_data.production) {
						for (var item in building_data.production) {
							total_benefits[item] += (buildings[l].has_problems() === false) ? buildings[l].get_level() * building_data.production[item] : 0;
							_t += ' +' + buildings[l].get_level() * building_data.production[item] + ' ' + civitas.ui.resource_small_img(item);
						}
					}
				_t += '</td>' +
					'<td>';
					if (building_data.materials) {
						for (var item in building_data.materials) {
							total_costs += (buildings[l].has_problems() === false) ? building_data.materials[item] : 0;
							_t += ' -' + building_data.materials[item] + ' ' + civitas.ui.resource_small_img(item);
						}
					}
				_t += '</td>' +
				'</tr>';
			}
		}
		for (var item in total_benefits) {
			if (total_benefits[item] > 0) {
				_z += ' +' + total_benefits[item] + ' ' + civitas.ui.resource_small_img(item);
			}
		}
		_t += '<tfoot>' +
					'<tr>' +
						'<td>' + civitas.l('Total') + '</td>' +
						'<td></td>' +
						'<td>' + _z + '</td>' +
						'<td>' + (total_costs > 0 ? '-' : '') + total_costs + ' ' + civitas.ui.resource_small_img('coins') + '</td>' +
					'</tr>' +
				'</tfoot>' +
			'</table>';
		$(this.handle + ' #tab-municipal').empty().append(_t);
		_t = '<table class="normal">' +
			'<thead>' +
				'<tr>' +
					'<td></td>' +
					'<td class="tips center" title="' + civitas.l('Current level / Maximum level') + '">' + civitas.l('Level') + '</td>' +
					'<td>' + civitas.l('Tax') + '</td>' +
					'<td>' + civitas.l('Materials') + '</td>' +
				'</tr>' +
			'</thead>';
		for (var l = 0; l < buildings.length; l++) {
			if (buildings[l].is_housing_building()) {
				building_data = buildings[l].get_building_data();
				_t += '<tr' + ((buildings[l].has_problems() === false) ? '' : ' class="notify"') +'>' +
					'<td><a href="#" class="building-info" data-handle="' + buildings[l].get_handle() + '">' + buildings[l].get_name() + '</a></td>' +
					'<td class="center">' + buildings[l].get_level() + ' / ' + (typeof building_data.levels !== 'undefined' ? building_data.levels : 1) + '</td>' +
					'<td>';
					if (building_data.tax) {
						total_tax += (buildings[l].has_problems() === false) ? buildings[l].get_level() * building_data.tax : 0;
						_t += ' +' + buildings[l].get_level() * building_data.tax + ' ' + civitas.ui.resource_small_img('coins');
					}
				_t += '</td>' +
					'<td>';
					if (building_data.materials) {
						for (var item in building_data.materials) {
							_t += ' -' + building_data.materials[item] + ' ' + civitas.ui.resource_small_img(item);
						}
					}
				_t += '</td>' +
				'</tr>';
			}
		}
		_t += '<tfoot>' +
					'<tr>' +
						'<td>' + civitas.l('Income') + '</td>' +
						'<td></td>' +
						'<td>+' + total_tax + ' ' + civitas.ui.resource_small_img('coins') + '</td>' +
						'<td></td>' +
					'</tr>' +
				'</tfoot>' +
			'</table>';
		$(this.handle + ' #tab-housing').empty().append(_t);
		_t = '<table class="normal">' +
			'<thead>' +
				'<tr>' +
					'<td></td>' +
					'<td class="tips center" title="' + civitas.l('Current level / Maximum level') + '">' + civitas.l('Level') + '</td>' +
					'<td>' + civitas.l('Production') + '</td>' +
					'<td>' + civitas.l('Materials') + '</td>' +
					'<td></td>' +
				'</tr>' +
			'</thead>';
		for (var l = 0; l < buildings.length; l++) {
			if (buildings[l].is_production_building() && buildings[l].is_municipal_building() === false) {
				building_data = buildings[l].get_building_data();
				_t += '<tr' + ((buildings[l].has_problems() === false) ? '' : ' class="notify"') +'>' +
					'<td><a href="#" class="building-info" data-handle="' + buildings[l].get_handle() + '">' + buildings[l].get_name() + '</a></td>' +
					'<td class="center">' + buildings[l].get_level() + ' / ' + (typeof building_data.levels !== 'undefined' ? building_data.levels : 1) + '</td>' +
					'<td>';
					if (building_data.production) {
						for (var item in building_data.production) {
							_t += ' +' + buildings[l].get_level() * building_data.production[item] + ' ' + civitas.ui.resource_small_img(item);
						}
					}
				_t += '</td>' +
					'<td>';
					if (building_data.materials) {
						for (var item in building_data.materials) {
							_t += ' -' + building_data.materials[item] + ' ' + civitas.ui.resource_small_img(item);
						}
					}
				_t += '</td>' +
					'<td class="center">' + 
						'<a title="' + (!buildings[l].is_stopped() ? civitas.l('Stop production') : civitas.l('Start production')) + '" data-handle="' + buildings[l].get_handle() + '" class="tips ' + (!buildings[l].is_stopped() ? 'pause' : 'start') + ' btn" href="#"></a>' +
					'</td>' +
				'</tr>';
			}
		}
		_t += '<tfoot>' +
					'<tr>' +
						'<td></td>' +
						'<td class="center">' + civitas.l('Level') + '</td>' +
						'<td>' + civitas.l('Production') + '</td>' +
						'<td>' + civitas.l('Materials') + '</td>' +
						'<td></td>' +
					'</tr>' +
				'</tfoot>' +
			'</table>';
		$(this.handle + ' #tab-production').empty().append(_t);
	}
};
