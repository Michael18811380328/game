/**
 * Main Game window object.
 * 
 * @param {Object} params
 * @class {civitas.controls.window}
 * @returns {civitas.controls.window}
 */
civitas.controls.window = function (params) {

	/**
	 * DOM handle of this window.
	 *
	 * @private
	 * @type {String}
	 */
	this._handle = null;

	/**
	 * Data passed to this window.
	 *
	 * @private
	 * @type {Object}
	 */
	this.params_data = null;

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
	 * @type {String}
	 * @private
	 */
	this.id = null;

	/**
	 * Localized title of the window.
	 * 
	 * @private
	 * @type {String}
	 */
	this.title = null;

	/**
	 * Callback function when the window is shown (created).
	 *
	 * @public
	 * @type {Function}
	 */
	this.on_show = null;

	/**
	 * Callback function when the window is hidden (destroyed).
	 *
	 * @public
	 * @type {Function}
	 */
	this.on_hide = null;

	/**
	 * Object destructor.
	 * 
	 * @private
	 * @returns {Boolean}
	 */
	this.__destroy = function () {
		this.core().log('ui', 'Destroying window with id `' + this.id() + '`');
		$(this.handle()).remove();
		$('.tipsy').remove();
		this.on_hide.call(this);
		return false;
	};

	/**
	 * Method for destroying the window.
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
	 * @returns {civitas.controls.window}
	 * @param {Object} params
	 */
	this.__init = function (params) {
		this._core = params.core;
		this._id = params.id;
		this._handle = '#window-' + this.id();
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
		if (civitas.ui.window_exists(this.handle())) {
			this.destroy();
		}
		this.core().log('ui', 'Creating window with id `' + this.id() + '`');
		$('body').append(params.template.replace(/{ID}/g, this.id()));
		this.on_show.call(this);
		$('.tipsy').remove();
		$('.tips').tipsy({
			gravity: $.fn.tipsy.autoNS,
			html: true
		});
		return this;
	};

	/**
	 * Return a pointer to the window id.
	 *
	 * @public
	 * @returns {String}
	 */
	this.id = function() {
		return this._id;
	};

	/**
	 * Return a pointer to the window DOM handle.
	 *
	 * @public
	 * @returns {String}
	 */
	this.handle = function() {
		return this._handle;
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
