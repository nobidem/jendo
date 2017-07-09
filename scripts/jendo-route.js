function JendoRoute() {
  this.data = null;
  this.routes = [];
}
JendoRoute.prototype.init = function() {
  var routeArray = [];
  if (jendo.isFileProtocol()) {
    if (window.location.search.length > 0) {
      var urlParams = window.location.search.split("&");
      routeArray = urlParams[0].replace("?", "").split("/");
    }
    if (jendo.isNullOrWhiteSpace(jendo.rootUrl)) {
      var lastIndex = window.location.pathname.lastIndexOf("/");
      jendo.rootUrl = window.location.protocol + "//" + window.location.pathname.substring(0, lastIndex + 1);
    }
  } else {
    var locationPath = window.location.pathname.trim();
    if (locationPath.length > 0) {
      if (locationPath[0] == "/") {
        routeArray = locationPath.substr(1, locationPath.length - 1).split("/");
      } else {
        routeArray = locationPath.split("/");
      }
    }
  }
  var routeData = null;
  for (var rmi = 0;rmi < this.routes.length && routeData == null;rmi++) {
    routeData = this.createRouteData(routeArray, this.routes[rmi]);
  }
  if (routeData == null) {
    this.data = {controller:"home", action:"index", id:null};
  } else {
    this.data = routeData;
  }
};
JendoRoute.prototype.mapRoute = function(value) {
  this.routes.push(value);
};
JendoRoute.prototype.createRouteData = function(routeArray, routeMap) {
  var routeData = jendo.isNull(routeMap.defaults) ? {} : routeMap.defaults;
  var routeUrl = routeMap.url.split("/");
  for (var rui = 0;rui < routeUrl.length;rui++) {
    var routeUrlItem = routeUrl[rui].trim();
    if (routeUrlItem.length > 0) {
      if (routeUrlItem[0] == "{" && routeUrlItem[routeUrlItem.length - 1] == "}") {
        var routeUrlArg = routeUrlItem.substr(1, routeUrlItem.length - 2);
        if (rui < routeArray.length) {
          var argValue = routeArray[rui];
          if (!jendo.isNullOrWhiteSpace(argValue)) {
            routeData[routeUrlArg] = argValue;
          }
        }
      } else {
        if (routeUrlItem == routeArray[rui]) {
        } else {
          return null;
        }
      }
    }
  }
  return routeData;
};
JendoRoute.prototype.getViewUrl = function(pageUrl, pageArea) {
  if (jendo.isNullOrWhiteSpace(pageUrl)) {
    var viewUrl = "/views/" + this.data.controller + "/" + this.data.action + ".html";
    var areaUrl = jendo.isNullOrWhiteSpace(this.data.area) ? "" : "/\u0430reas/" + this.data.area;
    return areaUrl + viewUrl;
  } else {
    var viewUrl = jendo.startsWith(pageUrl, "/") ? "/views" + jendo.trimRight(pageUrl, "/") + ".html" : "/views/" + jendo.trimRight(pageUrl, "/") + ".html";
    var areaUrl = jendo.isNullOrWhiteSpace(pageArea) ? "" : "/\u0430reas/" + pageArea;
    return areaUrl + viewUrl;
  }
};
JendoRoute.prototype.renderBody = function(element, pageUrl) {
  jendo(element).load(this.getViewUrl(pageUrl), function() {
    if (typeof jendo.readyFunctions != "undefined") {
      if (typeof jendo.readyFunctionIndex == "undefined") {
        jendo.readyFunctionIndex = 0;
      }
      while (jendo.readyFunctionIndex < jendo.readyFunctions.length) {
        var readyFunction = jendo.readyFunctions[jendo.readyFunctionIndex];
        jendo.readyFunctionIndex += 1;
        readyFunction();
      }
    }
  });
};
JendoRoute.prototype.pageLink = function(value) {
  if (jendo.isFileProtocol()) {
    if (!jendo.isNullOrWhiteSpace(value) && value[0] == "/") {
      return "?" + value.substring(1, value.length).replace(/\?/g, "&");
    } else {
      return value;
    }
  } else {
    return value;
  }
};
jendo.route = new JendoRoute;
jendo.renderBody = function(element, pageUrl) {
  jendo.route.renderBody(element, pageUrl);
};

