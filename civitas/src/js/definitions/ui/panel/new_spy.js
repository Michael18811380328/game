/**
 * Create a new spy panel data.
 *
 * @type {Object}
 */
civitas.PANEL_NEW_SPY = {
	template: '' +
		'<div id="panel-{ID}" class="panel">' +
			'<header>' + civitas.l('Create spy') +
				'<a class="tips close" title="' + civitas.l('Close') + '"></a>' +
			'</header>' +
			'<section></section>' +
			'<div class="toolbar">' +
				'<a class="btn dispatch" href="#">' + civitas.l('Dispatch') + '</a>' +
			'</div>' +
		'</div>',
	id: 'new-spy',
	on_show: function(params) {
		var self = this;
		var core = this.core();
		var my_settlement = core.get_settlement();
		var settlement = params.data;
		var settlements = core.get_settlements();
		var espionage = my_settlement.espionage();
		var location = civitas['SETTLEMENT_LOCATION_' + my_settlement.climate().name.toUpperCase()];
		var distance = civitas.utils.get_distance_in_days(location, settlement.get_location());
		var settlement_type_text;
		var _t = '<fieldset>' +
			'<legend>' + civitas.l('Initial costs') + '</legend>' +
			'<dl>';
		for (var item in civitas.SPY_COSTS) {
			var _cost = 0;
			if (item === 'coins') {
				_cost = civitas.SPY_COSTS[item] * distance;
			} else if (item === 'provisions') {
				_cost = Math.ceil((civitas.SPY_COSTS[item] * distance) / 2);
			} else {
				_cost = civitas.SPY_COSTS[item];
			}
			_t += '<dt>' + civitas.utils.nice_numbers(_cost) + '</dt>' +
				'<dd>' + civitas.ui.resource_small_img(item) + '</dd>';
		}
		_t += '</dl>' +
		'</fieldset>' +
		'<fieldset>' +
			'<legend>' + civitas.l('Destination') + '</legend>' +
			'<select class="espionage-destination">' +
				'<option value="0">-- ' + civitas.l('select') + ' --</option>';
		for (var i = 1; i < settlements.length; i++) {
			if (settlements[i].is_city()) {
				settlement_type_text = civitas.l('City of') + ' ';
			} else if (settlements[i].is_metropolis()) {
				settlement_type_text = civitas.l('Metropolis of') + ' ';
			} else {
				settlement_type_text = civitas.l('Village of') + ' '
			}
			_t += '<option ' + (settlement && (settlements[i].id() === settlement.id()) ? 'selected ' : '') + 'value="' + settlements[i].id() + '">' + settlement_type_text + settlements[i].name() + '</option>';
		}
		_t += '</select>' +
		'</fieldset>' +
		'<fieldset class="range-combo">' +
			'<legend>' + civitas.l('Espionage') + '</legend>' +
			'<input type="range" value="' + espionage + '" min="1" max="' + espionage + '" class="espionage-range" />' +
			'<input type="text" readonly value="' + espionage + '" class="espionage-value tips" title="' + civitas.l('Total espionage assigned to this spy.') + '" />' +
			'<input type="text" readonly value="' + Math.ceil(espionage / 100) + '%" class="espionage-chance tips" title="' + civitas.l('Chance of mission success.') + '" />' +
		'</fieldset>' +
		'<fieldset>' +
			'<legend>' + civitas.l('Mission') + '</legend>' +
			'<select class="espionage-mission">' +
				'<option value="0">-- ' + civitas.l('select') + ' --</option>';
		for (var i = 1; i < civitas.SPY_MISSIONS.length; i++) {
			_t += '<option value="' + i + '">' + civitas.SPY_MISSIONS[i].capitalize() + '</option>';
		}
		_t += '</select>' +
		'</fieldset>' +
		'<fieldset class="espionage-rel">' +
			'<legend>' + civitas.l('Religion') + (settlement ? ' (currently ' + settlement.religion().name + ')': '') + '</legend>' +
			'<select class="espionage-religion">';
		for (var i = 0; i < civitas.RELIGIONS.length; i++) {
			_t += '<option value="' + i + '">' + civitas.RELIGIONS[i].capitalize() + (i === my_settlement.religion().id ? ' (' + civitas.l('your religion') + ')' : '') + '</option>';
		}
		_t += '</select>' +
			'<p><strong>' + civitas.l('Note') + '!</strong> ' + civitas.l('Attempting to change a settlement`s religion uses up all your accumulated faith.') + '</p>' +
		'</fieldset>';
		$(this.handle + ' section').empty().append(_t);
		$(this.handle).on('change', '.espionage-range', function() {
			var value = parseInt($(this).val());
			$(self.handle + ' .espionage-value').val(value);
			$(self.handle + ' .espionage-chance').val(Math.ceil(value / 100) + '%');
		}).on('change', '.espionage-mission', function() {
			var value = parseInt($(this).val());
			if (value === civitas.SPY_MISSION_RELIGION) {
				$(self.handle + ' .espionage-rel').show();
			} else {
				$(self.handle + ' .espionage-rel').hide();
			}
		}).on('click', '.dispatch', function() {
			if (!my_settlement.can_diplomacy()) {
				core.error(civitas.l('You will need to construct an Embassy before being able to send spies to other settlements.'));
				return false;
			}
			var _espionage = parseInt($(self.handle + ' .espionage-value').val());
			var destination = parseInt($(self.handle + ' .espionage-destination').val());
			var mission = parseInt($(self.handle + ' .espionage-mission').val());
			if ((settlement && settlement.id() !== destination) || !settlement) {
				settlement = core.get_settlement(destination);
			}
			if (destination === 0 || _espionage > espionage || !settlement || mission <= 0) {
				core.error(civitas.l('There was an error creating and dispatching the spy, check the data you entered and try again.'));
				return false;
			}
			var data = {
				espionage: _espionage,
				mission: mission
			};
			if (mission === civitas.SPY_MISSION_RELIGION) {
				var _religion = parseInt($(self.handle + ' .espionage-religion').val());
				data.religion = _religion;
			}
			if (core.add_to_queue(my_settlement, settlement, civitas.ACTION_CAMPAIGN, civitas.CAMPAIGN_SPY, data)) {
				core.achievement(48);
				self.destroy();
			} else {
				core.error(civitas.l('There was an error creating and dispatching the spy, check the data you entered and try again.'));
			}
			return false;
		});
	},
	on_refresh: function() {
		var core = this.core();
		var my_settlement = core.get_settlement();
		var espionage = my_settlement.espionage();
		$(this.handle + ' .espionage-range').attr('max', espionage);
	}
};
