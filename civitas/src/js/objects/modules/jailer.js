/**
 * Game jailer (enforcing security) object.
 * 
 * @param {Object} params
 * @class {civitas.modules.jailer}
 * @returns {civitas.modules.jailer}
 */
civitas.modules.jailer = function (params) {

	/**
	 * Reference to the core object.
	 *
	 * @private
	 * @type {civitas.game}
	 */
	this._core = null;

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @returns {civitas.modules.jailer}
	 * @param {Object} params
	 */
	this.__init = function (params) {
		this._core = params.core;
		// Todo
		return this;
	};

	/**
	 * Perform an actual security audit.
	 * 
	 * @public
	 * @returns {Boolean}
	 */
	this.check = function () {
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
