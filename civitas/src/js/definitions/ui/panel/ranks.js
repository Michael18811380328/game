/**
 * Ranks panel data.
 *
 * @type {Object}
 */
civitas.PANEL_RANKS = {
	template: civitas.ui.generic_panel_template(civitas.l('World Rankings')),
	id: 'ranks',
	on_show: function(params) {
		$(this.handle + ' section').append('<div class="ranks-list"></div>');
	},
	on_refresh: function() {
		var ranking_list = [];
		var settlements = this.core().get_settlements();
		for (var i = 0; i < settlements.length; i++) {
			if (settlements[i].is_city() || settlements[i].is_metropolis()) {
				ranking_list.push({
					name: settlements[i].name(),
					data: settlements[i].get_rank()
				});
			}
		}
		ranking_list.sort(function(a, b) {
			var keyA = new Date(a.data.score);
			var keyB = new Date(b.data.score);
			if (keyA > keyB) {
				return -1;
			}
			if (keyA < keyB) {
				return 1;
			}
			return 0;
		});
		var _t = '<table class="normal">';
		_t += '<thead>' +
				'<tr>' +
					'<td class="center">' + civitas.l('Rank') + '</td>' +
					'<td>' + civitas.l('City') + '</td>' +
					'<td class="center">' + civitas.l('Score') + '</td>' +
				'</tr>' +
			'</thead>' +
			'<tbody>';
		for (var i = 0; i < ranking_list.length; i++) {
			_t += '<tr>' +
				'<td class="center">' + (i + 1) + '</td>' +
				'<td>' + ranking_list[i].name + '</td>' +
				'<td class="center">' + ranking_list[i].data.score + '</td>' +
			'</tr>';
		}
		_t += '</tbody>' +
			'</table>';
		$(this.handle + ' .ranks-list').empty().append(_t);
	}
};
