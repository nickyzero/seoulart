/**
	For simple applications, you might define all of your views in this file.  
	For more complex applications, you might choose to separate these kind definitions 
	into multiple files under this folder.
*/

enyo.kind({
	name: "moon.sample.SeoulArtMuseum",
	kind: "moon.Panels",
	pattern: "activity",
	classes: "moon enyo-fit",
	handlers:{
		onRequestReplacePanel : "requestReplacePanel",
		onRequestPushPanel: "requestPushPanel"
	},
	components: [
		{
			kind: "moon.Panel", 
			name: "mainPanel", 
			classes:"moon-3h", 
			headerBackgroundSrc:"assets/Logo_BW.jpg", 
			headerBackgroundPosition: "center left", 
			title:"",
			handlers:{
				ontap: "selectedItem"
			}, 
			components: [
				{kind:"moon.Item", content:"Today's Arts"},
				{kind:"moon.Item", content:"Gallery"},
				{kind:"moon.Item", content:"SeMA"},
				{kind:"moon.Item", content:"App Info"}
			],
			selectedItem: function(inSender,inEvent){
				// If you click a Item then selectedItem will be Called.
				// and check a content of selected Item. 
				// when matched, request replace the panel to main Panels 
				if(inEvent.originator.content == "Today's Arts"){
					this.bubble("onRequestReplacePanel", {panel:{kind:"todayArtPanel"}});
				} else if (inEvent.originator.content == "Gallery"){
					this.bubble("onRequestReplacePanel", {panel:{kind:"galleryPanel"}})
				} else if (inEvent.originator.content == "SeMA"){
					this.bubble("onRequestReplacePanel", {panel:{kind:"semaPanel"}})
				} else if (inEvent.originator.content == "App Info"){
					this.bubble("onRequestReplacePanel", {panel:{kind:"appInfoPanel"}})
				}
			}
		},
		{
			kind: "todayArtPanel" // for publish
			//kind : "galleryPanel" //for develop
		},
	],
	create: function(){
		this.inherited(arguments);
	},
	requestReplacePanel: function(inSender, inEvent){
		// When requestReplacePanel called, Panels will be replace 2nd panel to requested panel
		this.replacePanel(this.getPanelIndex(inEvent.originator)+1,inEvent.panel);
	},
	requestPushPanel: function(inSender, inEvent){
		// When artDetailPanel existed, remove that panel
		if(this.getPanels().length == 3){
			this.popPanels(2);
		}
		// push artDetailPanel after galleryPanel
		this.pushPanel(inEvent.panel);
	}
});

enyo.kind({
	name: "todayArtPanel", 
	kind: "moon.Panel",
	joinToPrev: true,
	title: "Today's Art",
	headerBackgroundSrc:"assets/Sema_Title.jpg", 
	headerBackgroundPosition: "top left", 
	//classes: "moon enyo-unselectable enyo-fit",
	published: {
		collection: null,
		totalArts : null,
		todayArts: null,
	},
	components: [{
		kind: 'moon.Scroller', 
		classes: "enyo-fill", 
		components: [{
			components: [{
				kind: "moon.Divider", 
				content: "Today's Recommended Arts", 
				spotlight: true
			},{
				kind: "enyo.DataRepeater",
				name: "todayArtList",
				components: [{
					kind: "moon.sample.ImageItem"
				}]
			}]
		}]
	}],
	// Todays Arts Binding and create
	bindings: [
		{from: ".collection", to: ".$.todayArtList.collection"},
	],
	create: function () {
		this.inherited(arguments);
		// set the collection that will fire the binding and add it to the list

		// 2014 4 22 now working
		var temp = new seoulart.ArtCollection({start_number:'1', end_number:'2'});
		this.totalArts = temp.get("totalCount");
		alert("Total arts : " + this.totalArts);
		this.todayArts = new seoulart.ArtCollection({start_number:'1', end_number: this.totalArts});
		var artsBuffer = this.todayArts.raw();
		alert("Todays arts : " + artsBuffer);
		this.set("collection", artsBuffer);	
	},
});

enyo.kind({

	kind: "moon.ImageItem",
	name: "moon.sample.ImageItem",
	bindings: [
		{from: ".model.MAIN_IMG", to: ".source"},
		{from: ".model.SUBJECT_E", to: ".label"},
		{from: ".model.DESC_E", to: ".text"}	
	],
	create: function(){
		this.inherited(arguments);
		//this.$.image.addStyles({"width":"100%", "height":"200px"});
	}
});

