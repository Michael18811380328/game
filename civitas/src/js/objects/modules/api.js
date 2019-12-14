/**
 * Main Game API object.
 * 
 * @param {Object} params
 * @class {civitas.modules.api}
 * @returns {civitas.modules.api}
 */
civitas.modules.api = function (params) {

	/**
	 * Reference to the core object.
	 *
	 * @private
	 * @type {civitas.game}
	 */
	this._core = null;

	/**
	 * Sign in a visitor using the specified data.
	 * 
	 * @param {Object} data
	 * @returns {civitas.modules.api}
	 */
	this.login = function (data) {
		return this.request({
			url: 'login',
			data: data
		});
	};

	/**
	 * Sign out the currently logged in user.
	 * 
	 * @returns {civitas.modules.api}
	 */
	this.logout = function () {
		return this.request({
			url: 'logout'
		});
	};

	/**
	 * Get information about the application and API version.
	 *
	 * @returns {civitas.modules.api}
	 */
	this.api_version = function() {
		return this.request({
			url: 'version'
		});
	};

	/**
	 * Get information about the currently logged in user's city.
	 *
	 * @returns {civitas.modules.api}
	 */
	this.city_info = function() {
		return this.request({
			url: 'city'
		});
	};

	/**
	 * Perform a heartbeat request and get data about it.
	 *
	 * @returns {civitas.modules.api}
	 */
	this.heartbeat = function() {
		return this.request({
			url: 'heartbeat'
		});
	};

	/**
	 * Register a visitor using the specified data.
	 * 
	 * @param {Object} data
	 * @returns {civitas.modules.api}
	 */
	this.register = function (data) {
		return this.request({
			url: 'register',
			data: data
		});
	};

	/**
	 * Export the specified data to the API endpoint.
	 * 
	 * @param {Object} data
	 * @returns {civitas.modules.api}
	 */
	this.do_export = function (data) {
		return this.request({
			url: 'export',
			data: data
		});
	};

	/**
	 * Import the specified data from the API endpoint.
	 * 
	 * @param {Object} data
	 * @returns {civitas.modules.api}
	 */
	this.do_import = function (data) {
		return this.request({
			url: 'import',
			data: data
		});
	};

	/**
	 * Internal function for performing an API AJAX request.
	 * 
	 * @param {Object} data
	 * @returns {civitas.modules.api}
	 */
	this._request = function (data) {
		$.ajax({
			type: (typeof data.requestType !== 'undefined') ? data.requestType : 'POST',
			dataType: typeof data.dataType !== 'undefined' ? data.dataType : 'jsonp',
			xhrFields: {
				withCredentials: (typeof data.auth === 'undefined' || data.auth === true) ? 
					true : false
			},
			crossDomain: true,
			data: data.data,
			url: civitas.API_URL + data.url,
			async: (typeof data.async === 'undefined' || data.async == true) ? true : false,
			success: data.success instanceof Function ? data.success : function () {
				// TODO
			},
			error: data.error instanceof Function ? data.error : function () {
				// TODO
			}
		});
		return this;
	};

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @returns {civitas.modules.api}
	 * @param {Object} params
	 */
	this.__init = function (params) {
		this._core = params.core;
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
