/**
 * Hero object.
 * 
 * @param {Object} params
 * @class {civitas.objects.hero}
 * @returns {civitas.objects.hero}
 */
civitas.objects.hero = function (params) {

	/**
	 * Reference to the core object.
	 *
	 * @private
	 * @type {civitas.game}
	 */
	this._core = null;

	/**
	 * Name of the hero.
	 *
	 * @private
	 * @type {String}
	 */
	this._name = null;

	/**
	 * Description of the hero.
	 *
	 * @private
	 * @type {String}
	 */
	this._description = null;

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @returns {civitas.objects.hero}
	 * @param {Object} params
	 */
	this.__init = function (params) {
		this._core = params.core;
		this._name = params.name;
		this._description = params.description;
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
