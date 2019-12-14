/**
 * Military Camp panel data.
 *
 * @type {Object}
 */
civitas.PANEL_CAMP = {
	template: civitas.ui.building_panel_template(),
	id: 'camp',
	on_show: function(params) {
		var self = this;
		var core = this.core();
		var settlement = core.get_settlement();
		$(this.handle + ' section').append(civitas.ui.tabs([civitas.l('Info'), civitas.l('Army')]));
		var _t = '<div class="army-list"></div>' +
				'<div class="army-recruiter">';
		for (var item in civitas.SOLDIERS) {
			_t += '<fieldset>' +
					'<legend>' + civitas.SOLDIERS[item].name + '</legend>' +
					'<div class="cost">' +
						'<dl class="nomg">';
			for (var res in civitas.SOLDIERS[item].cost) {
				_t += '<dt>' + civitas.utils.nice_numbers(civitas.SOLDIERS[item].cost[res]) + '</dt><dd>' + civitas.ui.resource_small_img(res) + '</dd>';
			}
			_t += '</dl>' +
					'</div>' +
					'<div class="info">' +
						'<dl class="nomg">' +
							'<dt>Attack</dt><dd>' + civitas.SOLDIERS[item].attack + '</dd>' +
							'<dt>Defense</dt><dd>' + civitas.SOLDIERS[item].defense + '</dd>' +
						'</dl>' +
					'</div>' +
					'<img data-handle="' + item + '" title="' + civitas.l('Recruit') + ' ' + civitas.SOLDIERS[item].name + '" class="tips recruit-soldier" src="' + civitas.ASSETS_URL + 'images/assets/army/' + item.toLowerCase() + '.png" />' +
				'</fieldset>';
		}
		_t += '</div>';
		$(this.handle + ' #tab-army').empty().append(_t);
		$(this.handle).on('click', '.recruit-soldier', function () {
			var soldier = $(this).data('handle');
			var costs = civitas.SOLDIERS[soldier].cost;
			if (settlement.has_resources(costs)) {
				if (settlement.remove_resources(costs)) {
					if (settlement.recruit_soldier(soldier)) {
						core.notify('A new ' + civitas.SOLDIERS[soldier].name + ' has been recruited.');
						self.on_refresh();
						return false;
					}
				}
			}
			core.error('You don`t have enough resources to recruit a ' + civitas.SOLDIERS[soldier].name + '.');
			return false;
		});
	},
	on_refresh: function() {
		var core = this.core();
		var settlement = core.get_settlement();
		var building = core.get_settlement().get_building(this.params_data.handle);
		if (building) {
			$(this.handle + ' #tab-info').empty().append(civitas.ui.building_panel(this.params_data, building.get_level()));
			$(this.handle + ' .army-list').empty().append('<fieldset>' +
					'<legend>' + civitas.l('Current Army') + '</legend>' + civitas.ui.army_list(settlement.get_army(), true) +
				'</fieldset>');
		} else {
			this.destroy();
		}
	}
};
