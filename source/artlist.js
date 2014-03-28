enyo.kind({
  name: 'ProductList',
  kind: enyo.Control,  
  components: [
      {name: 'btn', content: 'Load Products', ontap: 'loadProducts', tag:'button'},
      {name: 'list', tag: 'ul'}
  ],  
  loadProducts: function() {
      new enyo.Ajax({
        url: 'http://openAPI.seoul.go.kr:8088/sample/xml/EnglishListCollectionOfSeoulMOAService/1/5/'
      })
      .go()
      .response(this, 'processResponse');
  },
  processResponse: function(inSender, inResponse) {
    var json = JSON.parse(inResponse);
    var art = new Array();
        art = json.EnglishListCollectionOfSeoulMOAService.row;
      
    for (var i in art){         
          for(var j in art[i]){
            var artInfo = art[i];
            this.$.list.addchild(new enyo.Control({
              tag: 'li',
              content: artInfo[j]
            }))
            
          }
        }
        this.$.list.render();
    }
});
var products = new ProductList().renderInto(document.body);