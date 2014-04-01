/**
	For simple applications, you might define all of your models, collections,
	and sources in this file.  For more complex applications, you might choose to separate
	these kind definitions into multiple files under this folder.
*/
enyo.kind({
	name: "seoulart.ArtList.Controller",
	kind: "enyo.CollectionController"
});

enyo.kind({
	name:"seoulart.ArtModel",
	kind:"enyo.Model",
	attributes: {
		artname: null,
		subject: null,
		width: null,
		depth: null,
		workdate: null,
		material: null,
		techniques: null,
		mainimg: null,
		desc: null,
		artist: null
	},
});

enyo.kind({
	name: "seoulart.ArtCollection",
	kind: "enyo.Collection",
	model: "seoulart.ArtModel",
	getUrl: function(){
		var domain = 'http://openapi.seoul.go.kr:8088';
		//var key = 'sample'; // use for test
		var key = '77687141466e696335367368536448';
		var type = 'json';
		var service = 'EnglishListCollectionOfSeoulMOAService';
		var start_number = '';
		//var end_number = '919';
		var end_number = ''; // use for test
		return domain+'/'
			+'/'+ key +'/'+ type +'/'+ service +'/'+ this.get("start_number") +'/'+ this.get("end_number")+'/';
		//return domain+'/'
		//	+'/'+ key +'/'+ type +'/'+ service +'/'+ start_number+'/'+ end_number+'/';
	},
	//url: "http://openapi.seoul.go.kr:8088/sample/json/EnglishListCollectionOfSeoulMOAService/1/5/",
	create:function(){
		this.inherited(arguments);
		//alert(this.get("start_number")+this.get("end_number"));
		this.fetch();
	},
	parse: function(data){
		return data.EnglishListCollectionOfSeoulMOAService.row;
	}
});


