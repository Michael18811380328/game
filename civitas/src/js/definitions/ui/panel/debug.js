/**
 * Debug panel data.
 *
 * @type {Object}
 */
civitas.PANEL_DEBUG = {
	template: civitas.ui.generic_panel_template(),
	id: 'debug',
	on_show: function(params) {
		var self = this;
		var core = this.core();
		var settlement = core.get_settlement();
		var handle = this.handle;
		$(this.handle + ' section').append(civitas.ui.tabs([civitas.l('Data'), civitas.l('Console'), civitas.l('Cheats')]));
		$(this.handle + ' header').append(civitas.l('Debug'));
		$(this.handle + ' #tab-console').empty().append('<div class="console"></div>');
		$(this.handle + ' #tab-cheats').empty().append('' +
				'<div class="toolbar">' +
					'<a href="#" class="btn iblock one">' + civitas.l('+1M coins') + '</a> ' +
					'<a href="#" class="btn iblock two">' + civitas.l('+1000 wood') + '</a> ' +
					'<a href="#" class="btn iblock three">' + civitas.l('+1000 stones') + '</a> ' +
					'<a href="#" class="btn iblock thirty">' + civitas.l('+1000 bread') + '</a> ' +
					'<a href="#" class="btn iblock fifteen">' + civitas.l('+1000 provisions') + '</a> <br /><br />' +
					'<a href="#" class="btn iblock four">' + civitas.l('+1000 wood planks') + '</a> ' +
					'<a href="#" class="btn iblock five">' + civitas.l('level up') + '</a> ' +
					'<a href="#" class="btn iblock fourteen">' + civitas.l('+900 faith') + '</a> ' +
					'<a href="#" class="btn iblock six">' + civitas.l('+1000 fame') + '</a> ' +
					'<a href="#" class="btn iblock ten">' + civitas.l('+5000 fame') + '</a> <br /><br />' +
					'<a href="#" class="btn iblock seven">' + civitas.l('refresh trades') + '</a> ' +
					'<a href="#" class="btn iblock eleven">' + civitas.l('random soldiers') + '</a> ' +
					'<a href="#" class="btn iblock twelve">' + civitas.l('random ships') + '</a> ' +
					'<a href="#" class="btn iblock fourty">' + civitas.l('defend city') + '</a> ' +
					'<a href="#" class="btn iblock fifty">' + civitas.l('battle-ready') + '</a> <br /><br />' +
					'<a href="#" class="btn iblock ninety">' + civitas.l('add city') + '</a> ' +
				'</div>');
		$(this.handle + ' #tab-data').empty().append(
			'<textarea class="storage-data"></textarea>' +
			'<div class="toolbar">' +
				'<a href="#" class="btn iblock refresh">' + civitas.l('Refresh') + '</a> ' +
				'<a href="#" class="btn iblock load">' + civitas.l('Load') + '</a> ' +
				'<a href="#" class="btn iblock save">' + civitas.l('Save') + '</a> ' +
			'</div>');
		$(this.handle).on('click', '.fourty', function() {
			var city_index = civitas.utils.get_random(1, core.get_num_settlements() - 1);
			var _settlement = core.get_settlement(city_index);
			core.add_to_queue(_settlement, settlement, civitas.ACTION_CAMPAIGN, civitas.CAMPAIGN_ARMY, {
				army: {
					militia: 40,
					axeman: 30,
					knight: 10,
					bowman: 20,
					cannon: 200,
					heavycannon: 200,
					catapult: 300,
					crossbowman: 10,
					pikeman: 30
				}
			});
			return false;
		}).on('click', '.fifty', function() {
			for (var i = 0; i < 9; i++) {
				settlement.level_up();
			}
			settlement.add_to_storage('wood', 1000);
			settlement.add_to_storage('stones', 1000);
			settlement.add_to_storage('woodplanks', 1000);
			settlement.add_to_storage('provisions', 1000);
			settlement.inc_coins(1000000);
			var army = settlement.get_army();
			for (var soldier in army) {
				army[soldier] = civitas.utils.get_random(1, 100);
			}
			settlement.build('provisions');
			settlement.build('camp');
			core.save_and_refresh();
			return false;
		}).on('click', '.eleven', function() {
			var army = settlement.get_army();
			for (var soldier in army) {
				army[soldier] = civitas.utils.get_random(1, 100);
			}
			core.save_and_refresh();
			return false;
		}).on('click', '.twelve', function() {
			var navy = settlement.get_navy();
			for (var ship in navy) {
				navy[ship] = civitas.utils.get_random(1, 10);
			}
			core.save_and_refresh();
			return false;
		}).on('click', '.fourteen', function() {
			settlement.raise_faith(900);
			core.save_and_refresh();
			return false;
		}).on('click', '.one', function() {
			settlement.inc_coins(1000000);
			core.save_and_refresh();
			return false;
		}).on('click', '.fifteen', function() {
			settlement.add_to_storage('provisions', 1000);
			core.save_and_refresh();
			return false;
		}).on('click', '.two', function() {
			settlement.add_to_storage('wood', 1000);
			core.save_and_refresh();
			return false;
		}).on('click', '.thirty', function() {
			settlement.add_to_storage('bread', 1000);
			core.save_and_refresh();
			return false;
		}).on('click', '.three', function() {
			settlement.add_to_storage('stones', 1000);
			core.save_and_refresh();
			return false;
		}).on('click', '.four', function() {
			settlement.add_to_storage('woodplanks', 1000);
			core.save_and_refresh();
			return false;
		}).on('click', '.five', function() {
			settlement.level_up();
			core.save_and_refresh();
			return false;
		}).on('click', '.ten', function() {
			settlement.raise_fame(5000);
			core.save_and_refresh();
			return false;
		}).on('click', '.six', function() {
			settlement.raise_fame(1000);
			core.save_and_refresh();
			return false;
		}).on('click', '.seven', function() {
			core.refresh_trades();
			core.save_and_refresh();
			return false;
		}).on('click', '.refresh', function() {
			$(handle + ' .storage-data').val(core.get_storage_data('live', true));
			return false;
		}).on('click', '.ninety', function() {
			core.add_random_settlement();
			return false;
		}).on('click', '.load', function() {
			var save_game = $(handle + ' .storage-data').val();
			if (save_game != '') {
				core.open_modal(
					function(button) {
						if (button === 'yes') {
							core.set_storage_data_as_text('live', save_game);
							document.location.reload();
						}
					},
					'Are you sure you want to load a new game? You will lose all progress on the current game!',
					'Civitas'
				);
			} else {
				core.error(civitas.l('Invalid save game.'));
			}
			return false;
		}).on('click', '.save', function() {
			var save_game = $(handle + ' .storage-data').val();
			if (save_game == '') {
				save_game = core.get_storage_data('live', true);
			}
			var a = document.createElement("a");
			a.style.display = "none";
			document.body.appendChild(a);
			a.href = window.URL.createObjectURL(
				new Blob([save_game], {
					type: 'text/plain'
				})
			);
			a.setAttribute("download", 'civitas_savegame.json');
			a.click();
			window.URL.revokeObjectURL(a.href);
			document.body.removeChild(a);
			return false;
		});
	}
};
