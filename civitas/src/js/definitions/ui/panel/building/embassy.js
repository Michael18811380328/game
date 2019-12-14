/**
 * Embassy panel data.
 *
 * @type {Object}
 */
civitas.PANEL_EMBASSY = {
	template: civitas.ui.building_panel_template(),
	id: 'embassy',
	on_show: function(params) {
		var self = this;
		var core = this.core();
		var settlement = core.get_settlement();
		var settlements = core.get_settlements();
		var status = settlement.status();
		var building = core.get_settlement().get_building(this.params_data.handle);
		var level = building.get_level();
		$(this.handle + ' section').append(civitas.ui.tabs([civitas.l('Info'), civitas.l('Diplomacy'), civitas.l('Espionage')]));
		$(this.handle + ' #tab-diplomacy').empty().append('<div class="settlements-list"></div>');
		$(this.handle).on('click', '.view', function () {
			var _settlement_id = parseInt($(this).data('id'));
			var _settlement = core.get_settlement(_settlement_id);
			if (_settlement) {
				core.open_panel(civitas.PANEL_SETTLEMENT, _settlement);
			}
			return false;
		});
	},
	on_refresh: function() {
		var core = this.core();
		var settlement = core.get_settlement();
		var settlements = core.get_settlements();
		var status = settlement.status();
		var settlement_type_text;
		var building = core.get_settlement().get_building(this.params_data.handle);
		if (building) {
			var level = building.get_level();
			$(this.handle + ' #tab-info').empty().append(civitas.ui.building_panel(this.params_data, level));
			$(this.handle + ' #tab-espionage').empty().append('<div class="section">' + civitas.ui.progress((settlement.espionage() * 100) / civitas.MAX_ESPIONAGE_VALUE, 'large', settlement.espionage()) + '</div>');
			var _t = '<table class="normal">';
			for (var i = 1; i < settlements.length; i++) {
				var _status = settlement.get_diplomacy_status(settlements[i].id());
				var settlement_type = settlements[i].get_type();
				if (settlements[i].is_city()) {
					settlement_type_text = civitas.l('City of') + ' ';
				} else if (settlements[i].is_metropolis()) {
					settlement_type_text = civitas.l('Metropolis of') + ' ';
				} else {
					settlement_type_text = civitas.l('Village of') + ' '
				}
				_t += '<tr>' +
						'<td class="icon">' +
							'<a data-id="' + settlements[i].id() + '" title="' + civitas.l('View info about this settlement.') + '" class="tips view" href="#"><img src="' + civitas.ASSETS_URL + 'images/assets/avatars/avatar' + settlements[i].ruler().avatar + '.png" /></a>' +
						'</td>' +
						'<td>' +
							'<p class="title">' + settlement_type_text + settlements[i].name() + '</p> ' +
							'<div data-id="' + settlements[i].id() + '" >' + civitas.ui.progress(status[settlements[i].id()].influence, 'big') + '</div>' +
						'</td>' +
						'<td>' +
							'<p>' + civitas.l('Leader') + ': <strong>' + settlements[i].ruler().name + '</strong>' + '</p>' +
							'<p>' + civitas.l('Personality') + ': <strong>' + settlements[i].personality().name + '</strong>' + '</p>' +
							'<p>' + civitas.l('Diplomatic Status') + ': <strong>' + settlement.get_diplomacy_status(settlements[i].id()).name + '</strong>' + '</p>' +
						'</td>' +
					'</tr>';
			}
			_t += '</table>';
			$(this.handle + ' .settlements-list').empty().append(_t);
		} else {
			this.destroy();
		}
	}
};
