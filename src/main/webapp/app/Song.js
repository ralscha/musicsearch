Ext.define("MusicSearch.Song",
{
  extend : "Ext.data.Model",
  fields : [ {
    name : "id",
    type : "int"
  }, {
    name : "title",
    type : "string"
  }, {
    name : "album",
    type : "string"
  }, {
    name : "artist",
    type : "string"
  }, {
    name : "year",
    type : "string"
  }, {
    name : "durationInSeconds",
    type : "int"
  }, {
    name : "bitrate",
    type : "int"
  }, {
    name : "encoding",
    type : "string"
  } ],
  proxy : {
    type : "direct",
    directFn : "searchService.search"
  }
});