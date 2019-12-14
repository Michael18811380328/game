/**
 * Settlement panel data.
 *
 * @type {Object}
 */
civitas.PANEL_SETTLEMENT = {
	template: '' +
		'<div id="panel-{ID}" class="panel">' +
			'<header>' +
				'<a class="tips close" title="' + civitas.l('Close') + '"></a>' +
			'</header>' +
			'<section></section>' +
			'<footer>' +
				'<a class="tips attack" title="' + civitas.l('Attack this settlement.') + '" href="#"></a>' +
				'<a class="tips caravan" title="' + civitas.l('Send a caravan to this settlement.') + '" href="#"></a>' +
				'<a class="tips spy" title="' + civitas.l('Send a spy to this settlement.') + '" href="#"></a>' +
				'<a class="tips alliance" title="' + civitas.l('Propose an alliance to this settlement.') + '" href="#"></a>' +
				'<a class="tips pact" title="' + civitas.l('Propose a pact to this settlement.') + '" href="#"></a>' +
				'<a class="tips ceasefire" title="' + civitas.l('Propose a cease fire to this settlement.') + '" href="#"></a>' +
				'<a class="tips join" title="' + civitas.l('Ask this settlement to join your city.') + '" href="#"></a>' +
				'<a class="tips war" title="' + civitas.l('Declare war to this settlement.') + '" href="#"></a>' +
			'</footer>' +
		'</div>',
	params_data: null,
	id: 'settlement',
	on_show: function(params) {
		var self = this;
		var core = this.core();
		var my_settlement = core.get_settlement();
		var settlement = params.data;
		var settlement_type = settlement.get_type();
		this.params_data = params;
		var trades = settlement.get_trades();
		var settlement_type_title;
		if (settlement.is_city()) {
			settlement_type_title = civitas.l('City of') + ' ' + settlement.name();
		} else if (settlement.is_metropolis()) {
			settlement_type_title = civitas.l('Metropolis of') + ' ' + settlement.name();
		} else {
			settlement_type_title = civitas.l('Village of') + ' ' + settlement.name();
		}
		var location = civitas['SETTLEMENT_LOCATION_' + my_settlement.climate().name.toUpperCase()];
		$(this.handle + ' header').append(settlement_type_title);
		if (settlement.is_city() || settlement.is_metropolis()) {
			$(this.handle + ' section').append(civitas.ui.tabs([civitas.l('Info'), civitas.l('Army'), civitas.l('Navy'), civitas.l('Resources'), civitas.l('Imports'), civitas.l('Exports')]));
		} else {
			$(this.handle + ' section').append(civitas.ui.tabs([civitas.l('Info'), civitas.l('Army'), civitas.l('Navy'), civitas.l('Resources')]));
		}
		$(this.handle).on('click', '.alliance', function () {
			if (!my_settlement.can_diplomacy()) {
				core.error(civitas.l('You will need to construct an Embassy before being able to propose an alliance to other settlements.'));
				return false;
			}
			core.open_modal(
				function(button) {
					if (button === 'yes') {
						if (!core.add_to_queue(my_settlement, settlement, civitas.ACTION_DIPLOMACY,
							civitas.DIPLOMACY_PROPOSE_ALLIANCE, {})) {
							core.error(civitas.l('There was an error proposing an alliance to this settlement, check the data you entered and try again.'));
							return false;
						}
						core.achievement(53);
					}
				},
				'Are you sure you want to propose an alliance to this settlement?'
			);
			return false;
		}).on('click', '.join', function () {
			if (!my_settlement.can_diplomacy()) {
				core.error(civitas.l('You will need to construct an Embassy before being able to ask other settlements to join your city.'));
				return false;
			}
			core.open_modal(
				function(button) {
					if (button === 'yes') {
						if (!core.add_to_queue(my_settlement, settlement, civitas.ACTION_DIPLOMACY,
							civitas.DIPLOMACY_PROPOSE_JOIN, {})) {
							core.error(civitas.l('There was an error proposing this settlement to join your city, check the data you entered and try again.'));
							return false;
						}
						core.achievement(51);
					}
				},
				'Are you sure you want to propose this this settlement to join you?'
			);
			return false;
		}).on('click', '.pact', function () {
			if (!my_settlement.can_diplomacy()) {
				core.error(civitas.l('You will need to construct an Embassy before being able to propose a pact to other settlements.'));
				return false;
			}
			core.open_modal(
				function(button) {
					if (button === 'yes') {
						if (!core.add_to_queue(my_settlement, settlement, civitas.ACTION_DIPLOMACY,
							civitas.DIPLOMACY_PROPOSE_PACT, {})) {
							core.error(civitas.l('There was an error proposing a pact to this settlement, check the data you entered and try again.'));
							return false;
						}
						core.achievement(52);
					}
				},
				'Are you sure you want to propose a pact to this settlement?'
			);
			return false;
		}).on('click', '.ceasefire', function () {
			if (!my_settlement.can_diplomacy()) {
				core.error(civitas.l('You will need to construct an Embassy before being able to propose a cease fire to other settlements.'));
				return false;
			}
			core.open_modal(
				function(button) {
					if (button === 'yes') {
						if (!core.add_to_queue(my_settlement, settlement, civitas.ACTION_DIPLOMACY,
							civitas.DIPLOMACY_PROPOSE_CEASE_FIRE, {})) {
							core.error(civitas.l('There was an error proposing a cease fire to this settlement, check the data you entered and try again.'));
							return false;
						}
					}
				},
				'Are you sure you want to propose a cease fire to this settlement?'
			);
			return false;
		}).on('click', '.war', function () {
			if (!my_settlement.can_diplomacy()) {
				core.error(civitas.l('You will need to construct an Embassy before being able to declare war to other settlements.'));
				return false;
			}
			core.open_modal(
				function(button) {
					if (button === 'yes') {
						my_settlement.diplomacy(settlement.id(), civitas.DIPLOMACY_WAR);
					}
				},
				'Are you sure you want to declare war to this settlement?<br /><br />You will lose all influence over ' + settlement.name() + ' and the settlement might retaliate back!'
			);
			return false;
		}).on('click', '.caravan', function () {
			if (!my_settlement.can_trade()) {
				core.error(civitas.l('You will need to construct a Trading Post before being able to trade resources with other settlements.'));
				return false;
			}
			core.open_panel(civitas.PANEL_NEW_CARAVAN, settlement);
			return false;
		}).on('click', '.spy', function () {
			if (!my_settlement.can_diplomacy()) {
				core.error(civitas.l('You will need to construct an Embassy before being able to send spies to other settlements.'));
				return false;
			}
			core.open_panel(civitas.PANEL_NEW_SPY, settlement);
			return false;
		}).on('click', '.attack', function () {
			if (!my_settlement.can_recruit_soldiers()) {
				core.error(civitas.l('You will need to construct a Military Camp before being able to attack other settlements.'));
				return false;
			}
			core.open_panel(civitas.PANEL_NEW_ARMY, settlement);
			return false;
		});
	},
	on_refresh: function() {
		var self = this;
		var core = this.core();
		var my_settlement = core.get_settlement();
		var settlement = this.params_data.data;
		var settlement_type = settlement.get_type();
		var trades = settlement.get_trades();
		var _status = my_settlement.get_diplomacy_status(settlement.id());
		var location = civitas['SETTLEMENT_LOCATION_' + my_settlement.climate().name.toUpperCase()];
		$(this.handle + ' #tab-info').empty().append('' +
			'<img class="avatar" src="' + civitas.ASSETS_URL + 'images/assets/avatars/avatar' +
			settlement.ruler().avatar + '.png" />' +
			'<dl>' +
				'<dt>' + settlement.ruler().title + '</dt><dd>' + settlement.ruler().name + '</dd>' +
				'<dt>' + civitas.l('Climate') + '</dt><dd>' + settlement.climate().name + '</dd>' +
				'<dt>' + civitas.l('Personality') + '</dt><dd>' + settlement.personality().name + '</dd>' +
				'<dt>' + civitas.l('Nationality') + '</dt><dd>' + settlement.nationality().name + '</dd>' +
				(settlement.is_city() || settlement.is_metropolis() ? 
				'<dt>' + civitas.l('Level') + '</dt><dd>' + settlement.level() + '</dd>' +
				'<dt>' + civitas.l('Prestige') + '</dt><dd>' + civitas.ui.progress((settlement.prestige() * 100) / civitas.MAX_PRESTIGE_VALUE, 'small', settlement.prestige()) + '</dd>'
				: '') + 
				'<dt>' + civitas.l('Coins') + '</dt><dd>' + civitas.utils.nice_numbers(settlement.coins()) + '</dd>' +
				'<dt>' + civitas.l('Population') + '</dt><dd>' + civitas.utils.nice_numbers(settlement.population()) + '</dd>' +
				'<dt>' + civitas.l('Religion') + '</dt><dd>' + settlement.religion().name + '</dd>' +
				'<dt>' + civitas.l('Influence') + '</dt><dd>' + civitas.ui.progress(my_settlement.get_influence_with_settlement(settlement.id()), 'small') + '</dd>' +
				'<dt>' + civitas.l('Diplomatic Status') + '</dt><dd>' + my_settlement.get_diplomacy_status(settlement.id()).name + '</dd>' +
				'<dt>' + civitas.l('Distance') + '</dt><dd>' + civitas.utils.get_distance(location, settlement.get_location()) + ' miles (' + civitas.utils.get_distance_in_days(location, settlement.get_location()) + ' days)</dd>' +
			'</dl>');
		$(this.handle + ' #tab-army').empty().append(civitas.ui.army_list(settlement.get_army()));
		$(this.handle + ' #tab-navy').empty().append(civitas.ui.navy_list(settlement.get_navy()));
		if (settlement.is_city() || settlement.is_metropolis()) {
			$(this.handle + ' #tab-imports').empty().append('<p>' + civitas.l('Below are the goods this city will be buying this year.') + '</p>' + civitas.ui.trades_list(trades, 'imports'));
			$(this.handle + ' #tab-exports').empty().append('<p>' + civitas.l('Below are the goods this city will be selling this year.') + '</p>' + civitas.ui.trades_list(trades, 'exports'));
		}
		var out = '';
		var _out = '<p>' + civitas.l('This settlement has the the following resources:') + '</p>';
		for (var item in settlement.get_resources()) {
			if ($.inArray(item, civitas.NON_RESOURCES) === -1 && settlement.resources[item] > 0) {
				out += civitas.ui.resource_storage_small_el(item, settlement.resources[item]);
			}
		}
		if (out !== '') {
			_out += out;
		} else {
			_out = '<p>' + civitas.l('This settlement has no resources.') + '</p>';
		}
		$(this.handle + ' #tab-resources').empty().append(_out);
		if (_status.id === civitas.DIPLOMACY_VASSAL) {
			$(this.handle + ' .btn.attack, ' + this.handle + ' .btn.spy').hide();
		} else {
			$(this.handle + ' .btn.attack, ' + this.handle + ' .btn.spy').show();
		}
		if (my_settlement.can_diplomacy()) {
			if (_status.id === civitas.DIPLOMACY_PACT && (settlement.is_city() || settlement.is_metropolis())) {
				$(this.handle + ' footer .alliance').show();
			} else {
				$(this.handle + ' footer .alliance').hide();
			}
			if (_status.id === civitas.DIPLOMACY_TRUCE ||
				_status.id === civitas.DIPLOMACY_CEASE_FIRE) {
				$(this.handle + ' footer .pact').show();
			} else {
				$(this.handle + ' footer .pact').hide();
			}
			if (_status.id === civitas.DIPLOMACY_WAR) {
				$(this.handle + ' footer .ceasefire').show();
			} else {
				$(this.handle + ' footer .ceasefire').hide();
			}
			if (_status.id !== civitas.DIPLOMACY_WAR && _status.id !== civitas.DIPLOMACY_VASSAL) {
				$(this.handle + ' footer .war').show();
			} else {
				$(this.handle + ' footer .war').hide();
			}
			if (_status.id === civitas.DIPLOMACY_PACT && settlement_type === civitas.VILLAGE) {
				$(this.handle + ' footer .join').show();
			} else {
				$(this.handle + ' footer .join').hide();
			}
		}
	}
};
