/**
 * Main Game core object.
 * 
 * @class {civitas.game}
 * @returns {civitas.game}
 */
civitas.game = function () {

	/**
	 * List of all the settlements in the game.
	 * 
	 * @type {Array}
	 * @private
	 */
	this.settlements = [];

	/**
	 * Game actions queue.
	 *
	 * @private
	 * @type {Array}
	 */
	this._queue = [];

	/**
	 * List of currently completed achievements.
	 *
	 * @private
	 * @type {Array}
	 */
	this._achievements = [];

	/**
	 * Total number of achievement points
	 *
	 * @private
	 * @type {Number}
	 */
	this._achievement_points = 0;

	/**
	 * Pointer to the audio subsystem component.
	 * 
	 * @private
	 * @type {Object}
	 */
	this.music = null;

	/**
	 * Current game date.
	 *
	 * @private
	 * @type {Object}
	 */
	this._date = {
		day: 1,
		month: 1,
		year: 1,
		day_of_month: 1
	};

	/**
	 * Black Market data.
	 * 
	 * @public
	 * @type {Object}
	 */
	this.black_market = {};

	/**
	 * Game settings
	 * 
	 * @type {Object}
	 * @private
	 */
	this.settings = {
		music: false
	};

	/**
	 * Encryption data, for now it's safe (famous last words) since we're only doing local storage.
	 *
	 * @private
	 * @type {String}
	 */
	this.encryption = {
		key: null,
		key_size: 256,
		iv_size: 128,
		iterations: 100,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	};

	/**
	 * Game properties.
	 *
	 * @private
	 * @type {Object}
	 */
	this.properties = {
		difficulty: civitas.DIFFICULTY_EASY,
		mode: civitas.MODE_SINGLEPLAYER,
		worldmap: null,
		paused: false
	};

	/**
	 * Array containing the list of all open panels.
	 *
	 * @type {Array}
	 * @private
	 */
	this.panels = [];

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @returns {civitas.game}
	 */
	this.__init = function () {
		this._build_ui();
		this._setup_audio();
		this._setup_ui();
		if (!this.has_storage_data()) {
			this.open_window(civitas.WINDOW_SIGNUP);
		} else {
			if (civitas.ENCRYPTION === true) {
				this.open_window(civitas.WINDOW_SIGNIN);
			} else {
				this.load_game_data();
			}
		}
		return this;
	};

	/**
	 * Set game settings.
	 * 
	 * @param {String} key
	 * @param {Mixed} value
	 * @public
	 * @returns {civitas.game}
	 */
	this.set_settings = function (key, value) {
		if (typeof value === 'undefined') {
			this.settings = key;
		} else {
			this.settings[key] = value;
		}
		return this;
	};

	/**
	 * Set music on/off.
	 * 
	 * @param {String} key
	 * @param {Mixed} value
	 * @public
	 * @returns {civitas.game}
	 */
	this.set_settings_music = function(value) {
		if (value === true) {
			this.music.play();
		} else {
			this.music.pause();
		}
		this.set_settings('music', value);
		return this;
	};

	/**
	 * Retrieve game settings.
	 * 
	 * @param {String} key
	 * @public
	 * @returns {civitas.game.settings}
	 */
	this.get_settings = function (key) {
		if (typeof key === 'undefined') {
			return this.settings;
		} else {
			return this.settings[key];
		}
	};

	/**
	 * Reset the Black Market goods.
	 * 
	 * @private
	 * @returns {civitas.game}
	 */
	this._reset_black_market = function () {
		var total = 0;
		for (var item in this.black_market) {
			this.get_settlement().inc_coins(this.black_market[item].price);
			total += this.black_market[item].price;
		}
		this.black_market = {};
		this.refresh();
		$('#tab-blackmarket > .contents > table > tbody').empty();
		if (total > 0) {
			this.notify(this.get_settlement().name() + ' received <strong>' + total + '</strong> ' + civitas.utils.get_resource_name('coins') + ' from the Black Market for selling goods.', civitas.l('Black Market'));
		}
		return this;
	};

	/**
	 * Return the Black Market goods list.
	 * 
	 * @public
	 * @returns {Object}
	 */
	this.get_black_market = function () {
		return this.black_market;
	};

	/**
	 * Set the Black Market goods list to the specified value.
	 * 
	 * @public
	 * @param {Object} value
	 * @returns {civitas.game}
	 */
	this.set_black_market = function (value) {
		if (typeof value !== 'undefined') {
			this.black_market = value;
		} else {
			this.black_market = {};
		}
		return this;
	};

	/**
	 * Internal method for starting up a game.
	 *
	 * @private
	 * @param {Object} data
	 * @returns {civitas.game}
	 */
	this._setup_game = function(data) {
		var self = this;
		this._setup_neighbours(data);
		$('header .cityname').html(this.get_settlement().name());
		$('header .cityavatar').css({
			'background-image': 'url(' + civitas.ASSETS_URL + 'images/assets/avatars/avatar' + this.get_settlement().ruler().avatar + '.png)'
		});
		this.refresh();
		var seconds = 1;
		setInterval(function () {
			if (!self.is_paused() && seconds === civitas.SECONDS_TO_DAY) {
				self._do_daily();
				seconds = 1;
			} else if (!self.is_paused()) {
				seconds++;
			}
		}, 1000);
		$(document).keyup(function(event) {
			if (event.keyCode == 27 && !civitas.ui.window_exists('#window-options')) {
				self.show_loader();
				self.open_window(civitas.WINDOW_OPTIONS);
			}
		});
		this.hide_loader();
		this.save_and_refresh();
		return this;
	};

	/**
	 * Start a new game.
	 *
	 * @public
	 * @param {String} name
	 * @param {String} cityname
	 * @param {Number} nation
	 * @param {Number} climate
	 * @param {Number} avatar
	 * @param {Number} difficulty
	 * @param {String} password
	 * @returns {Boolean}
	 */
	this.new_game = function(name, cityname, nation, climate, avatar, difficulty, password) {
		this.show_loader();
		var data = null;
		if (civitas.ENCRYPTION === true) {
			this.encryption.key = password;
		}
		this.properties.difficulty = parseInt(difficulty);
		this.properties.worldmap = civitas.utils.get_random(1, civitas.WORLDMAPS);
		this._create_settlement(name, cityname, nation, climate, avatar);
		this._setup_game(null);
		return true;
	};

	/**
	 * Load a game by decrypting it with the specified password.
	 *
	 * @public
	 * @param {String} password
	 * @returns {Boolean}
	 */
	this.load_game_data = function(password) {
		var data = null;
		if (civitas.ENCRYPTION === true) {
			this.encryption.key = password;
		}
		var game_data = this.get_storage_data();
		var hash = CryptoJS.SHA512(JSON.stringify(game_data.data));
		if (typeof game_data.hash === 'undefined') {
			this.open_window(civitas.WINDOW_ERROR, {
				error: 'Missing game signature.',
				code: '0x01'
			});
			return false;
		}
		if (hash.toString(CryptoJS.enc.Hex) !== game_data.hash) {
			this.open_window(civitas.WINDOW_ERROR, {
				error: 'Invalid game signature.',
				code: '0x02'
			});
			return false;
		}
		if (game_data) {
			this.show_loader();
			var temp_game_data = this.import(game_data.data);
			if (temp_game_data !== false) {
				data = this._load_settlement(temp_game_data);
				if (data !== false) {
					this._setup_game(data);
					return true;
				} else {
					this.open_window(civitas.WINDOW_ERROR, {
					error: 'Unable to process game data.',
					code: '0x05'
				});
				return false;
				}
			} else {
				this.open_window(civitas.WINDOW_ERROR, {
					error: 'Invalid game data.',
					code: '0x03'
				});
				return false;
			}
		} else {
			return false;
		}
	};

	/**
	 * Pause the game.
	 *
	 * @public
	 * @returns {civitas.game}
	 */
	this.pause = function() {
		if (this.is_paused() === false) {
			this.properties.paused = true;
			this.log('game', 'Game is paused.');
		}
		return this;
	};

	/**
	 * Resume the game.
	 *
	 * @public
	 * @returns {civitas.game}
	 */
	this.unpause = function() {
		if (this.is_paused() === true) {
			this.properties.paused = false;
			this.log('game', 'Game is resumed.');
		}
		return this;
	};

	/**
	 * Check if the game is paused.
	 *
	 * @public
	 * @returns {Boolean}
	 */
	this.is_paused = function() {
		return this.properties.paused;
	};

	/**
	 * Setup the audio part of the game.
	 * 
	 * @private
	 * @returns {civitas.game}
	 */
	this._setup_audio = function () {
		this.music = $('#music').get(0);
		this.music.volume = 0.2;
		if (civitas.AUTOSTART_MUSIC === true) {
			this.music.play();
		}
		return this;
	};

	/**
	 * Get building data from the main configuration array.
	 * 
	 * @public
	 * @param {String|Number} handle
	 * @returns {Object|Boolean}
	 */
	this.get_building_config_data = function (handle) {
		if (typeof handle === 'string') {
			return civitas.BUILDINGS[civitas.BUILDINGS.findIndexM(handle)];
		} else if (typeof handle === 'number') {
			return civitas.BUILDINGS[handle];
		}
		return false;
	};

	/**
	 * Check if any events occured on this day.
	 *
	 * @private
	 * @returns {civitas.game}
	 */
	this._check_for_events = function() {
		var random = Math.random().toFixed(5);
		var event;
		for (var i = 0; i < civitas.EVENTS.length; i++) {
			var _event = civitas.EVENTS[i];
			if (random <= _event.chance) {
				event = _event;
				event.core = this;
				new civitas.objects.event(event);
				return this;
			}
		}
		return this;
	};

	/**
	 * Method that gets called each 'day'.
	 * 
	 * @private
	 * @returns {civitas.game}
	 */
	this._do_daily = function () {
		this._date.day++;
		this.log('world', this.format_date());
		this._process_settlements();
		this._check_for_events();
		this.calc_storage();
		this.advance_queue();
		this._date.day_of_month++;
		if (this._date.day_of_month > 30) {
			this._do_monthly();
		}
		if (this._date.day >= 361) {
			this._do_yearly();
			this._date.day = 1;
			this._date.month = 1;
		}
		this.save_and_refresh();
		return this;
	};

	/**
	 * Method that gets called each 'month'.
	 * 
	 * @private
	 * @returns {civitas.game}
	 */
	this._do_monthly = function () {
		this._date.day_of_month = 1;
		this._date.month++;
		if (this._date.month === 3 || this._date.month === 6 || this._date.month === 9 || this._date.month === 12) {
			this._do_quarterly();
		}
		if (this._date.month === 6 || this._date.month === 12) {
			this._do_biannually();
		}
		this._reset_black_market();
		return this;
	};

	/**
	 * Method that gets called twice per year.
	 * 
	 * @private
	 * @returns {civitas.game}
	 */
	this._do_biannually = function() {
		this.refresh_trades();
		return this;
	};

	/**
	 * Method that gets called four times every year.
	 * 
	 * @private
	 * @returns {civitas.game}
	 */
	this._do_quarterly = function() {
		return this;
	};

	/**
	 * Refresh the UI, panels, check for achievements and save game.
	 *
	 * @public
	 * @returns {civitas.game}
	 */
	this.save_and_refresh = function() {
		this.check_achievements();
		this.save();
		this.refresh();
		return this;
	};

	/**
	 * Refresh the world trades.
	 * 
	 * @public
	 * @returns {civitas.game}
	 */
	this.refresh_trades = function() {
		var settlements = this.get_settlements();
		for (var i = 1; i < settlements.length; i++) {
			if (typeof settlements[i] !== 'undefined') {
				if (settlements[i].is_city() || settlements[i].is_metropolis()) {
					settlements[i].reset_trades();
				}
			}
		}
		this.notify('World Market trades have been refreshed, settlements are looking to make new purchases and sales.', civitas.l('World Market'));
		return this;
	};

	/**
	 * Refresh the influence of each of the cities in the world.
	 * 
	 * @private
	 * @returns {civitas.game}
	 */
	this._refresh_influence = function() {
		var settlements = this.get_settlements();
		for (var i = 1; i < settlements.length; i++) {
			if (typeof settlements[i] !== 'undefined') {
				if (settlements[i].is_city() || settlements[i].is_metropolis()) {
					if (this.get_settlement().religion().id === settlements[i].religion().id) {
						this.get_settlement().raise_influence(settlements[i].id(), civitas.YEARLY_INFLUENCE_GAIN);
					} else if ((this.get_settlement().get_diplomacy_status(settlements[i].id()) === civitas.DIPLOMACY_VASSAL) || (this.get_settlement().get_diplomacy_status(settlements[i].id()) === civitas.DIPLOMACY_ALLIANCE)) {
						this.get_settlement().raise_influence(settlements[i].id());
					} else {
						this.get_settlement().lower_influence(settlements[i].id(), civitas.YEARLY_INFLUENCE_LOSS);
					}
				} else {
					if (this.get_settlement().religion().id === settlements[i].religion().id) {
						this.get_settlement().raise_influence(settlements[i].id(), civitas.YEARLY_INFLUENCE_GAIN);
					} else if ((this.get_settlement().get_diplomacy_status(settlements[i].id()) === civitas.DIPLOMACY_VASSAL) || (this.get_settlement().get_diplomacy_status(settlements[i].id()) === civitas.DIPLOMACY_ALLIANCE)) {
						this.get_settlement().raise_influence(settlements[i].id());
					}
				}
			}
		}
		return this;
	};

	/**
	 * Method that gets called each 'year'.
	 * 
	 * @private
	 * @returns {civitas.game}
	 */
	this._do_yearly = function () {
		this.get_settlement().release_mercenaries();
		this._refresh_influence();
		this._date.year++;
		this.log('game', 'New year!');
		return this;
	};

	/**
	 * Return the game date in a more manageable form.
	 * 
	 * @public
	 * @returns {String}
	 */
	this.format_date = function () {
		return 'day ' + this._date.day_of_month + ', month ' + this._date.month + ', year ' + this._date.year;
	};

	/**
	 * Calculate and return the total and free storage space in the main settlement.
	 * 
	 * @public
	 * @returns {Object}
	 */
	this.calc_storage = function () {
		var storage = this.get_settlement().storage();
		if (storage.occupied >= storage.all) {
			this.error('You ran out of storage space and all goods produced will be lost. Upgrade your warehouse or marketplace.', 'No storage space');
		} else if ((storage.all - storage.occupied) < 100) {
			this.error('You will soon run out of storage space and all goods produced will be lost. Upgrade your warehouse or marketplace.', 'Storage nearly full');
		}
		return storage;
	};

	/**
	 * Get the version of the game.
	 * 
	 * @public
	 * @returns {String}
	 */
	this.get_version = function() {
		return civitas.VERSION;
	};
	
	/**
	 * Get/set the difficulty level of the game.
	 * 
	 * @public
	 * @param {Number} value
	 * @returns {Number}
	 */
	this.difficulty = function(value) {
		if (typeof value !== 'undefined') {
			this.properties.difficulty = value;
		}
		return this.properties.difficulty;
	};

	/**
	 * Get/set the game mode.
	 *
	 * @public
	 * @param {Number} value
	 * @returns {Number}
	 */
	this.mode = function(value) {
		if (typeof value !== 'undefined') {
			this.properties.mode = value;
		}
		return this.properties.mode;
	};

	/**
	 * Get/set the id of the current worldmap.
	 *
	 * @public
	 * @param {Number} value
	 * @returns {Number}
	 */
	this.worldmap = function(value) {
		if (typeof value !== 'undefined') {
			this.properties.worldmap = value;
		}
		return this.properties.worldmap;
	};

	/**
	 * Return if the current season is spring.
	 *
	 * @returns {Boolean}
	 * @public
	 */
	this.is_spring = function() {
		if (this._date.month >= 3 && this._date.month < 6) {
			return true;
		}
		return false;
	};

	/**
	 * Return if the current season is summer.
	 *
	 * @returns {Boolean}
	 * @public
	 */
	this.is_summer = function() {
		if (this._date.month >= 6 && this._date.month < 9) {
			return true;
		}
		return false;
	};

	/**
	 * Get/set the current game date.
	 * 
	 * @public
	 * @param {Object} value
	 * @returns {Object}
	 */
	this.date = function(value) {
		if (typeof value !== 'undefined') {
			this._date = value;
		}
		return this._date;
	};

	/**
	 * Return if the current season is autumn.
	 *
	 * @returns {Boolean}
	 * @public
	 */
	this.is_autumn = function() {
		if (this._date.month >= 9 && this._date.month < 12) {
			return true;
		}
		return false;
	};

	/**
	 * Return if the current season is winter.
	 *
	 * @returns {Boolean}
	 * @public
	 */
	this.is_winter = function() {
		if (this._date.month >= 12 || this._date.month < 3) {
			return true;
		}
		return false;
	};

	/**
	 * Check for any achievements completion.
	 *
	 * @public
	 * @returns {civitas.game}
	 */
	this.check_achievements = function() {
		var achievement;
		var condition;
		var settlement = this.get_settlement();
		var id;
		for (var i = 0; i < civitas.ACHIEVEMENTS.length; i++) {
			achievement = civitas.ACHIEVEMENTS[i];
			id = achievement.id;
			if (!this.has_achievement(id)) {
				for (var cond_item in achievement.conditions) {
					condition = achievement.conditions[cond_item];
					if (cond_item === 'settlement_level') {
						if (settlement.level() === condition) {
							this.achievement(id);
						}
					}
					if (cond_item === 'soldiers') {
						var army = settlement.has_army();
						if (army >= condition) {
							this.achievement(id);
						}
					}
					if (cond_item === 'ships') {
						var navy = settlement.has_navy();
						if (navy >= condition) {
							this.achievement(id);
						}
					}
					if (cond_item === 'population') {
						if (settlement.population() >= condition) {
							this.achievement(id);
						}
					}
					if (cond_item === 'buildings') {
						for (var item in condition) {
							var good = true;
							if (!settlement.is_building_built(item, condition[item])) {
								good = false;
								break;
							}
						}
						if (good === true) {
							this.achievement(id);
						}
					}
					if (cond_item === 'resources') {
						var good = true;
						for (var item in condition) {
							var amount = settlement.resources[item];
							if (amount < condition[item]) {
								good = false;
								break;
							}
						}
						if (good === true) {
							this.achievement(id);
						}
					}
					if (cond_item === 'storage') {
						if (condition === 0) {
							var storage = settlement.storage();
							if (storage.occupied >= storage.all) {
								this.achievement(id);
							}
						}
					}
					if (cond_item === 'achievements') {
						if (condition === this._achievements.length) {
							this.achievement(id);
						}
					}
					if (cond_item === 'mercenary') {
						var merc = settlement.mercenary();
						if (merc.length >= condition) {
							this.achievement(id);
						}
					}
					if (cond_item === 'religion') {
						var religion = settlement.religion();
						if (religion.name === condition) {
							this.achievement(id);
						}
					}
				}
			}
		}
		return this;
	};

	/**
	 * Perform an achievement notification in the game.
	 * 
	 * @public
	 * @param {Number} id
	 * @returns {civitas.game}
	 */
	this.achievement = function (id) {
		if (!this.has_achievement(id)) {
			var achievement = civitas.ACHIEVEMENTS[id];
			this._achievements.push({
				id: id,
				date: + new Date()
			});
			this._achievement_points += achievement.points;
			this._notify({
				title: civitas.l('Achievement Completed'),
				mode: civitas.NOTIFY_ACHIEVEMENT,
				content: achievement.description,
				timeout: false
			});
			this.log('achievement', 'Achievement Completed: ' + achievement.description);
			this.save_and_refresh();
		}
		return this;
	};

	/**
	 * Check if the current player has the achievement specified by its id.
	 *
	 * @public
	 * @param {Number} id
	 * @returns {Object|Boolean}
	 */
	this.has_achievement = function(id) {
		for (var i = 0; i < this._achievements.length; i++) {
			if (typeof this._achievements[i] !== 'undefined') {
				if (this._achievements[i].id === id) {
					return this._achievements[i];
				}
			}
		}
		return false;
	};

	/**
	 * Set/get the achievements.
	 *
	 * @public
	 * @returns {Array}
	 */
	this.achievements = function(value) {
		if (typeof value !== 'undefined') {
			this._achievements = value;
		}
		return this._achievements;
	};

	/**
	 * Set/get the achievement points.
	 *
	 * @public
	 * @returns {Number}
	 */
	this.achievement_points = function(value) {
		if (typeof value !== 'undefined') {
			this._achievement_points = value;
		}
		return this._achievement_points;
	};

	/**
	 * Set/get the game queue.
	 *
	 * @public
	 * @returns {Array}
	 */
	this.queue = function(value) {
		if (typeof value !== 'undefined') {
			this._queue = value;
		}
		return this._queue;
	};

	/**
	 * Advance the game queue.
	 *
	 * @public
	 * @returns {civitas.game}
	 */
	this.advance_queue = function() {
		for (var i = 0; i < this._queue.length; i++) {
			if (this._queue[i].passed === this._queue[i].duration - 1) {
				this.process_action(i);
			} else {
				this._queue[i].passed++;
			}
		}
		return this;
	};

	/**
	 * Process an action from the game queue.
	 *
	 * @public
	 * @param {Number} id
	 * @returns {civitas.game}
	 */
	this.process_action = function(id) {
		var campaign = this._queue[id];
		var failed = true;
		var settlement = this.get_settlement(campaign.source.id);
		var destination_settlement = this.get_settlement(campaign.destination.id);
		if (campaign.mode === civitas.ACTION_CAMPAIGN) {
			var random = Math.ceil(Math.random() * 100);
			var amount = Math.floor(campaign.data.espionage / 100);
			if (settlement.is_player()) {
				if (campaign.type === civitas.CAMPAIGN_ARMY && !settlement.can_recruit_soldiers()) {
					this.remove_action(id);
					return false;
				}
				if (campaign.type === civitas.CAMPAIGN_SPY && !settlement.can_diplomacy()) {
					this.remove_action(id);
					return false;
				}
				if (campaign.type === civitas.CAMPAIGN_CARAVAN && !settlement.can_trade()) {
					this.remove_action(id);
					return false;
				}
			}
			switch (campaign.type) {
				case civitas.CAMPAIGN_ARMY:
					this.notify('The army sent from ' + settlement.name() + ' to ' + destination_settlement.name() + ' ' + campaign.duration + ' days ago reached its destination.');
					if (!this.get_panel('battle')) {
						this.open_window(civitas.WINDOW_BATTLE, {
							source: campaign,
							destination: destination_settlement
						});
					}
					break;
				case civitas.CAMPAIGN_ARMY_RETURN:
					this.notify('The army sent from ' + destination_settlement.name() + ' to ' + settlement.name() + ' ' + (campaign.duration * 2) + ' days ago reached its home town.');
					destination_settlement.merge_army(campaign.data.army);
					destination_settlement.merge_navy(campaign.data.navy);
					destination_settlement.merge_resources(campaign.data.resources);
					break;
				case civitas.CAMPAIGN_SPY:
					if (typeof campaign.data.espionage !== 'undefined') {
						switch (campaign.data.mission) {
							case civitas.SPY_MISSION_RELIGION:
								if (random <= Math.ceil(campaign.data.espionage / 
									civitas.MAX_ESPIONAGE_SUCESS_RATE)) {
									if (campaign.source.id === settlement.id()) {
										destination_settlement.religion(campaign.data.religion);
										var religion = destination_settlement.religion();
										this.notify('The spy you sent ' + campaign.duration + ' days ago to ' + destination_settlement.name() + ' reached its destination and managed to convince the settlement council to change the religion to ' + religion.name + '.');
									} else if (campaign.destination.id === settlement.id()) {
										destination_settlement =
											this.get_settlement(campaign.source.id);
										settlement.religion(campaign.data.religio);
										var religion = settlement.religion();
										this.notify('The spy sent from ' + destination_settlement.name() + ' ' + campaign.duration + ' days ago to our city reached its destination and managed to convince your city council to change the religion to ' + religion.name + '.');
									}
									failed = false;
								}
								break;
							case civitas.SPY_MISSION_INFLUENCE:
								if (random <= Math.ceil(campaign.data.espionage / 
									civitas.MAX_ESPIONAGE_SUCESS_RATE)) {
									if (campaign.source.id === settlement.id()) {
										settlement.raise_influence(campaign.destination.id, amount);
										this.notify('The spy you sent ' + campaign.duration + ' days ago to ' + destination_settlement.name() + ' reached its destination and increased your influence over this settlement.');
									} else if (campaign.destination.id === settlement.id()) {
										destination_settlement = this.get_settlement(campaign.source.id);
										// TODO
										// destination_settlement.raise_influence(
										//	campaign.destination.id, amount);
										this.notify('The spy sent from ' + destination_settlement.name() + ' ' + campaign.duration + ' days ago to our city reached its destination and lowered your influence over this settlement.');
									}
									failed = false;
								}
								break;
							case civitas.SPY_MISSION_STEAL_RESOURCES:
								if (random <= Math.ceil(campaign.data.espionage /
									civitas.MAX_ESPIONAGE_SUCESS_RATE)) {
									// TODO
									failed = false;
								}
								break;
							case civitas.SPY_MISSION_INSTIGATE:
								if (random <= Math.ceil(campaign.data.espionage /
									civitas.MAX_ESPIONAGE_SUCESS_RATE)) {
									if (campaign.source.id === settlement.id()) {
										destination_settlement.lower_prestige(amount);
										this.notify('The spy you sent ' + campaign.duration + ' days ago to ' + destination_settlement.name() + ' reached its destination and incited the population to revolt, therefore lowering the prestige of the city.');
									} else if (campaign.destination.id === settlement.id()) {
										destination_settlement = this.get_settlement(campaign.source.id);
										settlement.lower_prestige(amount);
										this.notify('The spy sent from ' + destination_settlement.name() + ' ' + campaign.duration + ' days ago to our city reached its destination and incited our population to revolt, therefore lowering the prestige of our city.');
									}
									failed = false;
								}
								break;
						}
					}
					break;
				case civitas.CAMPAIGN_CARAVAN:
					var total = 0;
					if (typeof campaign.data.resources !== 'undefined') {
						for (var item in campaign.data.resources) {
							if ($.inArray(item, civitas.NON_RESOURCES) === -1) {
								total += civitas.utils.calc_price(campaign.data.resources[item], item);
							} else if (item === 'coins') {
								total += campaign.data.resources[item];
							}
							destination_settlement.add_to_storage(item, campaign.data.resources[item]);
						}
						settlement.raise_influence(campaign.destination.id, civitas.CARAVAN_INFLUENCE);
						this.notify('The caravan sent from ' + settlement.name() + ' to ' + destination_settlement.name() + campaign.duration + ' days ago reached its destination.');
					}
					break;
			}
			/*
			if (failed === true) {
				if (campaign.destination.id === this.get_settlement().id()) {
					destination_settlement = this.get_settlement(campaign.source.id);
					this.notify('The ' + class_name + ' sent by ' + destination_settlement.name() + ' ' + campaign.duration + ' days ago reached its destination.');
				} else {
					this.notify('The ' + class_name + ' you sent ' + campaign.duration + ' days ago to ' + destination_settlement.name() + ' reached its destination.');
				}
			}
			*/
		} else if (campaign.mode === civitas.ACTION_DIPLOMACY) {
			if (settlement.is_player() && !settlement.can_diplomacy()) {
				this.remove_action(id);
				return false;
			}
			switch (campaign.type) {
				case civitas.DIPLOMACY_PROPOSE_PACT:
					settlement.diplomacy(destination_settlement, civitas.DIPLOMACY_PACT);
					//failed = false;
					break;
				case civitas.DIPLOMACY_PROPOSE_ALLIANCE:
					settlement.diplomacy(destination_settlement, civitas.DIPLOMACY_ALLIANCE);
					//failed = false;
					break;
				case civitas.DIPLOMACY_PROPOSE_CEASE_FIRE:
					settlement.diplomacy(destination_settlement, civitas.DIPLOMACY_CEASE_FIRE);
					//failed = false;
					break;
				case civitas.DIPLOMACY_PROPOSE_JOIN:
					settlement.diplomacy(destination_settlement, civitas.DIPLOMACY_VASSAL);
					//failed = false;
					break;
			}
			if (failed === true) {
				if (campaign.source.id === settlement.id()) {
					this.notify('The proposal you sent ' + campaign.duration + ' days ago to ' + destination_settlement.name() + ' was accepted.');
				}
			}
		}
		this.remove_action(id);
		return this;
	};

	/**
	 * Add a campaign to the game queue.
	 *
	 * @public
	 * @param {civitas.objects.settlement} source_settlement
	 * @param {civitas.objects.settlement} destination_settlement
	 * @param {Number} mode
	 * @param {Number} type
	 * @param {Object} data
	 * @returns {Object}
	 */
	this.add_to_queue = function(source_settlement, destination_settlement, mode, type, data) {
		if (source_settlement.id() === this.get_settlement().id()) {
			var s_loc = civitas['SETTLEMENT_LOCATION_' + source_settlement.climate().name.toUpperCase()];
		} else {
			var s_loc = source_settlement.get_location();
		}
		if (destination_settlement.id() === this.get_settlement().id()) {
			var d_loc = civitas['SETTLEMENT_LOCATION_' + destination_settlement.climate().name.toUpperCase()];
		} else {
			var d_loc = destination_settlement.get_location();
		}
		var duration = civitas.utils.get_distance_in_days(s_loc, d_loc);
		if (mode === civitas.ACTION_CAMPAIGN) {
			if (type === civitas.CAMPAIGN_ARMY) {
				if (source_settlement.id() === this.get_settlement().id()) {
					if (!source_settlement.can_recruit_soldiers()) {
						return false;
					}
					var mission_costs = source_settlement.adjust_campaign_cost(civitas.ARMY_COSTS, duration);
					if (!source_settlement.has_resources(mission_costs)) {
						return false;
					}
					if (!source_settlement.remove_resources(mission_costs)) {
						return false;
					}
					if (!source_settlement.split_army(data)) {
						return false;
					}
					if (!source_settlement.split_navy(data)) {
						return false;
					}
					if (typeof data.resources === 'undefined') {
						data.resources = {};
					}
					source_settlement.diplomacy(destination_settlement.id(), civitas.DIPLOMACY_WAR);
				}
				this.notify('An army was sent from ' +  source_settlement.name() + ' to ' + destination_settlement.name() + ' and will reach its destination in ' + duration + ' days.');
			} else if (type === civitas.CAMPAIGN_ARMY_RETURN) {
				this.notify('The army sent from ' + destination_settlement.name() + ' to ' + source_settlement.name() + ' ' + duration + ' days ago finished its campaign and will be returning home with the spoils of war.');
			} else if (type === civitas.CAMPAIGN_SPY) {
				if (source_settlement.id() === this.get_settlement().id()) {
					if (!source_settlement.can_diplomacy()) {
						return false;
					}
					if (data.espionage > source_settlement.espionage()) {
						return false;
					}
					var mission_costs = source_settlement.adjust_campaign_cost(civitas.SPY_COSTS, duration);
					if (!source_settlement.has_resources(mission_costs)) {
						return false;
					}
					if (!source_settlement.remove_resources(mission_costs)) {
						return false;
					}
					source_settlement.lower_espionage(data.espionage);
					if (data.mission === civitas.SPY_MISSION_RELIGION) {
						source_settlement.reset_faith();
					}
				}
				this.notify('A spy was dispatched from ' + source_settlement.name() + ' to ' + destination_settlement.name() + ' and will reach its destination in ' + duration + ' days.');
			} else if (type === civitas.CAMPAIGN_CARAVAN) {
				if (source_settlement.id() === this.get_settlement().id()) {
					if (!source_settlement.can_trade()) {
						return false;
					}
					var mission_costs = source_settlement.adjust_campaign_cost(civitas.CARAVAN_COSTS, duration, data.resources);
					if (!source_settlement.has_resources(mission_costs)) {
						return false;
					}
					if (!source_settlement.remove_resources(mission_costs)) {
						return false;
					}
				}
				this.notify('A caravan was dispatched from ' + source_settlement.name() + ' to ' + destination_settlement.name() + ' and will reach its destination in ' + duration + ' days.');
			}
		} else if (mode === civitas.ACTION_DIPLOMACY) {
			duration = Math.ceil(duration / 2);
			if (source_settlement.id() === this.get_settlement().id()) {
				this.notify('A diplomacy proposal was dispatched from ' + source_settlement.name() + ' to ' + destination_settlement.name() + ' and will reach its destination in ' + duration + ' days.');
			}
		}
		var action = {
			mode: mode,
			source: {
				x: s_loc.x,
				y: s_loc.y,
				id: source_settlement.id()
			},
			destination: {
				x: d_loc.x,
				y: d_loc.y,
				id: destination_settlement.id()
			},
			duration: duration,
			passed: 0,
			type: type,
			data: data
		};
		this._queue.push(action);
		this.save_and_refresh();
		return action;
	};

	/**
	 * Remove an action from the game queue.
	 *
	 * @public
	 * @param {Number} id
	 * @returns {civitas.game}
	 */
	this.remove_action = function(id) {
		var panel;
		if (panel = this.get_panel('campaign')) {
			panel.destroy();
		}
		this._queue.splice(id, 1);
		return this;
	};

	/**
	 * Process each of the settlements in the world.
	 * 
	 * @private
	 * @param {String} name
	 * @returns {civitas.settlement|Boolean}
	 */
	this._process_settlements = function() {
		var settlements = this.get_settlements();
		for (var i = 0; i < settlements.length; i++) {
			if (typeof settlements[i] !== 'undefined') {
				if (settlements[i].is_city() || settlements[i].is_metropolis()) {
					if (i > 1) {
						if (settlements[i].ai().process()) {
							//console.log('AI for ' + settlements[i].name() + ' processed!');
						}
					}
					// For now, process just the player settlement.
					// TODO
					if (i === 0) {
						var buildings = settlements[i].get_buildings();
						for (var x = 0; x < buildings.length; x++) {
							if (typeof buildings[x] !== 'undefined') {
								buildings[x].process();
							}
						}
					}
				}
			}
		}
	};

	/**
	 * Get a pointer to the player's settlement.
	 * 
	 * @public
	 * @param {String} name
	 * @returns {civitas.settlement|Boolean}
	 */
	this.get_settlement = function (name) {
		var settlements = this.get_settlements();
		if (typeof name === 'undefined') {
			return settlements[0];
		}
		if (typeof name === 'string') {
			for (var i = 0; i < settlements.length; i++) {
				if (typeof settlements[i] !== 'undefined') {
					if (settlements[i].name() === name) {
						return settlements[i];
					}
				}
			}
		} else if (typeof name === 'number') {
			for (var i = 0; i < settlements.length; i++) {
				if (typeof settlements[i] !== 'undefined') {
					if (settlements[i].id() === name) {
						return settlements[i];
					}
				}
			}
		}
		return false;
	};

	/**
	 * Load the player settlement from localStorage data.
	 * 
	 * @private
	 * @param {Object} data
	 * @returns {Object|Boolean}
	 */
	this._load_settlement = function (data) {
		var player_settlement_data = data.settlements[0];
		var new_settlement;
		if (player_settlement_data) {
			player_settlement_data.core = this;
			new_settlement = new civitas.objects.settlement(player_settlement_data);
			this.settlements.push(new_settlement);
			new_settlement._create_buildings(player_settlement_data.buildings);
			return data;
		}
		return false;
	};

	/**
	 * Get the number of all the settlements in game.
	 * 
	 * @public
	 * @returns {Number}
	 */
	this.get_num_settlements = function () {
		return this.settlements.length;
	};

	/**
	 * Get the list of all the settlements in game.
	 * 
	 * @public
	 * @returns {Array}
	 */
	this.get_settlements = function () {
		return this.settlements;
	};

	/**
	 * Create all the other settlements in the world.
	 * 
	 * @public
	 * @param {Number} settlement_type
	 * @returns {Object}
	 */
	this.get_point_outside_area = function(settlement_type) {
		var distance;
		if (settlement_type === civitas.CITY) {
			distance = civitas.CITY_AREA;
		} else if (settlement_type === civitas.METROPOLIS) {
			distance = civitas.METROPOLIS_AREA;
		} else {
			distance = civitas.VILLAGE_AREA;
		}
		var new_location = civitas.utils.get_random_world_location();
		var settlement_location;
		var settlements = this.get_settlements();
		for (var i = 0; i < settlements.length; i++) {
			if (typeof settlements[i] !== 'undefined') {
				settlement_location = settlements[i].get_location();
				if (civitas.utils.get_distance(settlement_location, new_location) < distance) {
					return this.get_point_outside_area(settlement_type);
				}
			}
		}
		return new_location;
	};

	/**
	 * Generate random army soldiers.
	 * 
	 * @public
	 * @param {Number} settlement_type
	 * @returns {Object}
	 */
	this.generate_random_army = function(settlement_type) {
		var army = {};
		for (var item in civitas.SOLDIERS) {
			if (settlement_type === civitas.CITY) {
				if (item === 'cannon' || item === 'heavycannon' || item === 'catapult') {
					army[item] = civitas.utils.get_random(1, 2);
				} else {
					army[item] = civitas.utils.get_random(5, 10);
				}
			} else if (settlement_type === civitas.METROPOLIS) {
				if (item === 'cannon' || item === 'heavycannon' || item === 'catapult') {
					army[item] = civitas.utils.get_random(3, 5);
				} else {
					army[item] = civitas.utils.get_random(20, 30);
				}
			} else if (settlement_type === civitas.VILLAGE) {
				if (item === 'cannon' || item === 'heavycannon' || item === 'catapult') {
					// Todo
				} else {
					army[item] = civitas.utils.get_random(0, 2);
				}
			}
		}
		return army;
	};

	/**
	 * Generate random navy ships.
	 * 
	 * @public
	 * @param {Number} settlement_type
	 * @returns {Object}
	 */
	this.generate_random_navy = function(settlement_type) {
		var navy = {};
		for (var item in civitas.SHIPS) {
			if (settlement_type === civitas.CITY) {
				navy[item] = civitas.utils.get_random(3, 5);
			} else if (settlement_type === civitas.METROPOLIS) {
				navy[item] = civitas.utils.get_random(10, 20);
			} else {
				navy[item] = civitas.utils.get_random(0, 2);
			}
		}
		return navy;
	};

	/**
	 * Generate random resources and trades.
	 * 
	 * @public
	 * @param {Boolean} full
	 * @param {Number} settlement_type
	 * @returns {Object}
	 */
	this.generate_random_resources = function(full, settlement) {
		var resources = {};
		var num_resources;
		if (full === true) {
			if (settlement === civitas.CITY) {
				resources.coins = civitas.utils.get_random(10000, 1000000);
				resources.fame = civitas.utils.get_random(50000, 100000);
				resources.prestige = civitas.utils.get_random(1, civitas.MAX_PRESTIGE_VALUE);
				resources.espionage = civitas.utils.get_random(1, civitas.MAX_ESPIONAGE_VALUE);
				resources.research = civitas.utils.get_random(1, civitas.MAX_RESEARCH_VALUE);
				resources.faith = civitas.utils.get_random(1, civitas.MAX_FAITH_VALUE);
			} else if (settlement === civitas.METROPOLIS) {
				resources.coins = civitas.utils.get_random(100000, 10000000);
				resources.fame = civitas.utils.get_random(500000, 1000000);
				resources.prestige = civitas.utils.get_random(500, civitas.MAX_PRESTIGE_VALUE);
				resources.espionage = civitas.utils.get_random(500, civitas.MAX_ESPIONAGE_VALUE);
				resources.research = civitas.utils.get_random(500, civitas.MAX_RESEARCH_VALUE);
				resources.faith = civitas.utils.get_random(500, civitas.MAX_FAITH_VALUE);
			} else {
				resources.coins = civitas.utils.get_random(100, 20000);
				resources.fame = civitas.utils.get_random(1, 50000);
				resources.prestige = civitas.utils.get_random(1, 100);
				resources.espionage = civitas.utils.get_random(1, 2);
				resources.research = civitas.utils.get_random(1, 2);
				resources.faith = civitas.utils.get_random(1, civitas.MAX_FAITH_VALUE);
			}
		}
		var trades = {
			imports: {},
			exports: {}
		};
		if (settlement === civitas.CITY) {
			num_resources = civitas.utils.get_random(5, 30);
		} else if (settlement === civitas.METROPOLIS) {
			num_resources = civitas.utils.get_random(15, 80);
		} else {
			num_resources = civitas.utils.get_random(2, 10);
		}
		for (var i = 0; i < num_resources; i++) {
			var res = this.get_random_resource();
			resources[res] = civitas.utils.get_random(10, 500);
			if (settlement === civitas.CITY || settlement === civitas.METROPOLIS) {
				if (resources[res] > 450) {
					trades.exports[res] = civitas.IMPORTANCE_VITAL;
				} else if (resources[res] > 300 && resources[res] <= 450) {
					trades.exports[res] = civitas.IMPORTANCE_HIGH;
				} else if (resources[res] > 150 && resources[res] <= 250) {
					trades.exports[res] = civitas.IMPORTANCE_MEDIUM;
				}
			}
		}
		if (settlement === civitas.CITY || settlement === civitas.METROPOLIS) {
			for (var i = 0; i < num_resources; i++) {
				var res = this.get_random_resource();
				trades.imports[res] = civitas.utils.get_random(civitas.IMPORTANCE_LOW, civitas.IMPORTANCE_VITAL);
			}
		}
		return {
			resources: resources,
			trades: trades
		};
	};

	/**
	 * Get a random resource key.
	 *
	 * @public
	 * @returns {String}
	 */
	this.get_random_resource = function() {
		var keys = Object.keys(civitas.RESOURCES);
		var resource = keys[keys.length * Math.random() << 0];
		if ($.inArray(resource, civitas.NON_RESOURCES) === -1) {
			return resource;
		} else {
			return this.get_random_resource();
		}
	};

	/**
	 * Generate random settlement data.
	 * 
	 * @public
	 * @param {Number} settlement_type
	 * @returns {Object}
	 */
	this.generate_random_settlement_data = function(settlement_type) {
		var settlement_level;
		if (typeof settlement_type === 'undefined') {
			settlement_type = civitas.utils.get_random(0, 2);
		}
		var resources = this.generate_random_resources(true, settlement_type);
		if (settlement_type === civitas.CITY) {
			settlement_level = civitas.utils.get_random(10, civitas.MAX_SETTLEMENT_LEVEL);
		} else if (settlement_type === civitas.METROPOLIS) {
			settlement_level = civitas.utils.get_random(20, civitas.MAX_SETTLEMENT_LEVEL);
		} else {
			settlement_level = civitas.utils.get_random(1, 5);
		}
		var settlement = {
			icon: civitas.utils.get_random(2, 6),
			type: settlement_type,
			player: false,
			name: civitas.utils.get_random_unique(civitas.SETTLEMENT_NAMES),
			climate: civitas.utils.get_random(1, civitas.CLIMATES.length - 1),
			religion: civitas.utils.get_random(1, civitas.RELIGIONS.length - 1),
			nationality: civitas.utils.get_random(1, civitas.NATIONS.length - 1),
			level: settlement_level,
			resources: resources.resources,
			army: this.generate_random_army(settlement_type),
			navy: this.generate_random_navy(settlement_type)
		}
		if (settlement_type === civitas.CITY || settlement_type === civitas.METROPOLIS) {
			settlement.trades = resources.trades;
		}
		return settlement;
	};

	/**
	 * Create the player settlement.
	 * 
	 * @private
	 * @param {String} name
	 * @param {String} cityname
	 * @param {Number} nation
	 * @param {Number} climate
	 * @param {Number} avatar
	 * @returns {civitas.game}
	 */
	this._create_settlement = function (name, cityname, nation, climate, avatar) {
		var difficulty = this.difficulty();
		this.add_settlement({
			name: cityname,
			climate: climate,
			avatar: avatar,
			religion: civitas.RELIGION_NONE,
			nationality: nation,
			location: civitas['SETTLEMENT_LOCATION_' + civitas.CLIMATES[climate].toUpperCase()],
			army: civitas.START_ARMY[difficulty - 1].army,
			navy: civitas.START_ARMY[difficulty - 1].navy,
			resources: civitas.START_RESOURCES[difficulty - 1],
			core: this
		}, 0, {
			name: name,
			avatar: avatar
		});
		this.get_settlement()._create_buildings(civitas.START_BUILDINGS);
		return this;
	};

	/**
	 * Add a settlement into the world.
	 * 
	 * @public
	 * @param {Object} settlement_data
	 * @param {Number} id
	 * @param {Object} player_data
	 * @returns {Mixed}
	 */
	this.add_settlement = function(settlement_data, id, player_data) {
		if (this.get_num_settlements() <= civitas.MAX_SETTLEMENTS) {
			var new_settlement;
			var ruler;
			var climate;
			var climate_buildings;
			var player = false;
			if (typeof id === 'undefined') {
				id = this.get_num_settlements() + 1;
			}
			if (typeof player_data !== 'undefined') {
				player = true;
			}
			if (player === false) {
				settlement_data.type = settlement_data.type;
				ruler = {
					title: 'Mayor',
					avatar: civitas.utils.get_random(1, 48),
					personality: civitas.utils.get_random(1, 3),
					name: civitas.utils.get_random_unique(civitas.NAMES)
				};
			} else {
				id = 0;
				ruler = {
					name: player_data.name,
					title: '',
					avatar: player_data.avatar,
					personality: civitas.PERSONALITY_BALANCED
				}
			}
			new_settlement = new civitas.objects.settlement({
				core: this,
				properties: {
					id: id,
					type: typeof settlement_data.type !== 'undefined' ? settlement_data.type : civitas.CITY,
					name: typeof settlement_data.name !== 'undefined' ? settlement_data.name : civitas.utils.get_random_unique(civitas.SETTLEMENT_NAMES),
					player: player,
					level: typeof settlement_data.level !== 'undefined' ? settlement_data.level : 1,
					religion: typeof settlement_data.religion !== 'undefined' ? settlement_data.religion : civitas.RELIGION_CHRISTIANITY,
					climate: typeof settlement_data.climate !== 'undefined' ? settlement_data.climate : civitas.CLIMATE_TEMPERATE,
					ruler: ruler,
					nationality: settlement_data.nationality,
					icon: settlement_data.type === civitas.CITY && typeof settlement_data.icon !== 'undefined' ? settlement_data.icon : 1
				},
				resources: typeof settlement_data.resources !== 'undefined' ? settlement_data.resources : {},
				army: typeof settlement_data.army !== 'undefined' ? settlement_data.army : {},
				navy: typeof settlement_data.navy !== 'undefined' ? settlement_data.navy : {},
				trades: typeof settlement_data.trades !== 'undefined' ? settlement_data.trades : {},
				location: this.get_point_outside_area(settlement_data.type)
			});
			if (player === false) {
				if (settlement_data.type === civitas.CITY || settlement_data.type === civitas.METROPOLIS) {
					climate = new_settlement.climate();
					climate_buildings = 'SETTLEMENT_BUILDINGS_' + climate.name.toUpperCase();
					new_settlement._create_buildings(civitas[climate_buildings], true);
				}
				this.get_settlement().status(id, {
					influence: 50,
					status: civitas.DIPLOMACY_TRUCE
				});
			}
			this.settlements.push(new_settlement);
		} else {
			return false;
		}
		return this;
	};

	/**
	 * Remove a settlement from the world
	 * 
	 * @public
	 * @param {Number} id
	 * @returns {Boolean}
	 */
	this.disband_city = function(id) {
		// TODO
		if (typeof this.settlements[id] !== 'undefined') {
			this.settlements.splice(id, 1);
			return true;
		} else {
			return false;
		}
	};

	/**
	 * Create all the other settlements in the world.
	 * 
	 * @private
	 * @param {Object} data
	 * @returns {civitas.game}
	 */
	this._setup_neighbours = function (data) {
		var new_settlement;
		var settlement_data;
		var climate;
		var climate_buildings;
		if (data !== null) {
			for (var i = 1; i < data.settlements.length; i++) {
				settlement_data = data.settlements[i];
				settlement_data.core = this;
				new_settlement = new civitas.objects.settlement(settlement_data);
				climate = new_settlement.climate();
				climate_buildings = 'SETTLEMENT_BUILDINGS_' + climate.name.toUpperCase();
				new_settlement._create_buildings(civitas[climate_buildings], true);
				this.settlements.push(new_settlement);
			}
		} else {
			for (var i = 0; i < civitas.MAX_INITIAL_SETTLEMENTS; i++) {
				this.add_random_settlement();
			}
		}
		return this;
	};

	/**
	 * Add a random settlement into the world.
	 * 
	 * @public
	 * @returns {civitas.game}
	 */
	this.add_random_settlement = function() {
		this.add_settlement(this.generate_random_settlement_data());
		return this;
	};

	/**
	 * Reset (empty) game storage data.
	 * 
	 * @param {String} key
	 * @public
	 * @returns {civitas.game}
	 */
	this.reset_storage_data = function(key) {
		if (typeof key === 'undefined') {
			key = 'live';
		}
		localStorage.removeItem(civitas.STORAGE_KEY + '.' + key);
		return this;
	};

	/**
	 * Encrypt data using AES encryption.
	 *
	 * @public
	 * @param {String} data
	 * @returns {String}
	 */
	this.encrypt = function(data) {
		var salt = CryptoJS.lib.WordArray.random(128 / 8);
		var key = CryptoJS.PBKDF2(this.encryption.key, salt, {
			keySize: this.encryption.key_size / 32,
			iterations: this.encryption.iterations
		});
		var iv = CryptoJS.lib.WordArray.random(128 / 8);
		var encrypted = CryptoJS.AES.encrypt(data, key, { 
			iv: iv,
			padding: this.encryption.padding,
			mode: this.encryption.mode
		});
		return salt.toString() + iv.toString() + encrypted.toString();
	};

	/**
	 * Decrypt data using AES encryption.
	 *
	 * @public
	 * @param {String} data
	 * @returns {String}
	 */
	this.decrypt = function(data) {
		var salt = CryptoJS.enc.Hex.parse(data.substr(0, 32));
		var iv = CryptoJS.enc.Hex.parse(data.substr(32, 32))
		var encrypted = data.substring(64);
		var key = CryptoJS.PBKDF2(this.encryption.key, salt, {
			keySize: this.encryption.key_size / 32,
			iterations: this.encryption.iterations
		});
		var decrypted = CryptoJS.AES.decrypt(encrypted, key, { 
			iv: iv, 
			padding: this.encryption.padding,
			mode: this.encryption.mode
		});
		try {
			decrypted = decrypted.toString(CryptoJS.enc.Utf8);
		} catch (err) {
			return false;
		}
		return decrypted;
	};

	/**
	 * Set game storage data.
	 * 
	 * @param {String} key
	 * @param {Mixed} value
	 * @public
	 * @returns {civitas.game}
	 */
	this.set_storage_data = function (key, value) {
		if (civitas.ENCRYPTION === true) {
			localStorage.setItem(civitas.STORAGE_KEY + '.' + key, this.encrypt(JSON.stringify(value)));
		} else {
			localStorage.setItem(civitas.STORAGE_KEY + '.' + key, JSON.stringify(value));
		}
		return this;
	};

	/**
	 * Set game storage data as text.
	 * 
	 * @param {String} key
	 * @param {Mixed} value
	 * @public
	 * @returns {civitas.game}
	 */
	this.set_storage_data_as_text = function (key, value) {
		if (civitas.ENCRYPTION === true) {
			localStorage.setItem(civitas.STORAGE_KEY + '.' + key, this.encrypt(value));
		} else {
			localStorage.setItem(civitas.STORAGE_KEY + '.' + key, value);
		}
		return this;
	};

	/**
	 * Check if there is any stored data.
	 *
	 * @param {String} key
	 * @public
	 * @returns {Boolean}
	 */
	this.has_storage_data = function(key) {
		if (typeof key === 'undefined') {
			key = 'live';
		}
		if (localStorage.getItem(civitas.STORAGE_KEY + '.' + key) !== null) {
			return true;
		} else {
			return false;
		}
	};

	/**
	 * Retrieve game storage data.
	 * 
	 * @param {String} key
	 * @param {Boolean} as_text
	 * @public
	 * @returns {Mixed}
	 */
	this.get_storage_data = function (key, as_text) {
		if (typeof key === 'undefined') {
			key = 'live';
		}
		if (this.has_storage_data(key)) {
			if (civitas.ENCRYPTION === true) {
				var decrypted = this.decrypt(localStorage.getItem(civitas.STORAGE_KEY + '.' + key));
			} else {
				var decrypted = localStorage.getItem(civitas.STORAGE_KEY + '.' + key);	
			}
			if (decrypted !== false) {
				if (as_text === true) {
					return decrypted;
				} else {
					return JSON.parse(decrypted);
				}
			}
		}
		return false;
	};

	/**
	 * Import game data.
	 *
	 * @public
	 * @returns {Object}
	 */
	this.import = function(data) {
		if (data !== false) {
			this.difficulty(data.difficulty);
			this.worldmap(data.worldmap);
			this.queue(data.queue);
			this.achievements(data.achievements);
			this.achievement_points(data.achievement_points);
			this.date(data.date);
			this.set_black_market(data.black_market);
			this.set_settings_music(data.settings.music);
		} else {
			return false;
		}
		return data;
	};

	/**
	 * Export game data.
	 *
	 * @public
	 * @param {Boolean} to_local_storage
	 * @returns {Object}
	 */
	this.export = function(to_local_storage) {
		var settlement = this.get_settlement();
		var settlements_list = [];
		for (var i = 0; i < this.settlements.length; i++) {
			if (typeof this.settlements[i] !== 'undefined') {
				settlements_list.push(this.settlements[i].export());
			}
		}
		var data = {
			settlements: settlements_list,
			difficulty: this.difficulty(),
			achievements: this.achievements(),
			achievement_points: this.achievement_points(),
			black_market: this.get_black_market(),
			date: this.date(),
			queue: this.queue(),
			worldmap: this.worldmap(),
			settings: this.get_settings(),
			info: {
				version: civitas.VERSION
			}
		};
		var hash = CryptoJS.SHA512(JSON.stringify(data));
		if (to_local_storage === true) {
			var new_data = {
				date: Number(new Date()),
				data: data,
				hash: hash.toString(CryptoJS.enc.Hex)
			}
			this.set_storage_data('live', new_data);
			return new_data;
		}
		return data;
	};

	/**
	 * Save the game data.
	 * 
	 * @public
	 * @returns {civitas.game}
	 */
	this.save = function () {
		this.export(true);
		return this;
	};
	
	/**
	 * Return the UI panel specified by its id.
	 *
	 * @public
	 * @param {String} id
	 * @returns {civitas.controls.panel|Boolean}
	 */
	this.get_panel = function(id) {
		var panels = this.get_panels();
		for (var i = 0; i < panels.length; i++) {
			if (typeof panels[i] !== 'undefined') {
				if (panels[i].id === id) {
					return panels[i];
				}
			}
		}
		return false;
	};

	/**
	 * Close the UI panel specified by its id.
	 *
	 * @public
	 * @param {String} id
	 * @returns {civitas.game}
	 */
	this.close_panel = function(id) {
		var panels = this.get_panels();
		for (var i = 0; i < panels.length; i++) {
			if (typeof panels[i] !== 'undefined') {
				if (panels[i].id === id) {
					panels.splice(i, 1);
				}
			}
		}
		return this;
	};
		
	/**
	 * Build the game UI.
	 *
	 * @private
	 * @returns {civitas.game}
	 */
	this._build_ui = function() {
		var out = '<section class="ui">' +
				'<header>' +
					'<div class="resource-panel"></div>' +
					'<div class="top-panel">' +
						'<span title="' + civitas.l('City name') + '" class="tips cityname"></span>&nbsp;&nbsp;&nbsp;' +
						'<span title="' + civitas.l('City level') + '" class="tips citylevel"></span>&nbsp;&nbsp;&nbsp;' +
						'<span title="' + civitas.l('City Council') + '" class="tips cityavatar"></span>' +
					'</div>' +
				'</header>' +
				'<section class="game"></section>' +
				'<footer>' +
					'<a href="#" data-action="panel" data-panel="buildings" class="tips" title="' + civitas.l('Buildings') + '"></a>' +
					'<a href="#" data-action="panel" data-panel="storage" class="tips" title="' + civitas.l('Storage Space') + '"></a>' +
					'<a href="#" data-action="panel" data-panel="trades" class="tips" title="' + civitas.l('Trades') + '"></a>' +
					'<a href="#" data-action="panel" data-panel="council" class="tips" title="' + civitas.l('City Council') + '"></a>' +
					'<a href="#" data-action="panel" data-panel="ranks" class="tips" title="' + civitas.l('Ranks') + '"></a>' +
					'<a href="#" data-action="panel" data-panel="world" class="tips" title="' + civitas.l('World Map') + '"></a>' +
					'<a href="#" data-action="panel" data-panel="debug" class="tips" title="' + civitas.l('Debug') + '"></a>' +
					'<a href="#" data-action="panel" data-panel="help" class="tips" title="' + civitas.l('Help') + '"></a>' +
				'</footer>' +
			'</section>' +
			'<audio id="music" loop>' +
				'<source src="music/track1.mp3" type="audio/mpeg">' +
			'</audio>' +
			'<div title="' + civitas.l('Game is doing stuff in the background.') + '" class="loading"></div>';
		$('body').empty().append(out);
		return this;
	};

	/**
	 * Show the game loader.
	 *
	 * @public
	 * @returns {civitas.game}
	 */
	this.show_loader = function() {
		$('.loading').show().tipsy({
			gravity: 'e'
		});
		return this;
	};

	/**
	 * Hide the game loader.
	 *
	 * @public
	 * @returns {civitas.game}
	 */
	this.hide_loader = function() {
		$('.loading').hide();
		return this;
	};

	/**
	 * Refresh the UI and panels.
	 *
	 * @public
	 * @returns {civitas.game}
	 */
	this.refresh = function() {
		this.refresh_panels();
		this.refresh_toolbar();
		this.refresh_ui();
		$('.tipsy').remove();
		$('.tips').tipsy({
			gravity: $.fn.tipsy.autoNS,
			html: true
		});
		$('.resource-panel > span').tipsy({
			gravity: 'n'
		});
		return this;
	};

	/**
	 * Refresh the resources toolbar.
	 *
	 * @public
	 * @returns {civitas.game}
	 */
	this.refresh_toolbar = function() {
		var settlement = this.get_settlement();
		if (typeof settlement !== 'undefined') {
			var resources = settlement.get_resources();
			for (var i = 0; i < civitas.TOOLBAR_RESOURCES.length; i++) {
				var resource = civitas.TOOLBAR_RESOURCES[i];
				if (typeof resources[resource] !== 'undefined') {
					$('.resource-panel .' + resource).attr('title', resources[resource] + ' ' + civitas.utils.get_resource_name(resource));
				}
			}
		}
		return this;
	};

	/**
	 * Refresh all the UI information after a property change.
	 * 
	 * @public
	 * @returns {civitas.game}
	 */
	this.refresh_ui = function () {
		var settlement = this.get_settlement();
		if (typeof settlement !== 'undefined') {
			$('.citylevel').html(settlement.level());
			if (settlement.fame() >= civitas.LEVELS[settlement.level()]) {
				settlement.level_up();
			}
		}
		return this;
	};

	/**
	 * Force refresh of the UI panels open.
	 *
	 * @public
	 * @returns {civitas.game}
	 */
	this.refresh_panels = function() {
		var panels = this.get_panels();
		for (var x = 0; x < panels.length; x++) {
			if (typeof panels[x] !== 'undefined') {
				panels[x].on_refresh();
			}
		}
		return this;
	};

	/**
	 * Perform a normal notification in the game.
	 * 
	 * @public
	 * @param {String} message
	 * @param {String} title
	 * @param {Number} timeout
	 * @returns {civitas.game}
	 */
	this.notify = function (message, title, timeout) {
		this._notify({
			title: (typeof title !== 'undefined') ? title : civitas.l('City Council'),
			content: message,
			timeout: typeof timeout !== 'undefined' ? timeout : 15000
		});
		this.log('game', message);
		return this;
	};

	/**
	 * Internal function for performing an UI notification.
	 * 
	 * @param {type} settings
	 * @returns {civitas.game}
	 * @private
	 */
	this._notify = function (settings) {
		var container, notty, hide, image, right, left, inner, _container;
		settings = $.extend({
			title: undefined,
			content: undefined,
			timeout: 15000,
			img: undefined,
			mode: civitas.NOTIFY_NORMAL
		}, settings);
		if (settings.mode === civitas.NOTIFY_ACHIEVEMENT) {
			_container = 'achievements-notifications';
		} else {
			_container = 'notifications';
		}
		container = $('.' + _container);
		if (!container.length) {
			container = $("<div>", {
				'class': _container
			}).appendTo(document.body);
		}
		$('.achievements-notifications').css({
			left: ($(window).width() / 2) - (container.width() / 2)
		});
		notty = $('<div>');
		notty.addClass('notty');
		hide = $("<div>", {
			click: function () {
				$(this).parent().delay(300).queue(function () {
					$(this).clearQueue();
					$(this).remove();
				});
			},
			touchstart: function () {
				$(this).parent().delay(300).queue(function () {
					$(this).clearQueue();
					$(this).remove();
				});
			}
		});
		hide.addClass('hide');
		if (settings.mode === civitas.NOTIFY_ERROR) {
			notty.addClass('error');
			settings.img = civitas.ASSETS_URL + 'images/assets/ui/icon_error.png';
		} else if (settings.mode === civitas.NOTIFY_EVENT) {
			notty.addClass('event');
			settings.img = civitas.ASSETS_URL + 'images/assets/ui/icon_research.png';
		} else if (settings.mode === civitas.NOTIFY_ACHIEVEMENT) {
			notty.addClass('achievement');
			settings.img = civitas.ASSETS_URL + 'images/assets/ui/icon_achievement.png';
		} else {
			settings.img = civitas.ASSETS_URL + 'images/assets/ui/icon_notification.png';
		}
		image = $('<div>', {
			style: "background: url('" + settings.img + "')"
		});
		image.addClass('img');
		left = $("<div class='left'>");
		right = $("<div class='right'>");
		inner = $('<div>', {
			html: '<h2>' + settings.title + '</h2>' + settings.content
		});
		inner.addClass("inner");
		inner.appendTo(right);
		image.appendTo(left);
		left.appendTo(notty);
		right.appendTo(notty);
		hide.appendTo(notty);
		if (settings.mode !== civitas.NOTIFY_ACHIEVEMENT) {
			var timestamp = Number(new Date());
			var timeHTML = $("<div>", {
				html: "<strong>" + civitas.utils.time_since(timestamp) + "</strong> ago"
			});
			timeHTML.addClass("time").attr("title", timestamp);
			timeHTML.appendTo(right);
			setInterval(function () {
				$(".time").each(function () {
					var timing = $(this).attr("title");
					$(this).html("<strong>" + civitas.utils.time_since(timing) + "</strong> ago");
				});
			}, 4000);
		}
		notty.hover(function () {
			hide.show();
		}, function () {
			hide.hide();
		});
		notty.prependTo(container);
		notty.show();
		if (settings.timeout) {
			setTimeout(function () {
				notty.delay(300).queue(function () {
					$(this).clearQueue();
					$(this).remove();
				});
			}, settings.timeout);
		}
		return this;
	};

	/**
	 * Perform an error notification in the game.
	 * 
	 * @public
	 * @param {String} message
	 * @param {String} title
	 * @param {Boolean} no_console
	 * @returns {civitas.game}
	 */
	this.error = function (message, title, no_console) {
		this._notify({
			title: (typeof title !== 'undefined') ? title : civitas.l('City Council'),
			mode: civitas.NOTIFY_ERROR,
			content: message
		});
		if (typeof no_console === 'undefined' || no_console === false) {
			this.log('game', message, true);
		}
		return this;
	};

	/**
	 * Setup the UI.
	 * 
	 * @private
	 * @returns {civitas.game}
	 */
	this._setup_ui = function () {
		var self = this;
		var clicked = false;
		var clickY, clickX;
		var _t = '';
		$('.game').on({
			mousemove: function (event) {
				clicked && update_scroll_pos(event);
				//handle_mouse(event);
			},
			mousedown: function (event) {
				clicked = true;
				clickY = event.pageY;
				clickX = event.pageX;
				$('html').css('cursor', 'grab');
			},
			mouseup: function () {
				clicked = false;
				$('html').css('cursor', 'auto');
			}
		});
		var x, y;
		function handle_mouse(event) {
			if (x && y) {
				window.scrollBy(event.clientX - x, event.clientY - y);
			}
			x = event.clientX;
			y = event.clientY;
		}
		$(window).bind('resize', function() {
			self._resize();
		});
		var update_scroll_pos = function (event) {
			$(window).scrollTop($(window).scrollTop() + (clickY - event.pageY));
			$(window).scrollLeft($(window).scrollLeft() + (clickX - event.pageX));
		};
		for (var i = 0; i < civitas.TOOLBAR_RESOURCES.length; i++) {
			_t += '<span class="' + civitas.TOOLBAR_RESOURCES[i] + '" style="background: transparent url(' + civitas.ASSETS_URL + 'images/assets/resources/' + civitas.TOOLBAR_RESOURCES[i] + '_small.png) no-repeat"></span>';
		}
		$('.resource-panel').empty().append(_t);
		$('.ui').on('click', '.cityavatar', function () {
			self.open_panel(civitas.PANEL_COUNCIL);
			return false;
		}).on('click', 'a[data-action=panel]', function () {
			var panel = $(this).data('panel').toUpperCase();
			if (typeof civitas['PANEL_' + panel] !== 'undefined') {
				self.open_panel(civitas['PANEL_' + panel]);
			}
			return false;
		});
		self._resize();
		return this;
	};

	/**
	 * Resize the UI.
	 *
	 * @private
	 * @returns {civitas.game}
	 */
	this._resize = function() {
		$('.ui > footer').css({
			left: ($(window).width() / 2) - ($('.ui > footer').width() / 2)
		});
		return this;
	};

	/**
	 * Get the panels open in the game.
	 * 
	 * @public
	 * @returns {Array}
	 */
	this.get_panels = function() {
		return this.panels;
	};

	/**
	 * Open a UI panel.
	 *
	 * @public
	 * @param {Object} panel_data
	 * @param {Object} extra_data
	 * @returns {civitas.controls.panel}
	 */
	this.open_panel = function(panel_data, extra_data) {
		panel_data.core = this;
		if (typeof extra_data !== 'undefined') {
			panel_data.data = extra_data;
		}
		var panel = new civitas.controls.panel(panel_data);
		this.panels.push(panel);
		return panel;
	};

	/**
	 * Open a UI window.
	 *
	 * @public
	 * @param {Object} window_data
	 * @param {Object} extra_data
	 * @returns {civitas.controls.window}
	 */
	this.open_window = function(window_data, extra_data) {
		window_data.core = this;
		if (typeof extra_data !== 'undefined') {
			window_data.data = extra_data;
		}
		return new civitas.controls.window(window_data);
	};

	/**
	 * Open a modal window (usually to ask for confirmations).
	 *
	 * @public
	 * @param {Function} callback
	 * @param {String} text
	 * @param {String} title
	 * @returns {civitas.game}
	 */
	this.open_modal = function(callback, text, title) {
		var modal = new civitas.controls.modal({
			core: this
		});
		modal.alert({
			title: typeof title !== 'undefined' ? title : 'City Council',
			text: text,
			on_click: callback
		});
		return this;
	};

	/**
	 * Log data to the console.
	 * 
	 * @public
	 * @param {String} namespace
	 * @param {String} message
	 * @param {Boolean} error
	 * @returns {civitas.game}
	 */
	this.log = function (namespace, message, error) {
		if ($('#panel-debug .console p').length > civitas.MAX_CONSOLE_LINES) {
			$('#panel-debug .console').empty();
		}
		$('#panel-debug .console').prepend('<p><span class="date">' + civitas.utils.get_now() + '</span><span class="namespace game-' + namespace + '">' + namespace.toUpperCase() + '</span>' + (error === true ? '<span class="error">ERROR</span>' : '') + '<span' + (error === true ? ' class="error-message"' : ' class="log-message"') + '>' + message + '</span></p>');
		return this;
	};

	// Fire up the constructor
	return this.__init();
};

$(document).ready(function () {
	new civitas.game();
});
