/**
 * Main Game AI (Artificial Intelligence) object.
 * 
 * @param {Object} params
 * @class {civitas.modules.ai}
 * @returns {civitas.modules.ai}
 */
civitas.modules.ai = function (params) {

	/**
	 * Reference to the core object.
	 * 
	 * @private
	 * @type {civitas.game}
	 */
	this._core = null;

	/**
	 * Personality type for this AI.
	 *
	 * @private
	 * @type {Number}
	 */
	this._type = null;

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @returns {civitas.modules.ai}
	 * @param {Object} params
	 */
	this.__init = function (params) {
		this._core = params.core;
		this._type = params.type;
		// Todo
		return this;
	};

	/**
	 * Perform the actual data processing for this AI.
	 *
	 * @public
	 * @returns {Boolean}
	 */
	this.process = function() {
		// Todo
		return true;
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
