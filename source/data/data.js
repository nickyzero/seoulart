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
		var url.domain = 'http://openapi.seoul.go.kr:8088';
		var url.key = 'sample';
		// var url.key = '77687141466e696335367368536448';
		var url.type = 'json';
		var url.service = 'EnglishListCollectionOfSeoulMOAService';
		var url.start_number = '1';
		var url.end_number = '50';
		return url.domain+'/'
			+'/'+ url.key +'/'+ url.type +'/'+ url.service +'/'+ url.start_number +'/'+ url.end_number+'/';
	},
	parse: function(data){
		return data.row;
	}
});

/*
url.domain = 'http://openapi.seoul.go.kr:8088';
		//url.key = 'sample';
		url.key = '77687141466e696335367368536448';
		url.type = 'json';
		url.service = 'EnglishListCollectionOfSeoulMOAService';
		url.start_number = '1';
		url.end_number = '50';
*/

