/**
 * Shipyard panel data.
 *
 * @type {Object}
 */
civitas.PANEL_SHIPYARD = {
	template: civitas.ui.building_panel_template(),
	id: 'shipyard',
	on_show: function(params) {
		var core = this.core();
		var settlement = core.get_settlement();
		$(this.handle + ' section').append(civitas.ui.tabs([civitas.l('Info'), civitas.l('Navy')]));
		var _t = '<div class="navy-list"></div>' +
				'<div class="navy-recruiter">';
		for (var item in civitas.SHIPS) {
			_t += '<fieldset>' +
					'<legend>' + civitas.SHIPS[item].name + '</legend>' +
					'<div class="cost">' +
						'<dl class="nomg">';
			for (var res in civitas.SHIPS[item].cost) {
				_t += '<dt>' + civitas.utils.nice_numbers(civitas.SHIPS[item].cost[res]) + 
					'</dt><dd>' + civitas.ui.resource_small_img(res) + '</dd>';
			}
			_t += '</dl>' +
					'</div>' +
					'<div class="info">' +
						'<dl class="nomg">' +
							'<dt>' + civitas.l('Attack') + '</dt><dd>' + civitas.SHIPS[item].attack + '</dd>' +
							'<dt>' + civitas.l('Defense') + '</dt><dd>' + civitas.SHIPS[item].defense + '</dd>' +
						'</dl>' +
					'</div>' +
					'<img data-handle="' + item + '" title="' + civitas.l('Recruit') + ' ' + civitas.SHIPS[item].name + '" class="tips recruit-ship" src="' + civitas.ASSETS_URL + 'images/assets/army/' + item.toLowerCase().replace(/ /g,"_") + '.png" />' +
				'</fieldset>';
		}
		_t += '</div>';
		$(this.handle + ' #tab-navy').empty().append(_t);
		$(this.handle).on('click', '.recruit-ship', function () {
			var ship = $(this).data('handle');
			var costs = civitas.SHIPS[ship].cost;
			if (settlement.has_resources(costs)) {
				if (settlement.remove_resources(costs)) {
					if (settlement.recruit_ship(ship)) {
						core.notify('A new ' + civitas.SHIPS[ship].name + ' has been recruited.');
						self.on_refresh();
						return false;
					}
				}
			}
			core.error('You don`t have enough resources to recruit a ' + civitas.SHIPS[ship].name + '.');
			return false;
		});
	},
	on_refresh: function() {
		var core = this.core();
		var settlement = core.get_settlement();
		var building = settlement.get_building(this.params_data.handle);
		if (building) {
			var level = building.get_level();
			$(this.handle + ' #tab-info').empty().append(civitas.ui.building_panel(this.params_data, level));
			$(this.handle + ' .navy-list').empty().append('<fieldset>' +
					'<legend>' + civitas.l('Current Navy') + '</legend>' + civitas.ui.navy_list(settlement.get_navy(), true) +
				'</fieldset>');
		} else {
			this.destroy();
		}
	}
};
