/**
 * Create a new army panel data.
 *
 * @type {Object}
 */
civitas.PANEL_NEW_ARMY = {
	template: '' +
		'<div id="panel-{ID}" class="panel">' +
			'<header>' + civitas.l('Create army') +
				'<a class="tips close" title="' + civitas.l('Close') + '"></a>' +
			'</header>' +
			'<section></section>' +
			'<div class="toolbar clearfix">' +
				'<a class="dispatch btn iblock" href="#">' + civitas.l('Dispatch') + '</a>' +
			'</div>' +
		'</div>',
	id: 'new-army',
	on_show: function(params) {
		var self = this;
		var core = this.core();
		var my_settlement = core.get_settlement();
		var settlement = params.data;
		var settlements = core.get_settlements();
		var settlement_type_text;
		var army = my_settlement.get_army();
		var location = civitas['SETTLEMENT_LOCATION_' + my_settlement.climate().name.toUpperCase()];
		var distance = civitas.utils.get_distance_in_days(location, settlement.get_location());
		this.assigned_army = {};
		this.assigned_navy = {};
		for (var item in army) {
			this.assigned_army[item] = army[item];
		}
		if (my_settlement.can_build_ships()) {
			var navy = my_settlement.get_navy();
			for (var item in navy) {
				this.assigned_navy[item] = navy[item];
			}
		}
		var _t = '<div class="column">' +
			'<fieldset>' +
				'<legend>' + civitas.l('Initial costs') + '</legend>' +
				'<dl>';
		for (var item in civitas.ARMY_COSTS) {
			var _cost = 0;
			if (item === 'coins') {
				_cost = civitas.ARMY_COSTS[item] * distance;
			} else if (item === 'provisions') {
				_cost = Math.ceil((civitas.ARMY_COSTS[item] * distance) / 2);
			} else {
				_cost = civitas.ARMY_COSTS[item];
			}
			_t += '<dt>' + civitas.utils.nice_numbers(_cost) + '</dt>' +
				'<dd>' + civitas.ui.resource_small_img(item) + '</dd>';
		}
		_t += '</dl>' +
			'</fieldset>' +
			'<fieldset>' +
				'<legend>' + civitas.l('Soldiers') + '</legend>';
		for (var item in army) {
			_t += '<div class="army-item">' +
					'<a href="#" data-max="' + army[item] + '" data-soldier="' + item + '" class="army-item-inc">+</a>' +
					'<a href="#" data-max="' + army[item] + '" data-soldier="' + item + '" class="army-item-dec">-</a>' +
					'<img class="tips" title="' + civitas.SOLDIERS[item].name + '" src="' + civitas.ASSETS_URL + 'images/assets/army/' + item.toLowerCase().replace(/ /g,"_") + '.png" />' +
					'<span class="amount">' + army[item] + '</span>' +
				'</div>';
		}
		_t += '</fieldset>' +
		'<fieldset>' +
			'<legend>' + civitas.l('Destination') + '</legend>' +
			'<select class="army-destination">' +
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
		'</div>' +
		'<div class="column">';
		if (my_settlement.can_build_ships()) {
			_t += '<fieldset>' +
					'<legend>' + civitas.l('Ships') + '</legend>';
			for (var item in navy) {
				_t += '<div class="navy-item">' +
						'<a href="#" data-max="' + navy[item] + '" data-ship="' + item + '" class="navy-item-inc">+</a>' +
						'<a href="#" data-max="' + navy[item] + '" data-ship="' + item + '" class="navy-item-dec">-</a>' +
						'<img class="tips" title="' + item + '" src="' + civitas.ASSETS_URL + 'images/assets/army/' + item.toLowerCase().replace(/ /g,"_") + '.png" />' +
						'<span class="amount">' + navy[item] + '</span>' +
					'</div>';
			}
			_t += '</fieldset>';
		}
		if (my_settlement.can_recruit_heroes()) {
			var heroes = my_settlement.heroes();
			_t += '<fieldset>' +
				'<legend>' + civitas.l('Hero') + '</legend>' +
				'<select class="army-hero">';
			if ($.isEmptyObject(heroes)) {
				_t += '<option value="0">-- ' + civitas.l('no heroes available') + ' --</option>';
			} else {
				_t += '<option value="0">-- ' + civitas.l('select') + ' --</option>';
				for (var item in heroes) {
					_t += '<option value="' + item + '">' + heroes[item] + '</option>';
				}
			}
			_t += '</select>' +
			'</fieldset>';
		} else {
			_t += '<p><strong>' + civitas.l('Note') + '!</strong> ' + civitas.l('Build a Tavern to be able to recruit powerful heroes and assign them to your armies.') + '</p>';		
		}
		_t += '</div>';
		$(this.handle + ' section').empty().append(_t);
		$(this.handle).on('click', '.navy-item-inc', function() {
			var max = parseInt($(this).data('max'));
			var ship = $(this).data('ship');
			var current = parseInt($(this).parent().children('.amount').html());
			if (current + 1 <= max) {
				self.assigned_navy[ship] = current + 1;
				$(this).parent().children('.amount').html(current + 1);
			}
			return false;
		}).on('click', '.navy-item-dec', function() {
			var max = parseInt($(this).data('max'));
			var ship = $(this).data('ship');
			var current = parseInt($(this).parent().children('.amount').html());
			if (current - 1 >= 0) {
				self.assigned_navy[ship] = current - 1;
				$(this).parent().children('.amount').html(current - 1);
			}
			return false;
		}).on('click', '.army-item-inc', function() {
			var max = parseInt($(this).data('max'));
			var soldier = $(this).data('soldier');
			var current = parseInt($(this).parent().children('.amount').html());
			if (current + 1 <= max) {
				self.assigned_army[soldier] = current + 1;
				$(this).parent().children('.amount').html(current + 1);
			}
			return false;
		}).on('click', '.army-item-dec', function() {
			var max = parseInt($(this).data('max'));
			var soldier = $(this).data('soldier');
			var current = parseInt($(this).parent().children('.amount').html());
			if (current - 1 >= 0) {
				self.assigned_army[soldier] = current - 1;
				$(this).parent().children('.amount').html(current - 1);
			}
			return false;
		}).on('click', '.dispatch', function() {
			if (!my_settlement.can_recruit_soldiers()) {
				core.error(civitas.l('You will need to construct a Military Camp before being able to attack other settlements.'));
				return false;
			}
			var destination = parseInt($(self.handle + ' .army-destination').val());
			if ((settlement && settlement.id() !== destination) || !settlement) {
				settlement = core.get_settlement(destination);
			}
			// TODO there is an error here when there is no shipyard to send navy.
			if (destination === 0 || !settlement || (my_settlement.has_army(self.assigned_army) === 0 && my_settlement.has_navy(self.assigned_navy) === 0)) {
				core.error(civitas.l('There was an error creating and dispatching the army, check the data you entered and try again.'));
				return false;
			}
			if (core.add_to_queue(my_settlement, settlement, civitas.ACTION_CAMPAIGN, civitas.CAMPAIGN_ARMY, {
				army: self.assigned_army,
				navy: self.assigned_navy
			})) {
				core.achievement(49);
				self.destroy();
			} else {
				core.error(civitas.l('There was an error creating and dispatching the army, check the data you entered and try again.'));
			}
			return false;
		});
	}
};
