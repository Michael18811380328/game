/**
 * Trades panel data.
 *
 * @type {Object}
 */
civitas.PANEL_TRADES = {
	template: civitas.ui.generic_panel_template(civitas.l('World Market')),
	id: 'trades',
	on_show: function(params) {
		var self = this;
		var core = this.core();
		var settlement = core.get_settlement();
		var el = this.handle;
		var _t = '';
		$(el + ' section').append(civitas.ui.tabs([civitas.l('Export'), civitas.l('Import'), civitas.l('Mercenaries'), civitas.l('BlackMarket'), civitas.l('Prices')]));
		$(el + ' #tab-import').append('<p>' + civitas.l('Below is a list of goods that the other cities in the world are looking to sell. The goods replenish every six months, so plan accordingly. You will need to build a Trading Post before being able to sell goods.') + '</p><div class="contents"></div>');
		$(el + ' #tab-export').append('<p>' +
			civitas.l('Below is a list of goods that the other cities in the world are looking ' +
				'to buy. The goods replenish every six months, so plan accordingly. You will ' +
				'need to build a Trading Post before being able to buy goods.') +
			'</p><div class="contents"></div>');
		$(el + ' #tab-mercenaries').append('<p>' + civitas.l('Below is a list of mercenary ' +
			'armies that are looking for hire. Mercenaries are available only for raiding and ' +
			'conquest missions, they do not join your city so they will not participate ' +
			'in defense.') + '</p><div class="contents"></div>');
		$(el + ' #tab-blackmarket').append('<p>' + civitas.l('The Black Market is a way to ' +
			'dump your excess materials when you`re in need of emptying your warehouses, ' +
			'but expect a steep price drop (taxes for all Black Market trades are <strong>') +
			civitas.BLACK_MARKET_DISCOUNT + civitas.l('%</strong>). The goods will be taken ' +
			'immediately from your warehouses but you will receive the coins at the ' +
			'<strong>start of the next month</strong>. Also, you get ' +
			'<strong>no prestige</strong> from Black Market trades.') +
			'</p><div class="contents"></div>');
		$(el + ' #tab-prices').append('<div class="contents"></div>');
		$(el + ' #tab-blackmarket > .contents').append('' +
			'<table class="normal">' +
				'<thead>' +
					'<tr>' +
						'<td>' + civitas.l('Resources') + ': <select class="bm-materials"></select></td>' +
						'<td>' + civitas.l('Quantity') + ': ' +
							'<select class="bm-quantity">' +
								'<option value="0">-- ' + civitas.l('select') + ' --</option>' +
								'<option value="10">10</option>' +
								'<option value="100">100</option>' +
								'<option value="1000">1000</option>' +
								'<option value="10000">10000</option>' +
							'</select>' +
							' ' + civitas.l('or enter manually') +
							' <input type="number" min="1" max="100000" placeholder="' + civitas.l('amount') + '" class="small bm-qty-manual" />' +
						'</td>' +
						'<td>' +
							'<a title="' + civitas.l('List goods on Black Market') + '" class="tips bmarket" href="#">' + civitas.l('List') + '</a>' +
						'</td>' +
					'</tr>' +
				'</thead>' +
				'<tbody>' +
				'</tbody>' +
			'</table>');
		var out = '<option value="0">-- ' + civitas.l('select') + ' --</option>';
		var resources = settlement.get_resources();
		for (var item in resources) {
			if ($.inArray(item, civitas.NON_RESOURCES) === -1) {
				out += '<option value="' + item + '"> ' + civitas.utils.get_resource_name(item) + '</option>';
			}
		}
		$(el + ' .bm-materials').empty().append(out);
		$(el).on('click', '.settlement-info', function () {
			var _settlement_name = $(this).data('settlement');
			core.open_panel(civitas.PANEL_SETTLEMENT, core.get_settlement(_settlement_name));
			return false;
		}).on('click', '.buy:not(.disabled)', function () {
			if (!settlement.can_trade()) {
				core.error(civitas.l('You will need to construct a Trading Post before being able to trade resources with other settlements.'));
				return false;
			}
			var handle = $(this).data('settlement');
			var resource = $(this).data('resource');
			if (settlement.buy_from_settlement(handle, resource) !== false) {
				self.on_refresh();
			}
			return false;
		}).on('click', '.sell:not(.disabled)', function () {
			if (!settlement.can_trade()) {
				core.error(civitas.l('You will need to construct a Trading Post before being able to trade resources with other settlements.'));
				return false;
			}
			var handle = $(this).data('settlement');
			var resource = $(this).data('resource');
			if (settlement.sell_to_settlement(handle, resource) !== false) {
				self.on_refresh();
			}
			return false;
		}).on('click', '.bmarket', function () {
			var resource = $('.bm-materials').val();
			var auto_amount = $('.bm-quantity').val();
			var manual_amount = $('.bm-qty-manual').val();
			var amount = manual_amount === '' ? parseInt(auto_amount) : parseInt(manual_amount);
			if (resource !== '0' && amount > 0) {
				if (settlement.list_black_market(resource, amount)) {
					self.on_refresh();
				}
			} else {
				core.error(civitas.l('Select a resource and the amount of it you want to place on the Black Market.'));
			}
			return false;
		}).on('click', '.recruit:not(.disabled)', function () {
			var handle = $(this).data('handle');
			if (settlement.recruit_mercenary_army(handle) !== false) {
				self.on_refresh();
			}
			return false;
		}).on('click', '.view-army:not(.disabled)', function () {
			var army = parseInt($(this).data('id'));
			var army_data = civitas.MERCENARIES[army];
			core.open_panel(civitas.PANEL_ARMY, army_data);
			return false;
		});
	},
	on_refresh: function() {
		var core = this.core();
		var my_settlement = core.get_settlement();
		var settlement = core.get_settlement();
		var settlements = core.get_settlements();
		var out = '';
		var bm = core.get_black_market();
		for (var item in bm) {
			out += '<tr>' +
					'<td>' + civitas.l('Amount') + ': ' + bm[item].amount + civitas.ui.resource_small_img(item) + '</td>' +
					'<td>' + civitas.l('Total price') + ': ' + bm[item].price + civitas.ui.resource_small_img('coins') + '</td>' +
					'<td>&nbsp;</td>' +
				'</tr>';
		}
		$('#tab-blackmarket > .contents > table > tbody').empty().append(out);
		var out = '<table class="normal">' +
					'<thead>' +
					'<tr>' +
						'<td>' + civitas.l('City') + '</td>' +
						'<td class="center">' + civitas.l('Goods') + '</td>' +
						'<td class="center">' + civitas.l('Amount') + '</td>' +
						'<td class="center">' + civitas.l('Price') + '</td>' +
						'<td class="center">' + civitas.l('Discount') + '</td>' +
						'<td class="center">' + civitas.l('City Price') + '</td>' +
						'<td class="center">' + civitas.l('Total price') + '</td>' +
						'<td></td>' +
					'</tr>' +
					'</thead>';
		for (var z = 1; z < settlements.length; z++) {
			var settlement = settlements[z];
			if (my_settlement.status()[settlements[z].id()].influence < 20) {
				break;
			}
			var trades = settlements[z].get_trades();
			var resources = settlement.get_resources();
			if (trades !== null) {
				var imports = trades.imports;
				for (var item in imports) {
					var discount = Math.ceil((civitas.RESOURCES[item].price * civitas.TRADES_DISCOUNT) / 100);
					var discount_price = Math.ceil(civitas.RESOURCES[item].price - discount);
					out += '<tr>' +
							'<td><a href="#" class="settlement-info tips" data-settlement="' + settlements[z].name() + '" title="' + civitas.l('View info about this settlement.') + '">' + settlements[z].name() + '</a></td>' +
							'<td class="center">' + civitas.ui.resource_small_img(item) + '</td>' +
							'<td class="center">' + imports[item] + '</td>' +
							'<td class="center">' + civitas.RESOURCES[item].price + civitas.ui.resource_small_img('coins') + '</td>' +
							'<td class="center">' + discount + civitas.ui.resource_small_img('coins') + '</td>' +
							'<td class="center">' + discount_price + civitas.ui.resource_small_img('coins') + '</td>' +
							'<td class="center">' + Math.ceil(discount_price * imports[item]) + civitas.ui.resource_small_img('coins') + '</td>' +
							'<td class="center"><a title="' + civitas.l('Sell those goods') + '" data-resource="' + item + '" data-settlement="' + settlements[z].name() + '" class="tips sell' + (imports[item] === 0 ? ' disabled' : '') + '" href="#">' + civitas.l('sell') + '</a></td>' +
						'</tr>';
				}
			}
		}
		out += '<tfoot>' +
					'<tr>' +
						'<td>' + civitas.l('City') + '</td>' +
						'<td class="center">' + civitas.l('Goods') + '</td>' +
						'<td class="center">' + civitas.l('Amount') + '</td>' +
						'<td class="center">' + civitas.l('Price') + '</td>' +
						'<td class="center">' + civitas.l('Discount') + '</td>' +
						'<td class="center">' + civitas.l('City Price') + '</td>' +
						'<td class="center">' + civitas.l('Total price') + '</td>' +
						'<td></td>' +
					'</tr>' +
				'</tfoot>' +
			'</table>';
		$('#tab-export > .contents').empty().append(out);
		var out = '<table class="mercenaries">';
		for (var i = 0; i < civitas.MERCENARIES.length; i++) {
			out += '<tr>' +
					'<td class="icon">' +
						'<img src="' + civitas.ASSETS_URL + 'images/assets/emblems/' + civitas.MERCENARIES[i].icon + '.png" />' +
					'</td>' +
					'<td>' +
						'<p class="title">' + civitas.MERCENARIES[i].name + '</p>' +
						'<p class="description">' + civitas.MERCENARIES[i].description + '</p>' +
					'</td>' +
					'<td>' + 
						civitas.utils.nice_numbers(civitas.MERCENARIES[i].cost) + civitas.ui.resource_small_img('coins') + 
					'</td>' +
					'<td class="medium">' +
						'<a title="' + civitas.l('View info on this mercenary army') + '" data-id="' + i + '" class="tips view-army" href="#">view</a> ' + civitas.ui.panel_btn('recruit', civitas.l('Recruit this mercenary army'), civitas.MERCENARIES[i].handle, 'recruit', core.get_settlement().is_mercenary_recruited(civitas.MERCENARIES[i].handle)) +
					'</td>' +
				'</tr>';
		}
		out += '</table>';
		$('#tab-mercenaries > .contents').empty().append(out);
		var out = '<table class="normal">' +
					'<thead>' +
					'<tr>' +
						'<td>' + civitas.l('City') + '</td>' +
						'<td class="center">' + civitas.l('Goods') + '</td>' +
						'<td class="center">' + civitas.l('Amount') + '</td>' +
						'<td class="center">' + civitas.l('Price') + '</td>' +
						'<td class="center">' + civitas.l('Tax') + '</td>' +
						'<td class="center">' + civitas.l('City Price') + '</td>' +
						'<td class="center">' + civitas.l('Total price') + '</td>' +
						'<td></td>' +
					'</tr>' +
					'</thead>';
		for (var z = 1; z < settlements.length; z++) {
			var settlement = settlements[z];
			if (my_settlement.status()[settlements[z].id()].influence < 20) {
				break;
			}
			var trades = settlements[z].get_trades();
			var resources = settlement.get_resources();
			if (trades !== null) {
				var exports = trades.exports;
				for (var item in exports) {
					var discount = Math.ceil((civitas.RESOURCES[item].price * civitas.TRADES_ADDITION) / 100);
					var discount_price = Math.ceil(civitas.RESOURCES[item].price + discount);
					out += '<tr>' +
							'<td>' + settlements[z].name() + '</td>' +
							'<td class="center">' + civitas.ui.resource_small_img(item) + '</td>' +
							'<td class="center">' + exports[item] + '</td>' +
							'<td class="center">' + civitas.RESOURCES[item].price + civitas.ui.resource_small_img('coins') + '</td>' +
							'<td class="center">' + discount + civitas.ui.resource_small_img('coins') + '</td>' +
							'<td class="center">' + discount_price + civitas.ui.resource_small_img('coins') + '</td>' +
							'<td class="center">' + Math.ceil(discount_price * exports[item]) + civitas.ui.resource_small_img('coins') + '</td>' +
							'<td class="center"><a title="' + civitas.l('Buy those goods') + '" data-resource="' + item + '" data-settlement="' + settlements[z].name() + '" class="tips buy' + (exports[item] === 0 ? ' disabled' : '') + '" href="#">' + civitas.l('buy') + '</a></td>' +
						'</tr>';
				}
			}
		}
		out += '<tfoot>' +
					'<tr>' +
						'<td>' + civitas.l('City') + '</td>' +
						'<td class="center">' + civitas.l('Goods') + '</td>' +
						'<td class="center">' + civitas.l('Amount') + '</td>' +
						'<td class="center">' + civitas.l('Price') + '</td>' +
						'<td class="center">' + civitas.l('Tax') + '</td>' +
						'<td class="center">' + civitas.l('City Price') + '</td>' +
						'<td class="center">' + civitas.l('Total price') + '</td>' +
						'<td></td>' +
					'</tr>' +
				'</tfoot>' +
			'</table>';
		$('#tab-import > .contents').empty().append(out);
		var out = '<table class="normal">' +
					'<thead>' +
					'<tr>' +
						'<td>' + civitas.l('Resource') + '</td>' +
						'<td class="center">' + civitas.l('Icon') + '</td>' +
						'<td class="center">' + civitas.l('Price') + '</td>' +
						'<td class="center tips" title="This is the price you get for selling one unit of the resource to another settlement, minus the <strong>' + civitas.TRADES_DISCOUNT + '%</strong> export taxes.">' + civitas.l('Sell Price') + '</td>' +
						'<td class="center tips" title="This is the price you get for buying one unit of the resource from another settlement, plus the <strong>' + civitas.TRADES_ADDITION + '%</strong> import taxes.">' + civitas.l('Buy Price') + '</td>' +
						'<td class="center tips" title="This is the price you get for placing one unit of the resource on the Black Market, minus the <strong>' + civitas.BLACK_MARKET_DISCOUNT + '%</strong> taxes.">' +  civitas.l('BM Price') + '</td>' +
						'<td class="center tips" title="If the resource is listed as produced, that possibility depends on the location and climate of your settlement (ex. tropical settlements can build <strong>Sugar Farms</strong> and produce <strong>Sugar</strong>).">' + civitas.l('Type') + '</td>' +
					'</tr>' +
					'</thead>';
		for (var item in civitas.RESOURCES) {
			if ($.inArray(item, civitas.NON_RESOURCES) === -1) {
				var discount = Math.ceil((civitas.RESOURCES[item].price * civitas.TRADES_ADDITION) / 100);
				var tax = Math.ceil((civitas.RESOURCES[item].price * civitas.TRADES_DISCOUNT) / 100);
				var bm_tax = Math.ceil((civitas.RESOURCES[item].price * civitas.BLACK_MARKET_DISCOUNT) / 100);
				out += '<tr>' +
					'<td>' + civitas.RESOURCES[item].name + '</td>' +
					'<td class="center">' + civitas.ui.resource_small_img(item) + '</td>' +
					'<td class="center">' + civitas.RESOURCES[item].price + civitas.ui.resource_small_img('coins') + '</td>' +
					'<td class="center">' + (civitas.RESOURCES[item].price - tax) + civitas.ui.resource_small_img('coins') + '</td>' +
					'<td class="center">' + (civitas.RESOURCES[item].price + discount) + civitas.ui.resource_small_img('coins') + '</td>' +
					'<td class="center">' + (civitas.RESOURCES[item].price - bm_tax) + civitas.ui.resource_small_img('coins') + '</td>' +
					'<td class="center">' + ((civitas.RESOURCES[item].imported === true) ? civitas.l('imported') : civitas.l('produced')) + '</td>' +
				'</tr>';
			}
		}
		out += '<tfoot>' +
					'<tr>' +
						'<td>' + civitas.l('Resource') + '</td>' +
						'<td class="center">' + civitas.l('Icon') + '</td>' +
						'<td class="center">' + civitas.l('Price') + '</td>' +
						'<td class="center">' + civitas.l('Sell Price') + '</td>' +
						'<td class="center">' + civitas.l('Buy Price') + '</td>' +
						'<td class="center">' + civitas.l('BM Price') + '</td>' +
						'<td class="center">' + civitas.l('Type') + '</td>' +
					'</tr>' +
				'</tfoot>' +
			'</table>';
		$('#tab-prices > .contents').empty().append(out);
	}
};
