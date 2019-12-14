/**
 * Campaign panel data.
 *
 * @type {Object}
 */
civitas.PANEL_CAMPAIGN = {
	template: civitas.ui.generic_panel_template(),
	params_data: null,
	id: 'campaign',
	on_show: function(params) {
		var self = this;
		var core = this.core();
		var my_settlement = core.get_settlement();
		var campaign = params.data;
		var class_name = '';
		this.params_data = params;
		if (campaign.type === civitas.CAMPAIGN_ARMY || campaign.type === civitas.CAMPAIGN_ARMY_RETURN) {
			class_name = 'army';
		} else if (campaign.type === civitas.CAMPAIGN_CARAVAN) {
			class_name = 'caravan';
		} else if (campaign.type === civitas.CAMPAIGN_SPY) {
			class_name = 'spy';
		}
		$(this.handle + ' header').append(class_name.capitalize() + ' ' + civitas.l('mission'));
		if (campaign.type === civitas.CAMPAIGN_ARMY) {
			$(this.handle + ' section').append(civitas.ui.tabs([civitas.l('Info'), civitas.l('Army'), civitas.l('Navy')]));
		} else if (campaign.type === civitas.CAMPAIGN_CARAVAN) {
			$(this.handle + ' section').append(civitas.ui.tabs([civitas.l('Info'), civitas.l('Resources')]));
		} else if (campaign.type === civitas.CAMPAIGN_SPY) {
			$(this.handle + ' section').append(civitas.ui.tabs([civitas.l('Info'), civitas.l('Spy')]));
		} else if (campaign.type === civitas.CAMPAIGN_ARMY_RETURN) {
			$(this.handle + ' section').append(civitas.ui.tabs([civitas.l('Info'), civitas.l('Army'), civitas.l('Navy'), civitas.l('Resources')]));
		}
	},
	on_refresh: function() {
		var self = this;
		var core = this.core();
		var my_settlement = core.get_settlement();
		var campaign = this.params_data.data;
		var out = '';
		var source = core.get_settlement(campaign.source.id);
		var destination = core.get_settlement(campaign.destination.id);
		var distance = civitas.utils.get_distance(campaign.source, campaign.destination);
		var action = '';
		if (campaign.type === civitas.CAMPAIGN_ARMY) {
			action = 'Attacking';
		} else if (campaign.type === civitas.CAMPAIGN_ARMY_RETURN) {
			action = 'Returning';
		} else {
			action = 'Going to';
		}
		$(this.handle + ' #tab-info').empty().append('' +
			'<img class="avatar" src="' + civitas.ASSETS_URL + 'images/assets/avatars/avatar' + (campaign.type === civitas.CAMPAIGN_ARMY_RETURN ? destination.ruler().avatar : source.ruler().avatar) + '.png" />' +
			'<dl>' +
				'<dt>' + civitas.l('Sent By') + '</dt><dd>' + (campaign.type === civitas.CAMPAIGN_ARMY_RETURN ? destination.name() : source.name()) + '</dd>' +
				'<dt>' + civitas.l('Destination') + '</dt><dd>' + (campaign.type === civitas.CAMPAIGN_ARMY_RETURN ? source.name() : destination.name()) + '</dd>' +
				'<dt>' + civitas.l('Action') + '</dt><dd>' + action + '</dd>' +
				'<dt>' + civitas.l('Distance') + '</dt><dd>' + distance + ' miles (' + campaign.duration + ' ' + civitas.l('days') + ')</dd>' +
				'<dt>' + civitas.l('Remaining') + '</dt><dd>' + (10 * (campaign.duration - campaign.passed)) + ' miles (' + (campaign.duration - campaign.passed) + ' ' + civitas.l('days') + ')</dd>' +
			'</dl>');
		if (campaign.type === civitas.CAMPAIGN_ARMY) {
			$(this.handle + ' #tab-army').empty().append(civitas.ui.army_list(campaign.data.army));
			$(this.handle + ' #tab-navy').empty().append(civitas.ui.navy_list(campaign.data.navy));
		} else if (campaign.type === civitas.CAMPAIGN_CARAVAN) {
			if (typeof campaign.data.resources !== 'undefined' && !$.isEmptyObject(campaign.data.resources)) {
				out = '<p>' + civitas.l('This caravan has the the following resources:') + '</p>' +
					'<dl>';
				for (var item in campaign.data.resources) {
					if (campaign.data.resources[item] > 0) {
						out += '<dt>' + campaign.data.resources[item] + '</dt>' +
							'<dd>' + civitas.ui.resource_small_img(item) + '</dd>';
					}
				}
				out += '</dl>';
			} else {
				out = '<p>' + civitas.l('This is an empty caravan with no resources.') + '</p>';
			}
			$(this.handle + ' #tab-resources').empty().append(out);
		} else if (campaign.type === civitas.CAMPAIGN_SPY) {
			out = '<dl>' +
				'<dt>' + civitas.l('Mission') + '</dt>' +
				'<dd>' + civitas.SPY_MISSIONS[campaign.data.mission].capitalize() + '</dd>' +
				(campaign.data.mission === civitas.SPY_MISSION_RELIGION ? '<dt>' + civitas.l('Religion') + '</dt>' +
				'<dd>' + civitas.RELIGIONS[campaign.data.religion].capitalize() + '</dd>' : '') +
				'<dt>' + civitas.l('Espionage') + '</dt>' +
				'<dd>' + campaign.data.espionage + ' ' + civitas.ui.resource_small_img('espionage') + '</dd>' +
				'<dt>' + civitas.l('Success chance') + '</dt>' +
				'<dd>' + Math.ceil(campaign.data.espionage / 100) + '%</dd>' +
			'</dl>';
			$(this.handle + ' #tab-spy').empty().append(out);
		} else if (campaign.type === civitas.CAMPAIGN_ARMY_RETURN) {
			$(this.handle + ' #tab-army').empty().append(civitas.ui.army_list(campaign.data.army));
			$(this.handle + ' #tab-navy').empty().append(civitas.ui.navy_list(campaign.data.navy));
			if (typeof campaign.data.resources !== 'undefined' && !$.isEmptyObject(campaign.data.resources)) {
				out = '<p>' + civitas.l('This army is bringing back to its home city the following spoils of war:') + '</p>' +
					'<dl>';
				for (var item in campaign.data.resources) {
					if (campaign.data.resources[item] > 0) {
						out += '<dt>' + campaign.data.resources[item] + '</dt>' +
							'<dd>' + civitas.ui.resource_small_img(item) + '</dd>';
					}
				}
				out += '</dl>';
			} else {
				out = '<p>' + civitas.l('This army is returning with no spoils of war.') + '</p>';
			}
			$(this.handle + ' #tab-resources').empty().append(out);
		}
	}
};
