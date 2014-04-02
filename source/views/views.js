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
	
	published: {
		collection : null,
		totalArts : null,
		clipCount : 40
	},
	components: [
		{kind: "moon.Panel", name: "mainPanel", classes:"moon-3h", headerBackgroundSrc:"assets/Logo_BW.jpg", headerBackgroundPosition: "center left", title:"", components: [
			{kind:"moon.Item", content:"Introduction"},
			{kind:"moon.Item", content:"Gallery"},
			{kind:"moon.Item", content:"SeMA"},
			{kind:"moon.Item", content:"App Info"}
		]},
		
		{kind: "moon.Panel", name:"subPanel", joinToPrev: true, title:"Seoul Museum of Art", classes : "title_name", headerBackgroundSrc:"assets/Sema_Title.jpg", headerBackgroundPosition: "top left", 
			headerComponents: [
			{kind: "moon.IconButton", icon: "search", small: false, ontap: "buttonTapped"},
			{kind: "moon.Button", name: "prevButton", content:"Prev", ontap:"previousItems"},
			{kind: "moon.Button", name: "nextButton", content:"Next", ontap:"nextItems"},
			
			], 
			components: [
			{
				name: "gridList",
				kind: "moon.DataGridList", 
				fit: true, 
				spacing: 20, 
				minWidth: 180,
				//minHeight: 270,
				minHeight: 500, 
				fixedSize: false ,
				scrollerOptions: { kind: "moon.Scroller", vertical:"scroll", horizontal: "hidden", spotlightPagingControls: true }, 
				components: [
				{ kind: "moon.sample.GridSampleItem", ontap:"showlog"}
			]}
		]},

		//add panel by nicolas
		{kind: "moon.Panel", name: "detailImage", }
	],

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
	showlog : function(){
		alert("clicked");
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
	]
});