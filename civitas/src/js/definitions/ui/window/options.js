/**
 * Options window data.
 *
 * @type {Object}
 */
civitas.WINDOW_OPTIONS = {
	id: 'options',
	template: '' +
		'<section id="window-{ID}" class="window">' +
			'<div class="logo">Civitas</div>' +
			'<fieldset>' +
				'<a href="#" class="do-pause button">' + civitas.l('Pause') + '</a>' +
				'<a href="#" class="do-restart button">' + civitas.l('Restart') + '</a>' +
				'<a href="#" class="do-options button">' + civitas.l('Options') + '</a>' +
				'<div class="options-game"></div>' +
				civitas.ui.window_about_section() +
				'<br />' +
				'<a href="#" class="do-resume button">' + civitas.l('Resume Playing') + '</a>' +
			'</fieldset>' +
		'</section>',
	on_show: function() {
		var _game_data = null;
		var self = this;
		var handle = this.handle();
		var core = this.core();
		$(handle + ' .options-game').append(civitas.ui.tabs([civitas.l('Sounds'), civitas.l('UI'), civitas.l('Gameplay')]));
		$(handle + ' #tab-sounds').append('<div>' +
			'<a href="#" class="music-control ui-control ' + ((core.get_settings('music') === true) ? 'on' : 'off') + '">' + civitas.l('toggle music') + '</a>' +
			'<input class="music-volume" type="range" min="0" max="1" step="0.1" ' + ((core.get_settings('music') !== true) ? 'disabled' : '') + ' />' +
			'</div>');
		$(handle + ' #tab-ui').append('<div>' +
			'</div>');
		$(handle + ' .tabs').tabs();
		$(handle).on('click', '.do-resume', function () {
			core.hide_loader();
			core.unpause();
			self.destroy();
			return false;
		}).on('click', '.do-pause', function () {
			if (core.is_paused() === true) {
				$(this).removeClass('highlight').html(civitas.l('Pause'));
				core.show_loader();
				core.unpause();
			} else {
				$(this).addClass('highlight').html(civitas.l('Unpause'));
				core.hide_loader();
				core.pause();
			}
			return false;
		}).on('click', '.do-options', function () {
			$(handle + ' .options-game').slideToggle();
			return false;
		}).on('click', '.do-about', function () {
			$(handle + ' .about-game').slideToggle();
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
		}).on('click', '.music-control', function () {
			if ($(this).hasClass('on')) {
				$(this).removeClass('on').addClass('off');
				$('.music-volume').attr('disabled', true);
				core.set_settings_music(true);
			} else {
				$(this).removeClass('off').addClass('on');
				$('.music-volume').attr('disabled', false);
				core.set_settings_music(false);
			}
			core.save();
			return false;
		}).on('change', '.music-volume', function () {
			var value = $(this).val();
			core.music.volume = value;
			core.save();
			return false;
		});
	},
	on_hide: function() {
		this.core().hide_loader();
	}
};
