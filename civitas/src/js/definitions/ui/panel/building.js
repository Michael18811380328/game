/**
 * Building panel data.
 *
 * @type {Object}
 */
civitas.PANEL_BUILDING = {
	template: civitas.ui.building_panel_template(),
	id: 'building',
	on_refresh: function() {
		var building = this.core().get_settlement().get_building(this.params_data.handle);
		if (building) {
			$(this.handle + ' section').empty().append(civitas.ui.building_panel(this.params_data, building.get_level()));
		} else {
			this.destroy();
		}
	}
};
