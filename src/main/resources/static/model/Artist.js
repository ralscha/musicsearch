Ext.define("MusicSearch.model.Artist",
{
  extend : "Ext.data.Model",
  fields : [ {
    name : "first",
    type : "string"
  }, {
    name : "name",
    type : "string"
  } ],
  proxy : {
    type : "direct",
    directFn : "searchService.readArtists"
  }
});