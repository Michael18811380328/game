/**
 * Battleground object.
 * 
 * @param {Object} params
 * @class {civitas.objects.battleground}
 * @returns {civitas.objects.battleground}
 */
civitas.objects.battleground = function (params) {

	/**
	 * Reference to the core object.
	 *
	 * @private
	 * @type {civitas.game}
	 */
	this._core = null;

	/**
	 * Battleground properties.
	 *
	 * @private
	 * @type {Object}
	 */
	this._properties = {
		width: 0,
		height: 0
	};

	/**
	* DOM elements for external output.
	*
	* @private
	* @type {Object}
	*/
	this._elements = {
		container: null,
		console: null,
		attack: null,
		defense: null
	};

	/**
	 * Callback when the user wins.
	 *
	 * @type {Function}
	 * public
	 */
	this.on_win = function() {};

	/**
	 * Callback when the user loses.
	 *
	 * @type {Function}
	 * public
	 */
	this.on_lose = function() {};

	/**
	 * Callback when the user selects a cell.
	 *
	 * @type {Function}
	 * public
	 */
	this.on_select = function() {};

	/**
	 * Callback when the user moves a cell.
	 *
	 * @type {Function}
	 * public
	 */
	this.on_move = function() {};

	/**
	 * Callback when the user attacks another cell.
	 *
	 * @type {Function}
	 * public
	 */
	this.on_attack = function() {};

	/**
	 * Callback when the turn ends.
	 *
	 * @type {Function}
	 * public
	 */
	this.on_end_turn = function() {};

	/**
	 * Grid containing info about all battleground units and their properties.
	 *
	 * @type {Array}
	 * @private
	 */
	this._grid = [];

	/**
	 * Object containing the attacking side.
	 *
	 * @private
	 * @type {Object}
	 */
	this._attack = null;

	/**
	 * Object containing the defending side.
	 *
	 * @private
	 * @type {Object}
	 */
	this._defense = null;

	/**
	 * Property that contains the coords of the currently clicked cell.
	 *
	 * @private
	 * @type {Object}
	 */
	this._from = null;

	/**
	 * Flag if the battleground is over.
	 *
	 * @private
	 * @type {Boolean}
	 */
	this.done = false;

	/**
	 * Battleground statistics.
	 *
	 * @private
	 * @type {Object}
	 */
	this._stats = {
		attacking: {
			attack: 0,
			defense: 0
		},
		defending: {
			attack: 0,
			defense: 0
		}
	};

	/**
	 * Current turn for this battleground.
	 *
	 * @private
	 * @type {Number}
	 */
	this._current_turn = 1;

	/**
	 * The side of the player (left attacking, right defending).
	 *
	 * @private
	 * @type {Number}
	 */
	this._player = null;

	/**
	 * The side of the computer (left attacking, right defending).
	 *
	 * @private
	 * @type {Number}
	 */
	this._computer = null;

	/**
	 * Object constructor.
	 * 
	 * @private
	 * @returns {civitas.objects.battleground}
	 * @param {Object} params
	 */
	this.__init = function (params) {
		this._core = params.core;
		this._properties.width = params.width;
		this._properties.height = params.height;
		this._elements.container = params.elements.container;
		this._elements.console = params.elements.console;
		this._elements.attack = params.elements.attack;
		this._elements.defense = params.elements.defense;
		this._attack = params.attack;
		this._defense = params.defense;
		if (params.on_win instanceof Function) {
			this.on_win = params.on_win;
		}
		if (params.on_lose instanceof Function) {
			this.on_lose = params.on_lose;
		}
		if (params.on_select instanceof Function) {
			this.on_select = params.on_select;
		}
		if (params.on_move instanceof Function) {
			this.on_move = params.on_move;
		}
		if (params.on_attack instanceof Function) {
			this.on_attack = params.on_attack;
		}
		if (params.on_end_turn instanceof Function) {
			this.on_end_turn = params.on_end_turn;
		}
		if (this._attack.city === this.core().get_settlement().id()) {
			this._player = 1;
			this._computer = 2;
		} else {
			this._player = 2;
			this._computer = 1;
		}
		this._setup();
		this.show_stats();
		return this;
	};

	/**
	 * Attack a hex cell.
	 *
	 * @public
	 * @param {Object} cell
	 * @returns {Boolean}
	 */
	this.attack = function(cell) {
		var sx = this._from.x;
		var sy = this._from.y;
		var source = this._grid[sy][sx];
		var destination = this._grid[cell.y][cell.x];
		var is_ranged = civitas.SOLDIERS[source.item].ranged;
		var city = this.core().get_settlement(source.city);
		var city2 = this.core().get_settlement(destination.city);
		var remaining = 0;
		if (city && source.moved) {
			this.log(city.name() + '`s <strong>' + civitas.SOLDIERS[source.item].name + '</strong> already used up its turn.');
			return false;
		}
		if (source !== null && destination !== null && city && city2) {
			if (destination.side === civitas.BATTLEGROUND_DEFENSE) {
				var _a = '_defense';
			} else {
				var _a = '_attack';
			}
			if (is_ranged !== undefined) {
				if ((Math.abs(cell.y - sy) + Math.abs(cell.x - sx)) > is_ranged) {
					this.log(city.name() + '`s <strong>' + civitas.SOLDIERS[source.item].name + '</strong> is not close enough for a ranged attack.');
					return false;
				}
				var attack = Math.ceil(source.attack / 2);
				var defense = destination.defense;
				if (defense - attack < 0) {
					this[_a].army[destination.item] = 0;
					this.log(city.name() + '`s <strong>' + civitas.SOLDIERS[source.item].name + '</strong> attacked ' + city2.name() + '`s <strong>' + civitas.SOLDIERS[destination.item].name + '</strong> for ' + attack + ' damage from range and killed its opponent.');
					this._cell_empty(cell);
				} else {
					remaining = Math.ceil((defense - attack) / civitas.SOLDIERS[destination.item].defense);
					destination.total = remaining;
					this[_a].army[destination.item] = remaining;
					this.log(city.name() + '`s <strong>' + civitas.SOLDIERS[source.item].name + '</strong> attacked ' + city2.name() + '`s <strong>' + civitas.SOLDIERS[destination.item].name + '</strong> for ' + attack + ' damage from range.');
				}
				this._cell_under_attack(cell);
				source.moved = true;
				this.redraw();
			} else {
				var can_move = civitas.SOLDIERS[this._grid[sy][sx].item].moves;
				if ((Math.abs(cell.y - sy) + Math.abs(cell.x - sx)) > can_move) {
					this.log(city.name() + '`s <strong>' + civitas.SOLDIERS[source.item].name + '</strong> doesn`t have a ranged attack.');
					return false;
				}
				var attack = Math.ceil(source.attack / 2);
				var defense = destination.defense;
				if (defense - attack < 0) {
					this[_a].army[destination.item] = 0;
					this.log(city.name() + '`s <strong>' + civitas.SOLDIERS[source.item].name + '</strong> attacked ' + city2.name() + '`s <strong>' + civitas.SOLDIERS[destination.item].name + '</strong> for ' + attack + ' damage in melee and killed its opponent.');
					this._cell_empty(cell);
				} else {
					remaining = Math.ceil((defense - attack) / civitas.SOLDIERS[destination.item].defense);
					destination.total = remaining;
					this[_a].army[destination.item] = remaining;
					this.log(city.name() + '`s <strong>' + civitas.SOLDIERS[source.item].name + '</strong> attacked ' + city2.name() + '`s <strong>' + civitas.SOLDIERS[destination.item].name + '</strong> for ' + attack + ' damage in melee.');
				}
				this._cell_under_attack(cell);
				source.moved = true;
				this.redraw();
			}
		}
		this._from = null;
		return true;
	};

	/**
	 * End the current turn.
	 *
	 * @public
	 * @returns {civitas.objects.battleground}
	 */
	this.end_turn = function() {
		this._from = null;
		this._do_computer();
		for (var y = 0; y < this._grid.length; y++) {
			for (var x = 0; x < this._grid[y].length; x++) {
				if (this._grid[y][x] !== null) {
					this._grid[y][x].moved = false;
				}
			}
		}
		this._current_turn++;
		this.on_end_turn.call(self, this.num_turns());
		this.redraw();
		if (!this._done) {
			this.log('Turn <strong>' + this._current_turn + '</strong> started now.');
		}
		return this;
	};

	/**
	* Check the status of the current game.
	*
	* @private
	* @returns {Boolean}
	*/
	this._check_status = function() {
		var city;
		if (!this._done) {
			if (this._stats.attacking.attack <= 0 || this._stats.attacking.defense <= 0 ||
				this._stats.defending.attack <= 0 || this._stats.defending.defense <= 0) {
				this._done = true;
				this._reset();
			}
			if (this._stats.attacking.attack <= 0 || this._stats.attacking.defense <= 0) {
				if (this._defense.city === this.core().get_settlement().id()) {
					this._on_win.call(this, this._defense, this._attack);
					this.on_win.call(this, this._defense, this._attack);
				} else {
					this._on_lose.call(this, this._defense, this._attack);
					this.on_lose.call(this, this._defense, this._attack);
				}
				city = this.core().get_settlement(this._defense.city);
			} else if (this._stats.defending.attack <= 0 || this._stats.defending.defense <= 0) {
				if (this._attack.city === this.core().get_settlement().id()) {
					this._on_win.call(this, this._attack, this._defense);
					this.on_win.call(this, this._attack, this._defense);
				} else {
					this._on_lose.call(this, this._attack, this._defense);
					this.on_lose.call(this, this._attack, this._defense);
				}
				city = this.core().get_settlement(this._attack.city);
			}
			if (this._done) {
				this.log(city.name() + ' won this battle!');
				this.show_stats();
			}
		}
		return false;
	};

	/**
	 * Display the battleground stats.
	 *
	 * @public
	 * @returns {Object}
	 */
	this.show_stats = function() {
		$(this._elements.attack).empty().append(this.core().get_settlement(this._attack.city).name() + ' ' + this._stats.attacking.attack + ' / ' + this._stats.attacking.defense);
		$(this._elements.defense).empty().append(this.core().get_settlement(this._defense.city).name() + ' ' + this._stats.defending.attack + ' / ' + this._stats.defending.defense);
		return {
			attack: this._attack,
			defense: this._defense
		}
	};

	/**
	 * Log a message to the battleground status.
	 *
	 * @public
	 * @param {String} message
	 * @returns {civitas.objects.battleground}
	 */
	this.log = function(message) {
		$(this._elements.console).prepend('<p>' + message + '</p>');
		return this;
	};

	/**
	 * Reset and rebuild the battleground hex cell grid.
	 *
	 * @private
	 * @returns {civitas.objects.battleground}
	 */
	this._reset = function() {
		var mode = 'even';
		var template = '';
		for (var y = 0; y <= this._properties.height - 1; y++) {
			this._grid[y] = [];
			template += '<ol class="' + mode + '">';
			for (var x = 0; x <= this._properties.width - 1; x++) {
				this._grid[y][x] = null;
				template += '<li data-pos="' + x + '-' + y + '" data-x="' + x + '" data-y="' + y + '" class="cell empty"></li>';
			}
			template += '</ol>';
			if (mode === 'even') {
				mode = 'odd';
			} else {
				mode = 'even';
			}
		}
		$(this._elements.container).empty().append(template);
		return this;
	};

	/**
	 * Return the current hex cell grid.
	 *
	 * @public
	 * @returns {Array}
	 */
	this.grid = function() {
		return this._grid;
	};

	/**
	 * Get the current turn.
	 *
	 * @public
	 * @returns {Number}
	 */
	this.num_turns = function() {
		return this._current_turn;
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
	* Get the properties of this battleground.
	*
	* @public
	* @returns {Object}
	*/
	this.properties = function() {
		return this._properties;
	};

	/**
	 * Move closer to the enemy.
	 *
	 * @private
	 * @param {Object} cell
	 * @returns {Boolean}
	 */
	this._move_to_enemy = function(cell) {
		/*
		var sx = cell.x;
		var sy = cell.y;
		var source = this._grid[sy][sx];
		var can_move = civitas.SOLDIERS[source.item].moves;
		if (this._computer === 2) {
			// TODO
		}
		*/
		return false;
	};

	this._do_computer = function() {
		for (var y = 0; y < this._grid.length; y++) {
			for (var x = 0; x < this._grid[y].length; x++) {
				if (this._grid[y][x] !== null && this._grid[y][x].side === this._computer) {
					var source = this._grid[y][x];
					this._from = {
						x: x,
						y: y
					};
					this._cell_select(this._from);
					if (civitas.SOLDIERS[source.item].ranged) {
						this._check_for_ranged_target(this._player);
					} else {
						this._check_for_melee_target(this._player);
					}
					this._move_to_enemy(this._from);
					this._from = null;
				}
			}
		}
		return true;
	};

	/**
	 * Computer check if there are any targets in melee.
	 *
	 * @private
	 * @param {Number} type
	 * @returns {Boolean}
	 */
	this._check_for_melee_target = function(type) {
		if (this._from !== null) {
			var source = this._grid[this._from.y][this._from.x];
			var can_move = civitas.SOLDIERS[source.item].moves;
			for (var y = 0; y < this._grid.length; y++) {
				for (var x = 0; x < this._grid[y].length; x++) {
					if (source !== null && !source.moved && can_move &&
						(Math.abs(y - this._from.y) + Math.abs(x - this._from.x)) <= can_move) {
						if (this._grid[y][x] !== null && this._grid[y][x].side === type) {
							this.attack({
								x: x,
								y: y
							});
							return true;
						}
					}
				}
			}
		}
		return false;
	};

	/**
	 * Check if there are any targets in range.
	 *
	 * @private
	 * @param {Number} type
	 * @returns {Boolean}
	 */
	this._check_for_ranged_target = function(type) {
		if (this._from !== null) {
			for (var y = 0; y < this._grid.length; y++) {
				for (var x = 0; x < this._grid[y].length; x++) {
					if (this._grid[y][x] !== null && this._grid[y][x].side === type) {
						this.attack({
							x: x,
							y: y
						});
						return true;
					}
				}
			}
		}
		return false;
	};
	/**
	 * Internal callback for when someone wins the battleground.
	 *
	 * @private
	 * @param {Object} winner
	 * @param {Object} winner
	 * @returns {civitas.objects.battleground}
	 */
	this._on_win = function(winner, loser) {
		var my_settlement = this.core().get_settlement(winner.city);
		var settlement = this.core().get_settlement(loser.city);
		if (this._attack.city === winner.city) {
			// player was attacking and won.
			settlement.army = settlement.load_army(loser.army);
			settlement.navy = settlement.load_navy(loser.navy);
			var spoils = settlement.get_spoils();
			this.core().add_to_queue(settlement, my_settlement, civitas.ACTION_CAMPAIGN, civitas.CAMPAIGN_ARMY_RETURN, {
				army: winner.army,
				navy: winner.navy,
				resources: spoils
			});
		} else if (this._defense.city === winner.city) {
			// player was defending and won.
			my_settlement.army = my_settlement.load_army(winner.army);
			my_settlement.navy = my_settlement.load_navy(winner.navy);
			var has_loser_army = settlement.has_army(loser.army);
			var has_loser_navy = settlement.has_navy(loser.navy);
			if (has_loser_army > 0 || has_loser_navy > 0) {
				this.core().add_to_queue(my_settlement, settlement, civitas.ACTION_CAMPAIGN, civitas.CAMPAIGN_ARMY_RETURN, {
					army: loser.army,
					navy: loser.navy,
					resources: {}
				});
			}
		}
		return this;
	};

	/**
	 * Internal callback for when someone loses the battleground.
	 *
	 * @private
	 * @param {Object} winner
	 * @param {Object} winner
	 * @returns {civitas.objects.battleground}
	 */
	this._on_lose = function(winner, loser) {
		var settlement = this.core().get_settlement(winner.city);
		var my_settlement = this.core().get_settlement(loser.city);
		if (this._attack.city === loser.city) {
			// player was attacking and lost.
			settlement.army = settlement.load_army(winner.army);
			settlement.navy = settlement.load_navy(winner.navy);
			var has_loser_army = settlement.has_army(loser.army);
			var has_loser_navy = settlement.has_navy(loser.navy);
			if (has_loser_army > 0 || has_loser_navy > 0) {
				this.core().add_to_queue(settlement, my_settlement, civitas.ACTION_CAMPAIGN, civitas.CAMPAIGN_ARMY_RETURN, {
					army: loser.army,
					navy: loser.navy,
					resources: {}
				});
			}
		} else if (this._defense.city === loser.city) {
			// player was defending and lost.
			my_settlement.army = my_settlement.load_army(loser.army);
			my_settlement.navy = my_settlement.load_navy(loser.navy);
			var spoils = my_settlement.get_spoils();
			this.core().add_to_queue(my_settlement, settlement, civitas.ACTION_CAMPAIGN, civitas.CAMPAIGN_ARMY_RETURN, {
				army: winner.army,
				navy: winner.navy,
				resources: spoils
			});
		}
		return this;
	};
	/**
	 * Get the distance between two cells.
	 *
	 * @public
	 * @param {Object} cell1
	 * @param {Object} cell2
	 * @returns {Number}
	 */
	this.distance = function(cell1, cell2) {
		var delta_x = cell1.x - cell2.x;  
	    var delta_y = cell1.y - cell2.y;  
	    return ((Math.abs(delta_x) + Math.abs(delta_y) + Math.abs(delta_x - delta_y)) / 2);
	};

	/**
	 * Move the contents of one cell to another cell.
	 *
	 * @public
	 * @param {Object} cell
	 * @returns {Boolean}
	 */
	this.move = function(cell) {
		var sx = this._from.x;
		var sy = this._from.y;
		if (this._from !== null && cell !== null) {
			var source = this._grid[sy][sx];
			var destination = this._grid[cell.y][cell.x];
			var city = this.core().get_settlement(source.city);
			if (source !== null && source.moved) {
				this.log(city.name() + '`s <strong>' + civitas.SOLDIERS[source.item].name + '</strong> already used up its turn.');
				return false;
			}
			if (source !== null && destination === null && city) {
				var can_move = civitas.SOLDIERS[this._grid[sy][sx].item].moves;
				if ((Math.abs(cell.y - sy) + Math.abs(cell.x - sx)) <= can_move) {
					this._grid[cell.y][cell.x] = this._grid[sy][sx];
					this._cell_empty(this._from);
					this._from = null;
					this._grid[cell.y][cell.x].moved = true;
					this.log(city.name() + '`s <strong>' + civitas.SOLDIERS[source.item].name + '</strong> moved to ' + (cell.x + 1) + 'x' + (cell.y + 1) + '.');
					this.redraw();
					return true;
				} else {
					this.log(city.name() + '`s <strong>' + civitas.SOLDIERS[source.item].name + '</strong> is unable to move to the specified location.');
					return false;
				}
			}
		}
	};

	/**
	 * Highlight the cells around the currently selected (or hovered) cell.
	 *
	 * @public
	 * @param {Object} cell
	 * @returns {civitas.objects.battleground}
	 */
	this.highlight_cells = function(cell) {
		this._cells_empty();
		var sx = cell.x;
		var sy = cell.y;
		var source = this._grid[sy][sx];
		if (source !== null) {
			var can_move = civitas.SOLDIERS[source.item].moves;
			for (var y = 0; y < this._grid.length; y++) {
				for (var x = 0; x < this._grid[y].length; x++) {
					if (!source.moved && can_move && (Math.abs(y - sy) +
						Math.abs(x - sx)) <= can_move) {
						if (this._grid[y][x] === null) {
							$(this._elements.container + ' .cell[data-pos=' + x + '-' + y + ']').addClass('canmove');
						}
					}
				}
			}
			var is_ranged = civitas.SOLDIERS[source.item].ranged;
			for (var y = 0; y < this._grid.length; y++) {
				for (var x = 0; x < this._grid[y].length; x++) {
					if (!source.moved && (Math.abs(y - sy) + Math.abs(x - sx)) <= is_ranged) {
						if (this._grid[y][x] === null) {
							$(this._elements.container + ' .cell[data-pos=' + x + '-' + y + ']').addClass('canattack');
						}
					}
				}
			}
		}
		return this;
	};

	/**
	 * Do a nice effect when a cell is under attack.
	 *
	 * @private
	 * @param {Object} cell
	 * @returns {civitas.objects.battleground}
	 */
	this._cell_under_attack = function(cell) {
		$(this._elements.container + ' .cell[data-pos=' + cell.x + '-' + cell.y + ']').addClass('scale').delay(1000).queue(function() {
			$(this).removeClass('scale').dequeue();
		});
		return this;
	};

	/**
	 * Empty all the cells that are already empty.
	 *
	 * @private
	 * @returns {civitas.objects.battleground}
	 */
	this._cells_empty = function() {
		for (var y = 0; y < this._grid.length; y++) {
			for (var x = 0; x < this._grid[y].length; x++) {
				if (this._grid[y][x] === null) {
					this._cell_empty({
						x: x,
						y: y
					});
				}
			}
		}
		return this;
	};

	/**
	 * Empty one cell.
	 *
	 * @private
	 * @param {Object} cell
	 * @returns {civitas.objects.battleground}
	 */
	this._cell_empty = function(cell) {
		this._grid[cell.y][cell.x] = null;
		$(this._elements.container + ' .cell[data-pos=' + cell.x + '-' + cell.y + ']')
			.removeData('side')
			.removeData('amount')
			.removeData('soldier')
			.addClass('empty')
			.removeClass('canmove canattack selected')
			.empty();
		return this;
	};

	/**
	 * Select a cell.
	 *
	 * @private
	 * @param {Object} cell
	 * @returns {civitas.objects.battleground}
	 */
	this._cell_select = function(cell) {
		$(this._elements.container + ' .cell').removeClass('selected canmove canattack');
		$(this._elements.container + ' .cell[data-pos=' + cell.x + '-' + cell.y + ']').addClass('selected');
		this._from = cell;
		this.highlight_cells(cell);
		return this;
	};

	/**
	 * Add a cell to the battleground grid.
	 *
	 * @private
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Object} army
	 * @returns {civitas.objects.battleground}
	 */
	this._cell_add = function(x, y, army) {
		this._grid[y][x] = army;
		$(this._elements.container + ' .cell[data-pos=' + x + '-' + y + ']')
			.removeData('side')
			.removeData('amount')
			.removeData('soldier')
			.attr('data-side', army.side)
			.attr('data-amount', army.total)
			.attr('data-soldier', army.item)
			.removeClass('empty canmove canattack selected')
			.empty()
			.append('<span class="moves' + (army.moved === false ? ' has' : '') + '"></span><img class="tips" title="' + civitas.SOLDIERS[army.item].name + '" src="' + civitas.ASSETS_URL + 'images/assets/army/' + army.item + '.png" />' + '<span class="amount">' + army.total + '</span>');
		return this;
	};

	/**
	 * Redraw the grid.
	 *
	 * @public
	 * @returns {Boolean}
	 */
	this.redraw = function() {
		var a_attack = 0;
		var a_defense = 0;
		var d_attack = 0;
		var d_defense = 0;
		for (var y = 0; y < this._grid.length; y++) {
			for (var x = 0; x < this._grid[y].length; x++) {
				var army = this._grid[y][x];
				if (army !== null && army.total > 0) {
					army.attack = army.total * civitas.SOLDIERS[army.item].attack;
					army.defense = army.total * civitas.SOLDIERS[army.item].defense;
					if (army.side === civitas.BATTLEGROUND_ATTACK) {
						a_attack += army.attack;
						a_defense += army.defense;
					} else {
						d_attack += army.attack;
						d_defense += army.defense;
					}
					this._cell_add(x, y, army);
				} else {
					this._cell_empty({
						x: x,
						y: y
					});
				}
			}
		}
		this._stats.attacking.attack = a_attack;
		this._stats.attacking.defense = a_defense;
		this._stats.defending.attack = d_attack;
		this._stats.defending.defense = d_defense;
		this.show_stats();
		this._check_status();
		$('.tipsy').remove();
		$('.tips').tipsy({
			gravity: $.fn.tipsy.autoNS,
			html: true
		});
		return true;
	};

	/**
	 * Setup the battleground hex grid.
	 *
	 * @private
	 * @returns {civitas.objects.battleground}
	 */
	this._setup = function() {
		var self = this;
		this._reset();
		var xx = 0;
		var xxx = 3;
		var yy;
		for (var item in this._attack.army) {
			if (this._attack.army[item] > 0) {
				if (civitas.SOLDIERS[item].siege === true) {
					yy = 0;
					xx = xxx;
					xxx++;
				} else {
					yy = 2;
				}
				this.add(xx, yy, 1, item, this._attack);
				xx++;
			}
		}
		xxx = 3;
		xx = 0;
		for (var item in this._defense.army) {
			if (this._defense.army[item] > 0) {
				if (civitas.SOLDIERS[item].siege === true) {
					yy = this._properties.width - 1;
					xx = xxx;
					xxx++;
				} else {
					yy = this._properties.width - 3;
				}
				this.add(xx, yy, 2, item, this._defense);
				xx++;
			}
		}
		$(this._elements.container).on('mouseover', '.cell', function () {
			if (self._from === null) {
				var from = {
					x: parseInt($(this).data('x')),
					y: parseInt($(this).data('y'))
				};
				self.highlight_cells(from);
			}
			return false;
		}).on('click', '.cell', function () {
			if ($(this).hasClass('empty')) {
				if (self._from !== null) {
					var to = {
						x: parseInt($(this).data('x')),
						y: parseInt($(this).data('y'))
					};
					self.move(to);
					self.on_move.call(self, self._from, to);
				}
			} else {
				if (parseInt($(this).data('side')) === self._player) {
					if (!$(this).hasClass('selected')) {
						var from = {
							x: parseInt($(this).data('x')),
							y: parseInt($(this).data('y'))
						};
						self._cell_select(from);
						self.on_select.call(self, from);
					} else {
						self._from = null;
						$(self._elements.container + ' .cell').removeClass('selected canmove canattack');
					}
				} else if (parseInt($(this).data('side')) === self._computer) {
					if (self._from !== null) {
						var to = {
							x: parseInt($(this).data('x')),
							y: parseInt($(this).data('y'))
						};
						self.attack(to);
						self.on_attack.call(self, self._from, to);
					}
				}
			}
			return false;
		});
		return this;
	};

	/**
	 * Add a hex cell to the battleground grid.
	 *
	 * @public
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} side
	 * @param {String} soldier
	 * @param {Object} settlement
	 * @returns {civitas.objects.battleground}
	 */
	this.add = function(x, y, side, soldier, settlement) {
		this._cell_add(y, x, {
			item: soldier,
			city: settlement.city,
			total: settlement.army[soldier],
			attack: civitas.SOLDIERS[soldier].attack * settlement.army[soldier],
			defense: civitas.SOLDIERS[soldier].defense * settlement.army[soldier],
			side: side,
			moved: false
		});
		return this;
	};

	// Fire up the constructor
	return this.__init(params);
};