enyo.kind({
	name:"galleryPanel",
	kind: "moon.Panel",  
	joinToPrev: true, 
	title:"Gallery", 
	classes : "title_name",
	headerBackgroundSrc:"assets/Sema_Title.jpg", 
	headerBackgroundPosition: "top left", 
	headerComponents: [
		//{kind: "moon.IconButton", icon: "search", small: false, ontap: "buttonTapped"},
		{kind: "moon.Button", name: "prevButton", content:"Prev", ontap:"previousItems"},
		{kind: "moon.Button", name: "nextButton", content:"Next", ontap:"nextItems"},
	], 
	published: {
		collection : null,
		totalArts : null,
		clipCount : 5
	}, 
	components: [{
		name: "gridList",
		kind: "moon.DataGridList", 
		fit: true, 
		spacing: 20, 
		minWidth: 180,
		//minHeight: 270,
		minHeight: 300, 
		fixedSize: false ,
		scrollerOptions: { 
			kind: "moon.Scroller", 
			vertical:"scroll", 
			horizontal: "hidden", 
			spotlightPagingControls: true 
		}, 
		components: [{ 
			kind: "moon.sample.GridSampleItem", 
			ontap:"showlog"
		}]
	}],
	// binding from collection to collection of datalist and gridlist 
	bindings: [
		{from: ".collection", to: ".$.dataList.collection"},
		{from: ".collection", to: ".$.gridList.collection"}	
	],
	create: function () {
		this.inherited(arguments);
		// set the collection that will fire the binding and add it to the list
		this.set("collection", new seoulart.ArtCollection({start_number:'1', end_number:String(this.clipCount)}));
		var collection = this.get("collection");
		this.totalArts = Number(collection.get("totalCount"));
		// initial state of prevbutton because it has first page
		this.$.prevButton.disabled = true;
	},
	previousItems: function(){
		// fetch our collection reference
		var collection = this.get("collection");
		// remove all of the current records from the collection
		collection.removeAll();
		// insert all new records that will update the list
		if(collection.get("start_number")){
			// decrease start_number and end_number
			var startNum = Number(collection.get("start_number")) - this.clipCount;
			var endNum = startNum + (this.clipCount-1);

			if(startNum === 1){
				// disable prevButton when enter to first page
				this.$.prevButton.disabled = true;
			} else if(endNum < this.totalArts){
				// enable nextButton when escape from last page
				this.$.nextButton.disabled = false;
			}
			// reset the collection that will fire the binding and add it to the list
			this.set("collection", new seoulart.ArtCollection({start_number:String(startNum), end_number:String(endNum)}));	

		}	
	},
	nextItems: function () {
		// fetch our collection reference
		var collection = this.get("collection");
		// now remove all of the current records from the collection
		collection.removeAll();
		// we insert all new records that will update the list
		if(collection.get("start_number")){
			// increase start_number and end_number 
			var startNum = Number(collection.get("start_number")) + this.clipCount;
			var endNum = startNum + (this.clipCount-1);

			// logic of enable/disable buttons when back to first
			if(endNum > this.totalArts){				
				endNum = this.totalArts;
				// disable nextButton when enter to last page
				this.$.nextButton.disabled = true;
			}else if(startNum > 1){
				// enable prevButton when escape from first page
				this.$.prevButton.disabled = false;
			}
			// reset the collection that will fire the binding and add it to the list
			this.set("collection", new seoulart.ArtCollection({start_number:String(startNum), end_number:String(endNum)}));	

		}
		
	},
	showlog : function(inSender, inEvent){
		// when requestPushPanel, information(caption, subCaption, source) are sending to parent. 
		this.bubble("onRequestPushPanel", 
			{panel:{
				kind:"artDetailPanel", 
				published:{
					caption: inSender.caption,
					subCaption: inSender.subCaption,
					source: inSender.source
				}}
			}
		);
	}
});

enyo.kind({
	name: "moon.sample.GridSampleItem",
	kind: "moon.GridListImageItem",
	selectionOverlayVerticalOffset: 35,
	subCaption: "Sub Caption",
	// binding datas from gridList's collection to GridListImageItem's controls
	bindings: [
		{from: ".model.SUBJECT_E", to: ".caption"},
		{from: ".model.NAME_E", to: ".subCaption"},
		{from: ".model.MAIN_IMG", to: ".source"}
	],
	create: function(){
		this.inherited(arguments);
		this.$.image.addStyles({"width":"100%", "height":"200px"});
	}
});

enyo.kind({
	name: "semaPanel", 
	kind: "moon.Panel",
	joinToPrev: true,
	title: "Seoul Museum of Art",
	headerBackgroundSrc:"assets/Sema_Title.jpg", 
	headerBackgroundPosition: "top left", 
	components:[
		{content:"This is art museum in seoul. There are many famous arts."}
	]
});

enyo.kind({
	name: "appInfoPanel", 
	kind: "moon.Panel",
	joinToPrev: true,
	title: "App Information",
	headerBackgroundSrc:"assets/Sema_Title.jpg", 
	headerBackgroundPosition: "top left", 
	components:[
		{content:"detailImage"}
	]
});

enyo.kind({
	name: "artDetailPanel",
	kind: "moon.Panel",
	title: "artDetailPanel",
	headerBackgroundSrc:"assets/Sema_Title.jpg", 
	headerBackgroundPosition: "top left",
	smallHeader: true,
	components:[
		{
			kind:"FittableColumns",
			name: "imageArea",
			components:[
				{classes: "moon-1h"},
				{kind: "enyo.Image", name: "imageArea_Image"},
				{components:[
					{kind: "moon.Divider", content: "Art Name"},
					{kind: "moon.BodyText", name: "imageArea_artName"},
					{kind: "moon.Divider", content: "Artist"},
					{kind: "moon.BodyText", name: "imageArea_artist"},

				]},
			]
		}
	],
	create: function(){
		this.inherited(arguments);
		this.$.imageArea_Image.setSrc(this.source);
		//this.$.imageArea_Image.addStyles({"height":"200%"});

		this.$.imageArea_artName.setContent(this.caption);
		this.$.imageArea_artist.setContent(this.subCaption);
	}
});