/**
 * Storage panel data.
 *
 * @type {Object}
 */
civitas.PANEL_STORAGE = {
	template: civitas.ui.generic_panel_template(civitas.l('City Storage')),
	expanded: false,
	id: 'storage',
	on_show: function(params) {
		var self = this;
		var core = this.core();
		var settlement = core.get_settlement();
		var storage_space = settlement.storage();
		var _t = '<div class="main-storage"></div>' +
			'<div class="extra-storage hidden"></div>' +
			'<div class="clearfix"></div>' +
			'<p>' + civitas.l('Total storage space') + ': <span class="total-storage">' + storage_space.all + '</span>, ' + civitas.l('used') + ': <span class="used-storage">' + storage_space.occupied + '</span></p>' +
			'<div class="toolbar">' +
				'<a class="btn iblock toggle-storage" href="#">' + civitas.l('Show More Goods') + '</a>' +
			'</div>';
		$(this.handle + ' section').empty().append(_t);
		$(this.handle).on('click', '.toggle-storage', function () {
			if ($('.toggle-storage').html() === civitas.l('Show Less Goods')) {
				self.expanded = false;
				$('.toggle-storage').html(civitas.l('Show More Goods'));
			} else {
				self.expanded = true;
				$('.toggle-storage').html(civitas.l('Show Less Goods'));
			}
			$('.extra-storage').toggle();
			return false;
		});
	},
	on_refresh: function() {
		var settlement = this.core().get_settlement();
		var resources = settlement.get_resources();
		var main_storage = '';
		var extra_storage = '';
		var storage_space = settlement.storage();
		for (var resource in resources) {
			if ($.inArray(resource, civitas.NON_RESOURCES) === -1) {
				if ($.inArray(resource, civitas.MAIN_RESOURCES) !== -1) {
					main_storage += civitas.ui.resource_storage_el(resource, resources[resource]);
				} else {
					extra_storage += civitas.ui.resource_storage_el(resource, resources[resource]);
				}
			}
		}
		$(this.handle + ' .main-storage').empty().append(main_storage);
		$(this.handle + ' .extra-storage').empty().append(extra_storage);
		$(this.handle + ' .total-storage').empty().append(storage_space.all);
		$(this.handle + ' .used-storage').empty().append(storage_space.occupied);
	}
};
