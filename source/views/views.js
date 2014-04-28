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
		totalArts : 920,
		todayArts: null
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
				components: [
				{
					kind: "moon.sample.ImageItem",
					ontap: "showDetailImage",
				},
				// 20140426 0747 Nicolas
				/*
				{
					kind:"FittableColumns",
					name: "todayImage",
					components:[
						{classes: "moon-1h"},
						{kind: "enyo.Image", name: "todayImage_Image"},
						{components:[
							{kind: "moon.Divider", content: "Art Name"},
							{kind: "moon.BodyText", name: "todayImage_artName"},
							{kind: "moon.Divider", content: "Artist"},
							{kind: "moon.BodyText", name: "todayImage_artist"},

						]},
					]
				}*/
				]
			}]
		}]
	}],
	// Todays Arts Binding and create
	bindings: [
		{from: ".collection", to: ".$.todayArtList.collection"}
	],
	create: function () {
		this.inherited(arguments);
		// set the collection that will fire the binding and add it to the list

		var today = new Date();
		var numberForGetArt = (today.getUTCFullYear() + today.getUTCMonth() + today.getUTCDate()) % Number(this.totalArts);
		this.set("collection", new seoulart.ArtCollection({start_number:String(numberForGetArt), end_number:String(numberForGetArt)}));
	},
	showDetailImage : function(inSender, inEvent){
		// when requestPushPanel, information(caption, desc, source) are sending to parent. 
		this.bubble("onRequestPushPanel", 
			{panel:{
				kind:"artDetailPanel", 
				published:{
					caption: inSender.label,
					desc: inSender.text,
					source: inSender.source,
					artists : inSender.artistName,
					arttype: inSender.arttype,
					artdate: inSender.artdate
				}
			}}
		);
	}
});

