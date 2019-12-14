/**
 * Options window data.
 *
 * @type {Object}
 */
civitas.WINDOW_ERROR = {
	id: 'error',
	template: '' +
		'<section id="window-{ID}" class="window">' +
			'<div class="logo">Civitas</div>' +
			'<fieldset>' +
				civitas.l('An error has occured in Civitas and the game is unable to resume.') +
				'<br /><br />' +
				'<span class="error-message"></span>' +
				'<br />' +
				'<span class="error-code"></span>' +
				'<br /><br />' +
				'<a href="#" class="do-restart button">' + civitas.l('Restart') + '</a>' +
			'</fieldset>' +
		'</section>',
	on_show: function() {
		var self = this;
		var core = this.core();
		var handle = this.handle();
		$(handle + ' .error-message').html(civitas.l('Message: ') + this.params_data.error);
		$(handle + ' .error-code').html(civitas.l('Code: ') + this.params_data.code);
		$(handle).on('click', '.do-restart', function () {
			core.open_modal(
				function(button) {
					if (button === 'yes') {
						core.reset_storage_data();
						document.location.reload();
					}
				},
				'Are you sure you want to restart the game? You will lose all progress on the current game!',
				'Civitas'
			);
			return false;
		});
	},
	on_hide: function() {
		this.core().hide_loader();
	}
};
