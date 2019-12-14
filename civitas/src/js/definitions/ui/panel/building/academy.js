/**
 * Academy panel data.
 *
 * @type {Object}
 */
civitas.PANEL_ACADEMY = {
	template: civitas.ui.building_panel_template(),
	id: 'academy',
	on_show: function(params) {
		$(this.handle + ' section').append(civitas.ui.tabs([civitas.l('Info'), civitas.l('Research')]));
	},
	on_refresh: function() {
		var core = this.core();
		var settlement = core.get_settlement();
		var research = settlement.research();
		var building = core.get_settlement().get_building(this.params_data.handle);
		if (building) {
			$(this.handle + ' #tab-info').empty().append(civitas.ui.building_panel(this.params_data, building.get_level()));
			$(this.handle + ' #tab-research').empty().append('' +
				'<div class="section">' + civitas.ui.progress((research * 100) / civitas.MAX_RESEARCH_VALUE, 'large', research) + '</div>' +
				'<p>Not implemented yet.</p>');
		} else {
			this.destroy();
		}
	}
};