enyo.kind({

	kind: "moon.ImageItem",
	name: "moon.sample.ImageItem",
	published: {
		artistName: null,
		arttype: null,
		artdate: null
	},
	bindings: [
		{from: ".model.MAIN_IMG", to: ".source"},
		{from: ".model.SUBJECT_E", to: ".label"},
		{from: ".model.DESC_E", to: ".text"},
		{from: ".model.NAME_E", to: ".artistName"},
		{from: ".model.ART_CODE_NAME", to: ".arttype"},
		{from: ".model.WORK_DATE", to: ".artdate"}	
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
		clipCount : 40
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
			ontap:"showDetailImage"
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
	showDetailImage : function(inSender, inEvent){
		// when requestPushPanel, information(caption, subCaption, source) are sending to parent. 
		this.bubble("onRequestPushPanel", 
			{panel:{
				kind:"artDetailPanel", 
				published:{
					caption: inSender.caption,
					artists: inSender.subCaption,
					source: inSender.source,
					desc: inSender.desc,
					arttype: inSender.arttype,
					artdate: inSender.artdate
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
	published: {
		desc: null,
		arttype: null,
		artdate: null
	},
	bindings: [
		{from: ".model.SUBJECT_E", to: ".caption"},
		{from: ".model.NAME_E", to: ".subCaption"},
		{from: ".model.MAIN_IMG", to: ".source"},
		{from: ".model.DESC_E", to: ".desc"},
		{from: ".model.ART_CODE_NAME", to: ".arttype"},
		{from: ".model.WORK_DATE", to: ".artdate"}
	],
	create: function(){
		this.inherited(arguments);
		// when drawing image on the panel, image will be resized 
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
	//classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: 'moon.Scroller', name: "scroller", classes: "enyo-fill", components: [
			{
				components: [
					{kind: "moon.Divider", content: "Seoul Museum of Art", spotlight: true},
					{
						components: [
							{
								kind: "moon.ImageItem",
								//fit:true,
								source: "assets/sema_01.png",
								label: "About SeMA",
								text: "Seoul Museum of Art is the representative art museum of Seoul, the capital of Korea and a central city of Asia, and it aims at the “Beautiful, Good, and Smart Art Museum.” For this, the museum has also set up two major objectives: the world-renowned art museum and the art museum of the city that communicates with citizens and visitors."
							},
							{
								kind: "moon.ImageItem",
								source: "assets/sema_02.png",
								label: "Exhibition",
								text: "SeMA is contributing to the development of Korean art circles through a variety of special exhibitions with Korean artists and international exhibitions that show the trend of art outside the country and also expanding the base of art culture through the Communication through Art projects."
							},
							{
								kind: "moon.ImageItem",
								source: "assets/sema_03.png",
								label: "Collections",
								text: "SeMA has a collection of 3,500 pieces of art including painting, sculpture, installation, and media, and the typical works of the masters in the art history such as Hwan Gi Kim, Young Gook Yoo, Nam June Pai, Woo Hwan Lee, Seo Bo Park, and Myoung Ro Yoon as well as contemporary and famous artists."
							}
						]
					}
				]
			},
			{tag: "br"},
			{
				components: [
					{kind: "moon.Divider", content: "Other Information"},
					{
						components: [
							{
								kind: "moon.ImageItem",
								source: "assets/clock.png",
								label: "Opening Hours",
								imageAlignRight: true,
								text: "[Weekdays] 10:00 ~ 20:00 / [Weekend] 10:00 ~ 18:00"
							},
							{
								kind: "moon.ImageItem",
								source: "assets/subway.png",
								label: "Way to the SeMA",
								imageAlignRight: true,
								text: "Subway line 1 : exit gate #1 of Seoul City Hall station (to the direction of the Seosonum annex building of Seoul City Hall) / Subway line 2 : exit gate #11 or #12 of Seoul City Hall station / Subway line 5 : exit gate #5 of Gwanghwamun station"
							},
							{
								kind: "moon.ImageItem",
								source: "assets/hall.png",
								label: "Exhibition Hall Information",
								imageAlignRight: true,
								text: "B1 : Lecture hall & Seminar room / 1F : Nursery & the 1nd Exhibition Room / 2F : the 2nd Exhibition Room & Chun Kyung-Ja Hall & Museum Library / 3F : the 3rd Exhibition Room & the 4th Exhibition Room"
							}
						]
					}
				]
			}
		]}
	],
	create: function(){
		this.inherited(arguments);
		this.$.scroller.addStyles({"width":"100%"});
	}
});

enyo.kind({
	name: "appInfoPanel", 
	kind: "moon.Panel",
	joinToPrev: true,
	title: "App Information",
	headerBackgroundSrc:"assets/Sema_Title.jpg", 
	headerBackgroundPosition: "top left", 
	components:[
		{kind: "FittableRows",
			classes: "moon enyo-unselectable enyo-fit",
			components: [
				{kind: "moon.Scroller", fit: true,  
					components: [
						{kind: "moon.Divider", content: "Application Infomation"},
						{kind: "moon.ExpandableText", content: "Version: 1.0"},
						{tag: "br"},
						
						{kind: "moon.Divider", content: "Purpose of This Application"},
						{kind: "moon.ExpandableText", content: "To help to promote Enyo Application and its Eco-System"},
						{tag: "br"},
						
						{kind: "moon.Divider", content: "Development"},
						{kind: "moon.ExpandableText", content: "TED part, Software Platform Lab., CTO division, LG Electronics"},
						{tag: "br"},
						
						{kind: "moon.Divider", content: "Copyright"},
						{kind: "moon.ExpandableText", content: "Copyright © 2014 LG Electronics. All Rights Reserved."},
					]
				}
			]
		}
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
				{classes: "moon-1h"},
				{kind:"FittableRows",
					components:[
						{
							kind: "FittableColumns",
							components:[
								{components:[
									{kind: "moon.Divider", content: "Art Name"},
									{kind: "moon.BodyText", name: "imageArea_artName"},
									{tag: "br"},
									{kind: "moon.Divider", content: "Art Type"},
									{kind: "moon.BodyText", name: "imageArea_artType"},
								]},
								{components:[
									{kind: "moon.Divider", content: "Artist"},
									{kind: "moon.BodyText", name: "imageArea_artist"},	
									{tag: "br"},
									{kind: "moon.Divider", content: "Created Date"},
									{kind: "moon.BodyText", name: "imageArea_artDate"},
								]}
							]
						},
						{
							kind: "FittableColumns",
							components:[
								{kind:"FittableRows",
								components:[
									{kind: "moon.Divider", name: "imageArea_discription_divider", content: "Description"},
									{kind: "moon.BodyText", fit:true, name: "imageArea_discription"},
								]}
							]
						}
					]
				},
			]
		}
	],
	create: function(){
		this.inherited(arguments);
		this.$.imageArea_discription.setBounds({width: 65, height: 100}, "%")
		//this.$.imageArea_discription_divider.setBounds({width: 65, height: 100}, "%")
		this.$.imageArea_Image.setSrc(this.source);
		//this.$.imageArea_Image.addStyles({"height":"200%"});
		this.$.imageArea_artName.setContent(this.caption);

		if(typeof this.artists == "undefined"){
			this.$.imageArea_artist.hide();
		} else {
			this.$.imageArea_artist.setContent(this.artists);
		}
		
		if(typeof this.desc == "undefined"){
			this.$.imageArea_discription.hide();
		} else {
			this.$.imageArea_discription.setContent(this.desc);
		}

		if(typeof this.arttype == "undefined"){
			this.$.imageArea_artType.hide();
		} else {
			this.$.imageArea_artType.setContent(this.arttype);
		}

		if(typeof this.artdate == "undefined"){
			this.$.imageArea_artDate.hide();
		} else {
			this.$.imageArea_artDate.setContent(this.artdate);
		}
		
	}
});