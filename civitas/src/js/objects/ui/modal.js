/**
 * Main modal object.
 * 
 * @param {Object} params
 * @class {civitas.controls.modal}
 * @returns {civitas.controls.modal}
 */
civitas.controls.modal = function (params) {

	/**
	 * Reference to the core object.
	 *
	 * @private
	 * @type {civitas.game}
	 */
	this._core = null;

	/**
	 * Template of the modal window.
	 *
	 * @private
	 * @type {String}
	 */
	this._template = '<div class="modal-overlay">' +
			'<div class="modal">' +
				'<header></header>' +
				'<section></section>' +
				'<footer></footer>' +
			'</div>' +
		'</div>';

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @returns {civitas.controls.modal}
	 * @param {Object} params
	 */
	this.__init = function(params) {
		this._core = params.core;
		var self = this;
		$('body').append(this._template);
		$(window).bind('resize', function() {
			self._resize();
		});
		return this;
	};

	/**
	 * Main method to show the modal window.
	 *
	 * @public
	 * @param {Object} options
	 * @returns {civitas.objects.modal}
	 */
	this.alert = function(options) {
		var self = this;
		var settlement = false;
		if (this.core().settlements.length > 0) {
			settlement = this.core().get_settlement();
		}
		if (this._is_open()) {
			return false;
		}
		this.core().show_loader();
		$('.modal').css({
			width: '400px'
		});
		this._resize();
		$('.modal header').html(options.title);
		$('.modal footer').html('<a data-id="yes" href="#" class="btn float-right">' + civitas.l('Yes') + '</a><a data-id="no" href="#" class="btn">' + civitas.l('No') + '</a>');
		$('.modal section').html((settlement ? '<img class="avatar" src="' + civitas.ASSETS_URL + 'images/assets/avatars/avatar' + this.core().get_settlement().ruler().avatar + '.png" />' : '') + '<p>' + options.text + '</p>');
		$('.modal footer').on('click', 'a', function() {
			self._action($(this).data('id'));
			return false;
		});
		$('.modal-overlay, .modal').show();
		if (typeof options.on_click === 'function') {
			this.on_click = options.on_click;
		}
		return this;
	};

	/**
	 * Internal method to check out if the modal window is already open.
	 *
	 * @private
	 * @returns {Boolean}
	 */
	this._is_open = function() {
		return $('.modal').css('display') === "block";
	};

	/**
	 * Internal method for resetting the modal window.
	 *
	 * @private
	 * @returns {Boolean}
	 */
	this._clear = function() {
		$('.modal-overlay').remove();
		// $('body').append(this._template);
		this.core().hide_loader();
		// this._resize();
		return true;
	};

	/**
	 * Internal method for triggering the click event on the buttons.
	 *
	 * @private
	 * @param {String} key
	 */
	this._action = function(key) {
		this._clear();
		this.on_click(key);
		$(window).unbind('resize');
	};

	/**
	 * Internal method for resizing the modal window.
	 *
	 * @private
	 * @returns {civitas.objects.modal}
	 */
	this._resize = function() {
		var lbox = $('.modal');
		var height = parseInt((lbox.css('height')).replace('px', ''));
		var width = parseInt((lbox.css('width')).replace('px', ''));
		lbox.css({
			top: ($(window).height() / 2) - 100 + 'px',
			left: ($(window).width() - width) / 2 + 'px'
		});
		return this;
	};

	/**
	 * Callback function.
	 *
	 * @public
	 */
	this.on_click = function() {
		// nothing here, move along.
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

	/**
	 * Object destructor.
	 * 
	 * @private
	 * @returns {Boolean}
	 */
	this.__destroy = function() {
		$('.modal-overlay').remove();
		$(window).unbind('resize');
		return false;
	};

	// Fire up the constructor
	return this.__init(params);
};
