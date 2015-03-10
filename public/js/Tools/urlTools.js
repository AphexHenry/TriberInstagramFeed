function urlTools()
{
}

/*
 * return the @aParam parameter from the url.
 */ 
urlTools.prototype.getUrlParameter = function(aParam)
{
var pathname = window.location.pathname.split("/");
return pathname[pathname.length-1];
};

var sURLTools = new urlTools();