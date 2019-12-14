/**
 * Battle window data.
 *
 * @type {Object}
 */
civitas.WINDOW_BATTLE = {
	template: '<section id="window-{ID}" class="window">' +
			'<div class="container">' +
				'<div title="' + civitas.l('Attack and defense rating for the attacking army.') +
				'" class="tips attack"></div>' +
				'<div title="' + civitas.l('Attack and defense rating for the defending army.') +
				'" class="tips defense"></div>' +
				'<div class="battleground"></div>' +
				'<div title="' + civitas.l('Current turn.') + '" class="tips turns">1</div>' +
				'<div class="status"></div>' +	
				'<div class="toolbar">' +
					'<a title="' + civitas.l('End current turn.') +
					'" class="tips button end" href="#">' + civitas.l('End turn') + '</a> ' +
					'<a title="' + civitas.l('Close the window.') +
					'" class="tips button close" href="#">' + civitas.l('Close') + '</a>' +
				'</div>' +
			'</div>' +
		'</section>',
	id: 'battle',
	on_show: function(params) {
		var self = this;
		var core = this.core();
		var handle = this.handle();
		core.pause();
		this.battleground = new civitas.objects.battleground({
			core: core,
			width: 15,
			height: 9,
			elements: {
				container: handle + ' .battleground',
				attack: handle + ' .attack',
				defense: handle + ' .defense',
				console: handle + ' .status',
			},
			attack: {
				city: this.params_data.source.source.id,
				army: this.params_data.source.data.army,
				navy: this.params_data.source.data.navy
			},
			defense: {
				city: this.params_data.destination.id(),
				army: this.params_data.destination.army,
				navy: this.params_data.destination.navy
			},
			on_win: function(winner, loser) {
				core.achievement(54);
				$(handle + ' .end').hide();
				$(handle + ' .close').show();
			},
			on_lose: function(winner, loser) {
				core.achievement(55);
				$(handle + ' .end').hide();
				$(handle + ' .close').show();
			},
			on_end_turn: function(turn) {
				$(handle + ' .turns').html(turn);
			}
		});
		$(handle + ' .close').hide();
		$(handle).on('click', '.close', function () {
			core.unpause();
			self.destroy();
			return false;
		}).on('click', '.end', function () {
			self.battleground.end_turn();
			return false;
		});
	}
};
