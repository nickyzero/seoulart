enyo.kind({
	name: "MyControl",
	published: {
		model: ""
	},
	components: [
		{kind: "enyo.Control", name: "nameLabel"},
		{kind: "moon.Slider", name: "slider", onChanging: "sliderChanging"},
		{kind: "moon.Input", name: "input", oninput: "inputChanged"}
	],
	create: function() {
		this.inherited(arguments);
		this.$.nameLabel.set("content", this.model.get("name"));
		this.$.slider.set("value", this.model.get("value"));
		this.$.input.set("value", this.model.get("value"));
	},
	sliderChanging: function(inSender, inEvent) {
		this.$.input.set("value", inEvent.value);
		this.model.set("value", inEvent.value)
	},
	inputChanged: function(inSender, inEvent) {
		this.$.slider.set("value", inSender.get("value"));
		this.model.set("value", inSender.get("value"));
	}
}); 

new MyControl({
    fit: true, 
    model: new enyo.Model({name: "Bob", value:20})
}).write();