/**
 * Tavern panel data.
 *
 * @type {Object}
 */
civitas.PANEL_TAVERN = {
	template: civitas.ui.building_panel_template(),
	id: 'tavern',
	on_show: function(params) {
		var self = this;
		var core = self.core();
		var _t = '';
		$(this.handle + ' section').append(civitas.ui.tabs([civitas.l('Info'), civitas.l('Heroes'), civitas.l('Items')]));
		var building = core.get_settlement().get_building(self.params_data.handle);
		if (building) {
			$(self.handle + ' #tab-items').empty().append('Not implemented yet.');
			$(self.handle + ' #tab-heroes').empty().append(
				'<div class="column hero-list"></div>' +
				'<div class="column hero-info"></div>' +
				'<div class="column hero-items"></div>'
			);
			$(self.handle + ' #tab-info').empty().append(civitas.ui.building_panel(self.params_data, building.get_level()));
			self.empty_items = function() {
				$(self.handle + ' .hero-items').empty().append('<h3>' + civitas.l('Equipment') + '</h3>');
				for (var i = 1; i < civitas.ITEM_SLOTS_NUM; i++) {
					$(self.handle + ' .hero-items').append('<div class="slot" data-slot="' + i + '"></div>');
				}
				$(self.handle + ' .hero-items').append('<br class="clearfix" />').append('<h3>' + civitas.l('Bags') + '</h3>');
				for (var i = 0; i < civitas.ITEM_BACKPACK_NUM; i++) {
					$(self.handle + ' .hero-items').append('<div class="slot" data-backpack-slot="' + i + '"></div>');
				}
			}
			self.empty_items();
			for (var item in civitas.HEROES) {
				_t += '<p><a href="#" data-hero="' + item + '">' + civitas.HEROES[item].name + '</a></p>';
			}
			$(self.handle + ' .hero-list').empty().append(_t);
			$(self.handle).on('click', '.hero-list a', function() {
				var hero_id = parseInt($(this).data('hero'));
				var hero_data = civitas.HEROES[hero_id];
				if (hero_data) {
					$(self.handle + ' .hero-info').empty().append(
						'<h3>' + civitas.l('Info') + ' <a title="' + civitas.l('Information provided by Wikipedia.') + '" href="' + hero_data.link + '" class="tips external-link wikipedia"></a></h3>' +
						hero_data.description + 
						'<br /><br />' +
						'<h3>' + civitas.l('Class') + '</h3>' +
						civitas.HERO_CLASS_LIST[hero_data.class] + '' +
						'<br /><br />' +
						'<h3>' + civitas.l('Attributes') + '</h3>' +
						civitas.l('Strength') + ': <span class="green">' + hero_data.stats.strength + '</span><br />' +
						civitas.l('Stamina') + ': <span class="green">' + hero_data.stats.stamina + '</span><br />' +
						civitas.l('Agility') + ': <span class="green">' + hero_data.stats.agility + '</span><br />' +
						civitas.l('Intellect') + ': <span class="green">' + hero_data.stats.intellect + '</span><br />' +
						civitas.l('Spirit') + ': <span class="green">' + hero_data.stats.spirit + '</span><br />' +
						civitas.l('Health Points') + ': <span class="blue">' + civitas.utils.get_health_points(hero_data) + '</span><br />' +
						civitas.l('Mana Points') + ': <span class="blue">' + civitas.utils.get_mana_points(hero_data) + '</span><br />' +
						civitas.l('Damage') + ': <span class="red">' + civitas.utils.get_damage_points(hero_data).min + '-' + civitas.utils.get_damage_points(hero_data).max + '</span>'
					);
					self.empty_items();
					for (var x = 0; x < hero_data.items.length; x++) {
						var slot = hero_data.items[x].slot;
						$(self.handle + ' .hero-items > div.slot[data-slot="' + slot + '"]')
							.empty()
							.append('X')
							.attr('title', civitas.ui.item_tooltip(hero_data.items[x]))
							.tipsy({
								className: 'item',
								html: true
							});
					}
					for (var x = 0; x < hero_data.backpack.length; x++) {
						$(self.handle + ' .hero-items > div.slot[data-backpack-slot="' + x + '"]')
							.empty()
							.append('X')
							.attr('title', civitas.ui.item_tooltip(hero_data.backpack[x]))
							.tipsy({
								className: 'item',
								html: true
							});
					}
				}
				return false;
			});
		} else {
			self.destroy();
		}
	},
	on_refresh: function() {
		// TODO
	}
};
