/**
 * Church panel data.
 *
 * @type {Object}
 */
civitas.PANEL_CHURCH = {
	template: civitas.ui.building_panel_template(),
	id: 'church',
	on_show: function(params) {
		var self = this;
		var core = this.core();
		var settlement = core.get_settlement();
		$(this.handle + ' section').append(civitas.ui.tabs([civitas.l('Info'), civitas.l('Religion')]));
		$(this.handle).on('click', '.religion', function() {
			var id = parseInt($(this).data('id'));
			core.open_modal(
				function(button) {
					if (button === 'yes') {
						settlement.change_religion(id);
					}
				},
				'Are you sure you want to switch religions? You will lose all your city`s faith!'
			);
			return false;
		});
	},
	on_refresh: function() {
		var core = this.core();
		var settlement = core.get_settlement();
		var building = core.get_settlement().get_building(this.params_data.handle);
		if (building) {
			$(this.handle + ' #tab-info').empty().append(civitas.ui.building_panel(this.params_data, building.get_level()));
			var _t = '<div class="section">' + civitas.ui.progress((settlement.faith() * 100) / civitas.MAX_FAITH_VALUE, 'large', settlement.faith()) + '</div>' +
				'<p>Changing your settlement`s religion requires <strong>' + civitas.MAX_FAITH_VALUE + '</strong> faith, each religion gives you access to different heroes in your Tavern and gives you a boost to the influence with the cities sharing the same religion.</p>' +
				'<div class="religion-list">';
			for (var i = 0; i < civitas.RELIGIONS.length; i++) {
				_t += '<div data-handle="' + civitas.RELIGIONS[i] + '" data-id="' + i + '" class="religion' + (settlement.religion().id === i ? ' selected' : '') + '"><span>' + civitas.RELIGIONS[i].capitalize() + '</span></div>';
			}
			_t += '</div>';
			$(this.handle + ' #tab-religion').empty().append(_t);
		} else {
			this.destroy();
		}
	}
};
