/**
 * Login window data.
 *
 * @type {Object}
 */
civitas.WINDOW_SIGNIN = {
	id: 'signin',
	template: '' +
		'<section id="window-{ID}" class="window">' +
			'<div class="logo">Civitas</div>' +
			'<fieldset>' +
				'<div class="new-game">' +
					'<p>' + civitas.l('Enter the city password to decrypt the game data.') + '</p>' +
					'<dl>' +
						'<dt class="clearfix">' + civitas.l('Password') + ':</dt>' +
						'<dd><input type="password" class="password text-input" /></dd>' +
					'</dl>' +
					'<a href="#" class="do-start highlight button">' + civitas.l('Load Game') + '</a>' +
				'</div>' +
				'<a href="#" class="do-restart button">' + civitas.l('Restart') + '</a>' +
				civitas.ui.window_about_section() +
			'</fieldset>' +
		'</section>',
	on_show: function() {
		var self = this;
		var handle = this.handle();
		var core = this.core();
		$(handle).on('click', '.do-start', function () {
			var password = $(handle + ' .password').val();
			if (password === '') {
				core.error('Enter your city password.', 'Error', true);
				return false;
			}
			if (!core.load_game_data(password)) {
				$(handle + ' .password').val('');
				core.error('Error decrypting the game data with the specified password. Try again.', 'Error', true);
			} else {
				self.destroy();
			}
			return false;
		}).on('click', '.do-restart', function () {
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
		}).on('click', '.do-about', function () {
			$(handle + ' .about-game').slideToggle();
			return false;
		});
	},
	on_hide: function() {
		this.core().hide_loader();
	}
};
