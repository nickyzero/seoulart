enyo.kind({
	name: "moon.sample.ListVerticalSample",
	classes: "moon enyo-unselectable enyo-fit",
	published: {
		index: 0,
		pageSize: 3
	},
	components: [
		{name: "list", kind: "moon.List", spotlight: true, orient:"v", count: 2000, multiSelect: false,
			classes: "enyo-fit list-vertical-controls-sample-list moon-list-vertical-sample",
			onSetupItem: "setupItem", components: [
			{name: "item", classes: "list-vertical-sample-item enyo-border-box", components: [
				{name: "index", classes: "list-sample-index"},
				{name: "name"}
			]}
		]}
	],
	names: [],
	setupItem: function(inSender, inEvent) {
		/* global makeName */
		// this is the row we're setting up
		var i = inEvent.index;
		// make some mock data if we have none for this row
		if (!this.names[i]) {
			this.names[i] = makeName(5, 10, '', '');
		}
		var n = this.names[i];
		var ni = ("00000000" + i).slice(-7);
		// apply selection style if inSender (the list) indicates that this row is selected.
		this.$.item.addRemoveClass("list-sample-selected", inSender.isSelected(i));
		this.$.name.setContent(n);
		this.$.index.setContent(ni);
	}
});