/**
 * Army panel data.
 *
 * @type {Object}
 */
civitas.PANEL_ARMY = {
	template: civitas.ui.generic_panel_template(),
	id: 'army',
	on_show: function(params) {
		var army = params.data;
		$(this.handle + ' header').append(army.name);
		$(this.handle + ' section').append(civitas.ui.tabs(['Info', 'Soldiers', 'Ships']));
		$(this.handle + ' #tab-info').append('<img class="avatar" src="' + civitas.ASSETS_URL + 'images/assets/emblems/' + ((typeof army.icon !== 'undefined') ? army.icon : '22') + '.png" />' + '<p>' + army.description + '</p>');
		$(this.handle + ' #tab-soldiers').append(civitas.ui.army_list(army.army));
		$(this.handle + ' #tab-ships').append(civitas.ui.navy_list(army.navy));
	}
};
