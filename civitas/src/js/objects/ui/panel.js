/**
 * Main Game panel object.
 * 
 * @param {Object} params
 * @class {civitas.controls.panel}
 * @returns {civitas.controls.panel}
 */
civitas.controls.panel = function (params) {

	/**
	 * DOM handle of this panel.
	 *
	 * @private
	 * @type {String}
	 */
	this.handle = null;

	/**
	 * Reference to the core object.
	 *
	 * @private
	 * @type {civitas.game}
	 */
	this._core = null;

	/**
	 * DOM id of this panel.
	 *
	 * @private
	 * @type {String}
	 */
	this.id = null;

	/**
	 * Data passed to this panel.
	 *
	 * @private
	 * @type {Object}
	 */
	this.params_data = null;

	/**
	 * Localized title of the panel.
	 *
	 * @private
	 * @type {String}
	 */
	this.title = null;

	/**
	 * Callback function when the panel is shown.
	 *
	 * @public
	 * @type {Function}
	 */
	this.on_show = null;

	/**
	 * Callback function when the panel is hidden (destroyed).
	 *
	 * @public
	 * @type {Function}
	 */
	this.on_hide = null;

	/**
	 * Callback function when the panel is refreshed.
	 *
	 * @public
	 * @type {Function}
	 */
	this.on_refresh = null;

	/**
	 * Object destructor.
	 * 
	 * @private
	 * @returns {Boolean}
	 */
	this.__destroy = function () {
		this.core().log('ui', 'Destroying panel with id `' + this.id + '`');
		$(this.handle).remove();
		var panels = this.core().get_panels();
		for (var i = 0; i < panels.length; i++) {
			if (panels[i].id === this.id) {
				panels.splice(i, 1);
			}
		}
		$('.tipsy').remove();
		this.on_hide.call(this);
		return false;
	};

	/**
	 * Method for destroying the panel.
	 * 
	 * @public
	 * @returns {Boolean}
	 */
	this.destroy = function () {
		return this.__destroy();
	};

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @returns {civitas.controls.panel}
	 * @param {Object} params
	 */
	this.__init = function (params) {
		var self = this;
		this._core = params.core;
		this.id = params.id;
		this.handle = '#panel-' + this.id;
		this.params_data = params.data;
		if (params.on_show instanceof Function) {
			this.on_show = params.on_show;
		} else {
			this.on_show = function() {};
		}
		if (params.on_hide instanceof Function) {
			this.on_hide = params.on_hide;
		} else {
			this.on_hide = function() {};
		}
		if (params.on_refresh instanceof Function) {
			this.on_refresh = params.on_refresh;
		} else {
			this.on_refresh = function() {};
		}
		if (civitas.ui.panel_exists(this.handle)) {
			this.destroy();
		}
		this.core().log('ui', 'Creating panel with id `' + this.id + '`');
		var tpl = params.template.replace(/{ID}/g, params.id);
		if (typeof this.params_data !== 'undefined' && 
			typeof this.params_data.name !== 'undefined' &&
			typeof this.params_data.name !== 'function') {
			tpl = tpl.replace(/{BUILDING}/g, this.params_data.handle);
			$('.ui').append(tpl);
			$(this.handle + ' header').append(this.params_data.name);
		} else {
			$('.ui').append(tpl);
		}
		this.on_show.call(this, params);
		this.on_refresh.call(this, params);
		if (typeof params.data !== 'undefined') {
			var building = this.core().get_settlement().get_building(params.data.handle);
			if (building !== false) {
				if (!building.is_upgradable()) {
					$(this.handle + ' footer .upgrade').hide();
				}
				if (!building.is_downgradable()) {
					$(this.handle + ' footer .downgrade').hide();
				}
				if (building.is_marketplace()) {
					$(this.handle + ' footer .demolish').hide();
				}
				if (building.is_production_building()) {
					if (!building.is_stopped()) {
						$(this.handle + ' .pause').removeClass('start').attr('title', civitas.l('Stop production'));
					} else {
						$(this.handle + ' .start').removeClass('pause').attr('title', civitas.l('Start production'));
					}
				} else {
					$(this.handle + ' .start, ' + this.handle + ' .pause').hide();
				}
				$(this.handle).on('click', '.upgrade', function () {
					self.core().open_modal(
						function(button) {
							if (button === 'yes') {
								if (building.upgrade()) {
									if (!building.is_upgradable()) {
										$(self.handle + ' footer .upgrade').hide();
									} else {
										$(self.handle + ' footer .downgrade').show();
									}
								}
							}
						},
						'Are you sure you want to upgrade this building?'
					);
					return false;
				}).on('click', '.downgrade', function () {
					self.core().open_modal(
						function(button) {
							if (button === 'yes') {
								if (building.downgrade()) {
									if (!building.is_downgradable()) {
										$(self.handle + ' footer .downgrade').hide();
									} else {
										$(self.handle + ' footer .upgrade').show();
									}
								}
							}
						},
						'Are you sure you want to downgrade this building?'
					);
					return false;
				}).on('click', '.demolish', function () {
					self.core().open_modal(
						function(button) {
							if (button === 'yes') {
								if (building.demolish(true)) {
									self.destroy();
									self.core().save_and_refresh();
								}
							}
						},
						'Are you sure you want to demolish this building?'
					);
					return false;
				}).on('click', '.pause', function () {
					if (building.stop_production()) {
						$(this).removeClass('pause').addClass('start');
						$(this).attr('title', civitas.l('Start production'));
					}
					return false;
				}).on('click', '.start', function () {
					if (building.start_production()) {
						$(this).removeClass('start').addClass('pause');
						$(this).attr('title', civitas.l('Stop production'));
					}
					return false;
				});
			}
		}
		$(this.handle).on('click', 'header', function () {
			$('.ui .panel').css({
				'z-index': 99996
			});
			$(self.handle).css({
				'z-index': 99997
			});
		}).on('click', '.close', function () {
			self.destroy();
			return false;
		}).draggable({
			handle: 'header',
			containment: 'window',
			start: function() {
		        $(this).css({
		        	height: 'auto'
		        });
		    },
		    stop: function() {
		        $(this).css({
		        	height: 'auto'
		        });
		    }
		});
		$(this.handle + ' .tabs').tabs();
		$(this.handle).css({
			'left': ($(window).width() / 2) - ($(this.handle).width() / 2),
			'top': ($(window).height() / 2) - ($(this.handle).height() / 2)
		});
		$('.tipsy').remove();
		$('.tips').tipsy({
			gravity: $.fn.tipsy.autoNS,
			html: true
		});
		return this;
	};

	/**
	 * Return a pointer to the game core.
	 *
	 * @public
	 * @returns {civitas.game}
	 */
	this.core = function() {
		return this._core;
	};

	// Fire up the constructor
	return this.__init(params);
};
