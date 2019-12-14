/**
 * Sign Up window data.
 *
 * @type {Object}
 */
civitas.WINDOW_SIGNUP = {
	id: 'signup',
	template: '' +
		'<section id="window-{ID}" class="window">' +
			'<div class="logo">Civitas</div>' +
			'<fieldset>' +
				'<div class="new-game">' +
					'<p>' + civitas.l('Choose your city details well, climate changes and game difficulty affects your building options and resources.') + '</p>' +
					'<dl>' +
						'<dt class="clearfix">' + civitas.l('Your Name') + ':</dt>' +
						'<dd><input type="text" maxlength="12" title="' + civitas.l('Maximum of 12 characters.') + '" class="tips name text-input" /></dd>' +
						((civitas.ENCRYPTION === true) ?
						'<dt class="clearfix">' + civitas.l('Password') + ':</dt>' +
						'<dd><input type="password" class="password text-input" /></dd>' +
						'<dt class="clearfix">' + civitas.l('Confirm Password') + ':</dt>' +
						'<dd><input type="password" class="password2 text-input" /></dd>'
						: '') +
						'<div class="hr"></div>' +
						'<dt class="clearfix">' + civitas.l('City Name') + ':</dt>' +
						'<dd><input type="text" maxlength="12" title="' + civitas.l('Maximum of 12 characters.') + '" class="tips cityname text-input" /></dd>' +
						'<dt class="clearfix">' + civitas.l('Nationality') + ':</dt>' +
						'<dd>' +
							'<select class="nation text-input"></select>' +
						'</dd>' +
						'<dt class="clearfix">' + civitas.l('Climate') + ':</dt>' +
						'<dd>' +
							'<select class="climate text-input"></select>' +
						'</dd>' +
						'<dt class="clearfix">' + civitas.l('Difficulty') + ':</dt>' +
						'<dd>' +
							'<select class="difficulty text-input">' +
								'<option value="1">' + civitas.l('Easy') + '</option>' +
								'<option value="2">' + civitas.l('Medium') + '</option>' +
								'<option value="3">' + civitas.l('Hard') + '</option>' +
								'<option value="4">' + civitas.l('Hardcore') + '</option>' +
							'</select>' +
						'</dd>' +
						'<dt class="clearfix">' + civitas.l('Avatar') + ':</dt>' +
						'<dd class="avatar-select-container">' +
							'<div class="avatar-select"></div>' +
							'<div class="scrollbar">' +
								'<div class="up"></div>' +
								'<div class="down"></div>' +
							'</div>' +
						'</dd>' +
					'</dl>' +
					'<a href="#" class="do-start highlight button">' + civitas.l('Start Playing') + '</a>' +
				'</div>' +
				civitas.ui.window_about_section() +
			'</fieldset>' +
		'</section>',
	on_show: function() {
		var self = this;
		var avatar = 1;
		var password = '';
		var password2 = '';
		var core = this.core();
		var handle = this.handle();
		for (var i = 1; i < civitas.CLIMATES.length; i++) {
			$(handle + ' .climate').append('<option value="' + civitas['CLIMATE_' + civitas.CLIMATES[i].toUpperCase()] + '">' + civitas.CLIMATES[i].capitalize() + '</option>');
		}
		for (var i = 1; i < civitas.NATIONS.length; i++) {
			$(handle + ' .nation').append('<option value="' + civitas['NATION_' + civitas.NATIONS[i].toUpperCase()] + '">' + civitas.NATIONS[i].capitalize() + '</option>');
		}
		for (var i = 1; i <= civitas.AVATARS; i++) {
			$(handle + ' .avatar-select').append('<img src="' + civitas.ASSETS_URL + 'images/assets/avatars/avatar' + i + '.png" />');
		}
		$(handle).on('click', '.do-start', function () {
			if (civitas.ENCRYPTION === true) {
				password = $(handle + ' .password').val();
				password2 = $(handle + ' .password2').val();
			}
			var name = $(handle + ' .name').val();
			var cityname = $(handle + ' .cityname').val();
			var nation = parseInt($(handle + ' .nation').val());
			var climate = parseInt($(handle + ' .climate').val());
			var difficulty = parseInt($(handle + ' .difficulty').val());
			if (name.length > 12) {
				name = name.substring(0, 12);
			}
			if (cityname.length > 12) {
				cityname = cityname.substring(0, 12);
			}
			if (name === '') {
				core.error('Enter your ruler name, for example <strong>Ramses</strong>.', 'Error', true);
				return false;
			}
			if (cityname === '') {
				core.error('Enter your city name, for example <strong>Alexandria</strong>.', 'Error', true);
				return false;
			}
			if (civitas.ENCRYPTION === true) {
				if (password === '') {
					core.error('Enter a strong password for your city.', 'Error', true);
					return false;
				}
				if (password !== password2) {
					core.error('Your passwords do not match.', 'Error', true);
					return false;
				}
			}
			core.new_game(name, cityname, nation, climate, avatar, difficulty, password);
			self.destroy();
			return false;
		}).on('click', '.down', function () {
			if (avatar < civitas.AVATARS) {
				avatar = avatar + 1;
			}
			$(handle + ' .avatar-select').scrollTo('+=' + (64 + avatar) + 'px', 500);
		}).on('click', '.up', function () {
			if (avatar > 1) {
				avatar = avatar - 1;
			}
			$(handle + ' .avatar-select').scrollTo('-=' + (64 + avatar) + 'px', 500);
		}).on('click', '.do-about', function () {
			$(handle + ' .about-game').slideToggle();
			return false;
		});
	},
	on_hide: function() {
		this.core().hide_loader();
	}
};
