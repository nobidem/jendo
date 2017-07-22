/*!
 * Jendo v1.1.1
 * https://nobidem.github.io/jendo/
 *
 * Copyright Nobidem
 * Released under the MIT license
 * https://nobidem.github.io/jendo/license
 */
function jendo(value) {
    return new JendoSelector(document, value)
}
jendo.id = function(elementId) {
    if (jendo.isNull(elementId)) {
        return null
    } else {
        var elm = new JendoSelector(document, document.getElementById(elementId));
        elm.selector = "#" + elementId;
        return elm
    }
};
jendo.class = function(className) {
    if (jendo.isNull(className)) {
        return null
    } else {
        var elm = new JendoSelector(document, document.getElementsByClassName(className));
        elm.selector = "." + className;
        return elm
    }
};
jendo.tag = function(tagName) {
    return new HtmlElementCollectionModel(document.getElementsByTagName(tagName))
};
jendo.get = function(url) {
    return new JendoHttpRequest("GET", url)
};
jendo.post = function(url) {
    return new JendoHttpRequest("POST", url)
};
jendo.put = function(url) {
    return new JendoHttpRequest("PUT", url)
};
jendo.delete = function(url) {
    return new JendoHttpRequest("DELETE", url)
};
jendo.getJSONP = function(url) {
    return new JendoJSONPRequest(url)
};
jendo.createElement = function(tagName) {
    if (jendo.isNullOrWhiteSpace(tagName)) {
        return null
    } else {
        var element = new JendoSelector(document, document.createElement(tagName));
        element.selector = tagName;
        return element
    }
};
jendo.createElementDiv = function() {
    return jendo.createElement("div")
};
jendo.createElementP = function() {
    return jendo.createElement("p")
};
jendo.createElementSamp = function() {
    return jendo.createElement("samp")
};
jendo.createElementSpan = function() {
    return jendo.createElement("span")
};
jendo.createElementA = function(href, text) {
    var elm = jendo.createElement("a").attr("href", href);
    if (!jendo.isNullOrEmpty(text)) {
        elm.text(text)
    }
    return elm
};
jendo.createElementImg = function(src) {
    return jendo.createElement("img").attr("src", src)
};
jendo.createElementButton = function(text) {
    var elm = jendo.createElement("button").attr("type", "button");
    if (!jendo.isNullOrEmpty(text)) {
        elm.text(text)
    }
    return elm
};
jendo.guid = function(delimiter) {
    var guidPattern = typeof delimiter == "undefined" ? "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx" : "xxxxxxxx" + delimiter + "xxxx" + delimiter + "4xxx" + delimiter + "yxxx" + delimiter + "xxxxxxxxxxxx";
    var d = (new Date).getTime();
    var uuid = guidPattern.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == "x" ? r : r & 3 | 8).toString(16)
    });
    return uuid
};
jendo.now = function() {
    return new Date
};
jendo.daysInMonth = function(month, year) {
    return new Date(year, month, 0).getDate()
};
jendo.dateFormat = function(date, pattern) {
    if (jendo.constructorName(date).toLowerCase() == "date") {
        var yyyy = date.getFullYear().toString();
        var yy = yyyy.length > 2 ? yyyy.substr(yyyy.length - 2, 2) : yyyy;
        var MM = (date.getMonth() + 1).toString();
        var dd = date.getDate().toString();
        var nHH = date.getHours();
        var HH = nHH.toString();
        var hh = (nHH > 12 ? nHH - 12 : nHH).toString();
        var tt = nHH >= 12 ? "PM" : "AM";
        var mm = date.getMinutes().toString();
        var ss = date.getSeconds().toString();
        var fff = (1e3 + date.getMilliseconds()).toString();
        var tz = date.getTimezoneOffset() / .6;
        var zzz = (tz > 0 ? "GMT-" : "GMT+") + (1e4 + Math.abs(tz)).toString().substr(1);
        return pattern.replace(/yyyy/g, yyyy).replace(/yy/g, yy).replace(/MM/g, MM[1] ? MM : "0" + MM[0]).replace(/M/g, MM).replace(/dd/g, dd[1] ? dd : "0" + dd[0]).replace(/d/g, dd).replace(/HH/g, HH[1] ? HH : "0" + HH[0]).replace(/H/g, HH).replace(/hh/g, hh[1] ? hh : "0" + hh[0]).replace(/h/g, hh).replace(/mm/g, mm[1] ? mm : "0" + mm[0]).replace(/m/g, mm).replace(/ss/g, ss[1] ? ss : "0" + ss[0]).replace(/s/g, ss).replace(/fff/g, fff.substr(1, 3)).replace(/ff/g, fff.substr(1, 2)).replace(/f/g, fff.substr(1, 1)).replace(/zzz/g, zzz).replace(/tt/g, tt)
    } else {
        return ""
    }
};
jendo.ready = function(functionValue) {
    if (typeof this.readyFunctions == "undefined") {
        this.readyFunctions = []
    }
    this.readyFunctions.push(functionValue)
};
jendo.includeStyle = function(url, callback) {
    var styleHref = jendo.validateUrl(url);
    var link = document.querySelector('link[href="' + styleHref + '"]');
    if (link == null) {
        link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = styleHref;
        if (!jendo.isNullOrEmpty(callback)) {
            link.onload = callback
        }
        document.head.appendChild(link)
    }
};
jendo.includeScript = function(url, callback) {
    var script = document.querySelector('script[src="' + url + '"]');
    if (script == null) {
        script = document.createElement("script");
        script.src = url;
        if (typeof callback != "undefined") {
            script.onload = callback
        }
        document.head.appendChild(script)
    }
};
jendo.loadDOM = function(data, element, keepScripts, callback) {
    if (typeof element == "undefined") {
        element = document.createElement("div")
    }
    if (typeof keepScripts == "undefined") {
        keepScripts = true
    }
    var loadWaiting = 0;

    function loadReady() {
        if (loadWaiting == 0 && !jendo.isNull(callback)) {
            callback()
        }
    }

    function loadNodes(docNodes, element, keepScripts) {
        for (var i = 0; i < docNodes.length; i++) {
            var docNode = docNodes[i];
            if (docNode.nodeName == "SCRIPT") {
                if (keepScripts) {
                    var oScript = document.createElement(docNode.localName);
                    for (var attrIndex = 0; attrIndex < docNode.attributes.length; attrIndex++) {
                        oScript.setAttribute(docNode.attributes[attrIndex].name, docNode.attributes[attrIndex].value)
                    }
                    oScript.textContent = docNode.textContent;
                    if (!jendo.isNull(docNode.attributes.src)) {
                        loadWaiting += 1;
                        oScript.addEventListener("load", function(handler) {
                            loadWaiting -= 1;
                            loadReady()
                        })
                    }
                    element.appendChild(oScript)
                }
            } else if (docNode.nodeName == "#text") {
                if (docNode.nodeValue != "" && docNode.nodeValue != "\n") {
                    var oText = document.createTextNode(docNode.nodeValue);
                    element.appendChild(oText)
                }
            } else if (docNode.nodeName == "#comment") {} else {
                var oElement = document.createElement(docNode.localName);
                for (var attrIndex = 0; attrIndex < docNode.attributes.length; attrIndex++) {
                    oElement.setAttribute(docNode.attributes[attrIndex].name, docNode.attributes[attrIndex].value)
                }
                element.appendChild(oElement);
                loadNodes(docNode.childNodes, oElement)
            }
        }
    }
    loadNodes(data, element, keepScripts);
    loadReady();
    return element
};
jendo.parseHTML = function(data) {
    if (typeof data == "string") {
        var dataHtml = data.trim();
        if (!jendo.startsWith(dataHtml, "<!DOCTYPE") || !jendo.startsWith(dataHtml, "<html")) {
            dataHtml = "<!DOCTYPE html><html><body>" + dataHtml + "</body></html>"
        }
        var parser = new DOMParser;
        return parser.parseFromString(dataHtml, "text/html")
    } else {
        return null
    }
};
jendo.parseXML = function(data) {
    if (typeof data == "string") {
        return (new DOMParser).parseFromString(data, "text/xml")
    } else {
        return null
    }
};
jendo.toJson = function(value) {
    if (jendo.isNullOrEmpty(value)) {
        return "{}"
    } else {
        switch (typeof value) {
            case "string":
                return '"' + value.replace(/\"/g, '\\"').replace(/\n/g, "\\n") + '"';
            case "function":
                var funValue = (value.name || value.toString()).replace(/\"/g, '\\"').replace(/\n/g, "\\n");
                return '"' + funValue + '"';
            case "object":
                var isArray = Array.isArray(value);
                return "{[" [+isArray] + Object.keys(value).map(function(key) {
                    return '"' + key + '":' + jendo.toJson(value[key])
                }).join(",") + "}]" [+isArray];
            default:
                return value.toString()
        }
    }
};
jendo.startsWith = function(valueString, searchString, position) {
    if (typeof valueString === "string" && typeof searchString === "string") {
        position = position || 0;
        return valueString.substr(position, searchString.length).toLowerCase() === searchString.toLowerCase()
    } else {
        return false
    }
};
jendo.trimRight = function(valueString, trimString) {
    for (var i = valueString.length - 1; i >= 0; i--) {
        if (trimString != valueString.charAt(i)) {
            return valueString.substring(0, i + 1)
        }
    }
    return ""
};
jendo.isNull = function(value) {
    if (typeof value == "undefined") {
        return true
    } else if (value == null) {
        return true
    } else {
        return false
    }
};
jendo.isNullOrEmpty = function(value) {
    if (jendo.isNull(value)) {
        return true
    } else if (typeof value == "string") {
        return value == ""
    } else if (Array.isArray(value)) {
        return value.length == 0
    } else {
        return false
    }
};
jendo.isNullOrWhiteSpace = function(value) {
    if (jendo.isNull(value)) {
        return true
    } else if (typeof value == "string") {
        return value.replace(/ /g, "").replace(/\r/g, "").replace(/\n/g, "") == ""
    } else if (Array.isArray(value)) {
        return value.length == 0
    } else {
        return false
    }
};
jendo.isVisible = function(element) {
    if (jendo.isNull(element)) {
        return false
    } else {
        return !((element.style == null ? true : element.style.display === "none" || element.style.visibility === "hidden") || element.offsetParent === null)
    }
};
jendo.inArray = function(value, array, fromIndex) {
    for (var i = 0; i < array.length; i++) {
        if (value == array[i]) {
            return i
        }
    }
    return -1
};
jendo.constructorName = function(element) {
    if (element == null) {
        return ""
    } else if ("name" in element.constructor) {
        return element.constructor.name
    } else {
        var con = element.constructor.toString().trim();
        var indexFS = con.indexOf("function");
        if (indexFS == 0) {
            var indexFE = con.indexOf("(");
            if (indexFE == -1) {
                return con.substring(indexFS + 8, con.length)
            } else {
                return con.substring(indexFS + 8, indexFE).trim()
            }
        } else {
            var conMatch = con.match(/^\[object\s(.+)\]/);
            if (conMatch != null) {
                return conMatch[1]
            } else {
                conMatch = con.match(/^function\s(.+)\(/);
                if (conMatch != null) {
                    return conMatch[1]
                } else {
                    return con
                }
            }
        }
    }
};
jendo.screenWidth = function() {
    return screen.width
};
jendo.screenHeight = function() {
    return screen.height
};
jendo.windowWidth = function() {
    return window.innerWidth
};
jendo.windowHeight = function() {
    return window.innerHeight
};
jendo.isFileProtocol = function() {
    return window.location.protocol == "file:"
};
jendo.combineUrl = function(url1, url2) {
    if (jendo.startsWith(url2, "/")) {
        return jendo.trimRight(url1, "/") + url2
    } else {
        return jendo.trimRight(url1, "/") + "/" + url2
    }
};
jendo.validateUrl = function(url) {
    if (jendo.isNullOrWhiteSpace(url)) {
        return ""
    } else if (jendo.isFileProtocol()) {
        if (jendo.startsWith(url, "file:///")) {
            return url
        } else if (url[0] == "/") {
            return "." + url
        } else {
            return url
        }
    } else {
        return url
    }
};
jendo.geolocation = function(options) {
    return new JendoGeolocation(options)
};

function JendoSelector(container, item) {
    this.selector = "";
    this.container = jendo.isNull(container) ? document : container;
    this.items = [];
    var typeItem = typeof item;
    if (typeItem == "object") {
        if (item != null) {
            this.selector = jendo.constructorName(item);
            if (this.selector == "HTMLCollection" || this.selector == "NodeList" || this.selector == "HTMLUListElement" || this.selector == "Array") {
                for (var i = 0; i < item.length; i++) {
                    this.items.push(item[i])
                }
            } else if (this.selector == "JendoSelector") {
                for (var i = 0; i < item.items.length; i++) {
                    this.items.push(item.items[i])
                }
            } else {
                this.items.push(item)
            }
        }
    } else if (typeItem == "string" && item.length > 0) {
        this.selector = item;
        var elements = this.container.querySelectorAll(this.selector);
        for (var i = 0; i < elements.length; i++) {
            this.items.push(elements[i])
        }
    }
    this.length = this.items.length
}
JendoSelector.prototype.find = function(item) {
    if (this.items.length > 0) {
        var tagSelector = new JendoSelector;
        tagSelector.selector = item;
        for (var i = 0; i < this.items.length; i++) {
            var findElements = this.items[i].querySelectorAll(item);
            for (var f = 0; f < findElements.length; f++) {
                tagSelector.items.push(findElements[f])
            }
        }
        tagSelector.length = tagSelector.items.length;
        return tagSelector
    } else {
        return new JendoSelector(this.container, item)
    }
};
JendoSelector.prototype.tag = function(name) {
    if (this.items.length > 0) {
        var tagSelector = new JendoSelector;
        tagSelector.selector = name;
        for (var i = 0; i < this.items.length; i++) {
            var findElements = this.items[i].getElementsByTagName(name);
            for (var f = 0; f < findElements.length; f++) {
                tagSelector.items.push(findElements[f])
            }
        }
        tagSelector.length = tagSelector.items.length;
        return tagSelector
    } else {
        return new JendoSelector
    }
};
JendoSelector.prototype.item = function(index) {
    var itemIndex = 0;
    if (!jendo.isNull(index)) {
        itemIndex = index
    }
    if (this.items.length > itemIndex) {
        return new JendoSelector(this.container, this.items[itemIndex])
    } else {
        return null
    }
};
JendoSelector.prototype.isVisible = function() {
    return jendo.isVisible(this.first())
};
JendoSelector.prototype.html = function(value) {
    var valueType = typeof value;
    if (valueType == "undefined") {
        var item = this.first();
        return item == null ? "" : item.innerHTML
    } else if (valueType == "function") {
        this.forEach(function(i, item) {
            var htmlValue = item.innerHTML;
            var htmlResult = jendo.isNullOrEmpty(htmlValue) ? eval("value(" + i + ", '')") : eval("value(" + i + ", '" + htmlValue.replace(/'/g, "\\'") + "')");
            item.innerHTML = htmlResult
        })
    } else {
        this.forEach(function(i, item) {
            item.innerHTML = value
        });
        return this
    }
};
JendoSelector.prototype.toHtml = function() {
    return new JendoSelector(jendo.parseHTML(this.text()), "body")
};
JendoSelector.prototype.val = function(value) {
    var valueType = typeof value;
    if (valueType == "undefined") {
        if (this.items.length > 0) {
            var firstItem = this.items[0];
            if (firstItem.multiple && "options" in firstItem) {
                var selOptions = [];
                for (var i = 0; i < firstItem.options.length; i++) {
                    var fiOption = firstItem.options[i];
                    if (fiOption.selected) {
                        selOptions.push(fiOption.value)
                    }
                }
                return selOptions
            } else {
                return firstItem.value
            }
        } else {
            return ""
        }
    } else if (valueType == "object") {
        var valueConstr = jendo.constructorName(value);
        if (valueConstr == "Array") {
            for (var vl = 0; vl < value.length; vl++) {
                var currValue = value[vl];
                for (var i = 0; i < this.items.length; i++) {
                    var currItem = this.items[i];
                    var currItemType = currItem.type;
                    if (currItemType == "select-multiple") {
                        for (var i = 0; i < currItem.options.length; i++) {
                            var ciOption = currItem.options[i];
                            if (ciOption.value == currValue) {
                                ciOption.selected = true
                            }
                        }
                    } else if (currItemType == "checkbox") {
                        if (currItem.value == currValue) {
                            currItem.checked = true
                        }
                    } else if (currItemType == "radio") {
                        if (currItem.value == currValue) {
                            currItem.checked = true
                        }
                    } else {
                        currItem.value = currValue
                    }
                }
            }
        }
        return this
    } else {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].value = value
        }
        return this
    }
};
JendoSelector.prototype.text = function(value) {
    var valueType = typeof value;
    if (typeof value == "undefined") {
        var textResult = "";
        this.forEach(function(i, item) {
            textResult += item.textContent
        });
        return textResult
    } else if (valueType == "function") {
        this.forEach(function(i, item) {
            var textValue = item.textContent;
            var textResult = jendo.isNullOrEmpty(textValue) ? eval("value(" + i + ", '')") : eval("value(" + i + ", '" + textValue.replace(/'/g, "\\'") + "')");
            item.textContent = textResult
        });
        return this
    } else {
        this.forEach(function(i, item) {
            item.textContent = value
        });
        return this
    }
};
JendoSelector.prototype.data = function(key, value) {
    if (jendo.isNull(key)) {
        return this
    } else {
        return this.attr("data-" + key, value)
    }
};
JendoSelector.prototype.removeData = function(key) {
    if (jendo.isNull(key)) {
        return this
    } else {
        return this.removeAttr("data-" + key)
    }
};
JendoSelector.prototype.attr = function(key, value) {
    if (jendo.isNull(key)) {
        return this
    } else if (jendo.isNull(value)) {
        var tKey = typeof key;
        if (tKey == "object") {
            this.forEach(function(i, item) {
                for (var propName in key) {
                    item.setAttribute(propName, key[propName])
                }
            });
            return this
        } else {
            var item = this.first();
            if (item == null) {
                return null
            } else {
                var attrItem = item.attributes[key];
                return attrItem == null ? null : attrItem.value
            }
        }
    } else {
        var tValue = typeof value;
        if (tValue == "function") {
            this.forEach(function(i, item) {
                var iValue = item.attributes[key];
                var fValue = jendo.isNullOrEmpty(iValue) ? eval("value(" + i + ", '')") : eval("value(" + i + ", '" + iValue.value.replace(/'/g, "\\'") + "')");
                item.setAttribute(key, fValue)
            })
        } else {
            this.forEach(function(i, item) {
                item.setAttribute(key, value)
            })
        }
        return this
    }
};
JendoSelector.prototype.removeAttr = function(key) {
    if (!jendo.isNull(key)) {
        this.forEach(function(i, item) {
            item.removeAttribute(key)
        })
    }
    return this
};
JendoSelector.prototype.attrId = function(value) {
    return this.attr("id", value)
};
JendoSelector.prototype.role = JendoSelector.prototype.attrRole = function(value) {
    return this.attr("role", value)
};
JendoSelector.prototype.class = function(value) {
    if (jendo.isNull(value)) {
        return this.attr("class")
    } else {
        this.attr("class", value);
        return this
    }
};
JendoSelector.prototype.addClass = function(value) {
    if (!jendo.isNull(value)) {
        this.forEach(function(i, item) {
            item.classList.add(value)
        })
    }
    return this
};
JendoSelector.prototype.removeClass = function(value) {
    if (!jendo.isNull(value)) {
        this.forEach(function(i, item) {
            item.classList.remove(value)
        })
    }
    return this
};
JendoSelector.prototype.toggle = function(value) {
    if (!jendo.isNull(value)) {
        this.forEach(function(i, item) {
            item.classList.toggle(value)
        })
    }
    return this
};
JendoSelector.prototype.prop = function(key, value) {
    if (jendo.isNull(key)) {
        return this
    } else if (jendo.isNull(value)) {
        var tKey = typeof key;
        if (tKey == "object") {
            this.forEach(function(i, item) {
                for (var propName in key) {
                    item[propName] = key[propName]
                }
            });
            return this
        } else {
            var item = this.first();
            return item == null ? null : item[key]
        }
    } else {
        var tValue = typeof value;
        if (tValue == "function") {
            this.forEach(function(i, item) {
                var iValue = item[key];
                var fValue = jendo.isNullOrEmpty(iValue) ? eval("value(" + i + ", '')") : eval("value(" + i + ", '" + iValue.replace(/'/g, "\\'") + "')");
                item[key] = fValue
            })
        } else {
            this.forEach(function(i, item) {
                item[key] = value
            })
        }
        return this
    }
};
JendoSelector.prototype.removeProp = function(key) {
    if (jendo.isNull(key)) {
        return this
    } else {
        this.forEach(function(i, item) {
            delete item[key]
        });
        return this
    }
};
JendoSelector.prototype.parent = function(selector) {
    var jParent = new JendoSelector;
    if (jendo.isNullOrWhiteSpace(selector)) {
        jParent.selector = ""
    } else {
        jParent.selector = selector
    }
    for (var i = 0; i < this.items.length; i++) {
        var eParent = this.items[i].parentElement;
        if (jParent.selector == "") {
            jParent.items.push(eParent)
        } else if (eParent.matches(selector)) {
            jParent.items.push(eParent)
        }
    }
    return jParent
};
JendoSelector.prototype.is = function(value) {
    if (jendo.isNull(value)) {
        return false
    } else {
        var vlType = typeof value;
        if (vlType == "function") {
            var isResult = false;
            for (var t = 0; t < this.items.length && !isResult; t++) {
                var thisItem = this.items[t];
                var fnResult = eval("value(t, thisItem)");
                if (typeof fnResult === "boolean") {
                    isResult = fnResult
                }
            }
            return isResult
        } else {
            var isResult = false;
            var elements = jendo(value).items;
            for (var t = 0; t < this.items.length && !isResult; t++) {
                var thisItem = this.items[t];
                for (var e = 0; e < elements.length && !isResult; e++) {
                    isResult = thisItem.isSameNode(elements[e])
                }
            }
            return isResult
        }
    }
};
JendoSelector.prototype.isContains = function(value) {
    if (jendo.isNull(value)) {
        return false
    } else {
        var vlType = typeof value;
        if (vlType == "function") {
            var isResult = false;
            for (var t = 0; t < this.items.length && !isResult; t++) {
                var thisItem = this.items[t];
                var fnResult = eval("value(t, thisItem)");
                if (typeof fnResult === "boolean") {
                    isResult = fnResult
                }
            }
            return isResult
        } else {
            var isResult = false;
            var elements = jendo(value).items;
            for (var t = 0; t < this.items.length && !isResult; t++) {
                var thisItem = this.items[t];
                for (var e = 0; e < elements.length && !isResult; e++) {
                    isResult = thisItem.contains(elements[e])
                }
            }
            return isResult
        }
    }
};
JendoSelector.prototype.isEqual = function(value) {
    if (jendo.isNull(value)) {
        return false
    } else {
        var vlType = typeof value;
        if (vlType == "function") {
            var isResult = false;
            for (var t = 0; t < this.items.length && !isResult; t++) {
                var thisItem = this.items[t];
                var fnResult = eval("value(t, thisItem)");
                if (typeof fnResult === "boolean") {
                    isResult = fnResult
                }
            }
            return isResult
        } else {
            var isResult = false;
            var elements = jendo(value).items;
            for (var t = 0; t < this.items.length && !isResult; t++) {
                var thisItem = this.items[t];
                for (var e = 0; e < elements.length && !isResult; e++) {
                    isResult = thisItem.isEqualNode(elements[e])
                }
            }
            return isResult
        }
    }
};
JendoSelector.prototype.append = function(value) {
    var childNodes = [];
    var valueType = typeof value;
    if (valueType == "undefined") {} else if (valueType == "string") {
        for (var i = 0; i < this.items.length; i++) {
            var tItem = this.items[i];
            var cnIndex = tItem.childNodes.length;
            tItem.insertAdjacentHTML("beforeend", value);
            for (; cnIndex < tItem.childNodes.length; cnIndex++) {
                childNodes.push(tItem.childNodes[cnIndex])
            }
        }
    } else if (valueType == "object") {
        function appendChild(nItems, nValue) {
            if (nItems != null && nValue != null) {
                for (var i = 0; i < nItems.length; i++) {
                    if (i == 0) {
                        childNodes.push(nValue);
                        nItems[i].appendChild(nValue)
                    } else {
                        var nValueClone = nValue.cloneNode(true);
                        childNodes.push(nValueClone);
                        nItems[i].appendChild(nValueClone)
                    }
                }
            }
        }

        function insertChild(nItems, nValue, nLastChildNodes) {
            if (nItems != null && nValue != null) {
                for (var i = 0; i < nItems.length; i++) {
                    var lastChildNode = nLastChildNodes[i];
                    if (i == 0) {
                        childNodes.push(nValue);
                        nItems[i].insertBefore(nValue, lastChildNode);
                        nLastChildNodes[i] = nValue
                    } else {
                        var nValueClone = nValue.cloneNode(true);
                        childNodes.push(nValueClone);
                        nItems[i].insertBefore(nValueClone, lastChildNode);
                        nLastChildNodes[i] = nValueClone
                    }
                }
            }
        }
        var valueConstructor = jendo.constructorName(value);
        if (valueConstructor == "HTMLCollection" || valueConstructor == "NodeList") {
            for (var iValue = 0; iValue < value.length; iValue++) {
                appendChild(this.items, value[iValue])
            }
        } else if (valueConstructor == "JendoSelector") {
            var lastChildNodes = [];
            for (var iValue = value.items.length - 1; iValue >= 0; iValue--) {
                var vItem = value.items[iValue];
                var vItemConstructor = jendo.constructorName(vItem);
                if (vItemConstructor == "HTMLCollection" || vItemConstructor == "NodeList") {
                    for (var iItem = vItem.length - 1; iItem >= 0; iItem--) {
                        insertChild(this.items, vItem[iItem], lastChildNodes)
                    }
                } else {
                    insertChild(this.items, value.items[iValue], lastChildNodes)
                }
            }
        } else if (valueConstructor == "HTMLDocument") {
            var nodes = value.body.childNodes;
            for (var iValue = 0; iValue < nodes.length; iValue++) {
                appendChild(this.items, nodes[iValue])
            }
        } else {
            appendChild(this.items, value)
        }
    } else {}
    return jendo(childNodes)
};
JendoSelector.prototype.appendElement = function(tagName) {
    if (jendo.isNullOrWhiteSpace(tagName)) {
        return jendo([])
    } else {
        return this.append(document.createElement(tagName))
    }
};
JendoSelector.prototype.appendElementDiv = function() {
    return this.append(document.createElement("div"))
};
JendoSelector.prototype.appendElementP = function() {
    return this.append(document.createElement("p"))
};
JendoSelector.prototype.appendElementSamp = function() {
    return this.append(document.createElement("samp"))
};
JendoSelector.prototype.appendElementSpan = function(text) {
    var elm = this.append(document.createElement("span"));
    if (!jendo.isNullOrEmpty(text)) {
        elm.text(text)
    }
    return elm
};
JendoSelector.prototype.appendElementA = function(href, text) {
    var elm = this.append(document.createElement("a")).attr("href", href);
    if (!jendo.isNullOrEmpty(text)) {
        elm.text(text)
    }
    return elm
};
JendoSelector.prototype.appendElementButton = function(text) {
    var elm = this.append(document.createElement("button")).attr("type", "button");
    if (!jendo.isNullOrEmpty(text)) {
        elm.text(text)
    }
    return elm
};
JendoSelector.prototype.appendElementText = function() {
    return this.append(document.createElement("input")).attr("type", "text")
};
JendoSelector.prototype.appendElementImg = function(src) {
    return this.append(document.createElement("img")).attr("src", src)
};
JendoSelector.prototype.appendElementUL = function() {
    return this.append(document.createElement("ul"))
};
JendoSelector.prototype.appendElementLI = function() {
    return this.append(document.createElement("li"))
};
JendoSelector.prototype.appendElementTable = function() {
    return this.append(document.createElement("table"))
};
JendoSelector.prototype.appendElementTHead = function() {
    return this.append(document.createElement("thead"))
};
JendoSelector.prototype.appendElementTBody = function() {
    return this.append(document.createElement("tbody"))
};
JendoSelector.prototype.appendElementTR = JendoSelector.prototype.appendElementTRow = function() {
    return this.append(document.createElement("tr"))
};
JendoSelector.prototype.appendElementTH = function() {
    return this.append(document.createElement("th"))
};
JendoSelector.prototype.appendElementTD = function() {
    return this.append(document.createElement("td"))
};
JendoSelector.prototype.insert = function(newNode, referenceNode) {
    if (jendo.isNull(newNode)) {} else if (jendo.isNull(referenceNode)) {
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            item.insertBefore(newNode, item.childNodes[0])
        }
    } else {
        var refElement = this.find(referenceNode).first();
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            item.insertBefore(newNode, refElement)
        }
    }
    return this
};
JendoSelector.prototype.insertElement = function(tagName, referenceNode) {
    if (jendo.isNullOrWhiteSpace(tagName)) {
        return null
    } else {
        var element = document.createElement(tagName);
        this.insert(element, referenceNode);
        return jendo(element)
    }
};
JendoSelector.prototype.insertElementDiv = function() {
    return this.insertElement("div")
};
JendoSelector.prototype.insertElementP = function() {
    return this.insertElement("p")
};
JendoSelector.prototype.insertElementSamp = function() {
    return this.insertElement("samp")
};
JendoSelector.prototype.insertAfter = function(newNode, referenceNode) {
    if (jendo.isNull(newNode)) {} else if (jendo.isNull(referenceNode)) {
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            item.appendChild(newNode)
        }
    } else {
        var valueConstructor = jendo.constructorName(referenceNode);
        var refElement;
        if (valueConstructor == "JendoSelector") {
            refElement = referenceNode.first().nextSibling
        } else {
            refElement = this.find(referenceNode).first().nextSibling
        }
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            item.insertBefore(newNode, refElement)
        }
    }
    return this
};
JendoSelector.prototype.load = function(url, callback) {
    if (this.items.length > 0) {
        var elements = this.items;
        jendo.get(url).done(function(responseText) {
            var doc = jendo.parseHTML(responseText);
            if (doc != null) {
                var docNodes = doc.body.childNodes;
                var loadWaiting = 0;
                for (var i = 0; i < elements.length; i++) {
                    loadWaiting += 1;
                    jendo.loadDOM(docNodes, elements[i], true, function() {
                        loadWaiting -= 1;
                        if (loadWaiting == 0 && !jendo.isNull(callback)) {
                            callback()
                        }
                    })
                }
            } else {
                if (!jendo.isNull(callback)) {
                    callback()
                }
            }
        }).send()
    }
    return this
};
JendoSelector.prototype.remove = function(value) {
    if (jendo.isNull(value)) {
        for (var i = this.items.length - 1; i >= 0; i--) {
            this.items[i].remove()
        }
        this.items.pop();
        this.length = this.items.length;
        return this
    } else {
        for (var i = this.items.length - 1; i >= 0; i--) {
            var rItem = this.items[i];
            if (jendo(rItem).is(value)) {
                rItem.remove();
                this.items.splice(i, 1)
            }
            this.length = this.items.length
        }
        return this
    }
};
JendoSelector.prototype.removeChild = function(value) {
    if (jendo.isNull(value)) {
        return this
    } else {
        var jdNode = jendo(value);
        this.forEach(function(i, item) {
            jdNode.forEach(function(n, nItem) {
                item.removeChild(nItem)
            })
        });
        return this
    }
};
JendoSelector.prototype.empty = function() {
    this.forEach(function(i, item) {
        while (item.firstChild) {
            item.removeChild(item.firstChild)
        }
    })
};
JendoSelector.prototype.css = JendoSelector.prototype.style = function(property, value) {
    if (jendo.isNull(property)) {
        return this
    } else if (jendo.isNull(value)) {
        var prType = typeof property;
        if (prType == "string") {
            if (property.indexOf(":") == -1) {
                var thisItem = this.first();
                var styleItem = thisItem.ownerDocument.defaultView ? thisItem.ownerDocument.defaultView.getComputedStyle(thisItem, null) : thisItem.currentStyle;
                return thisItem.style[property]
            } else {
                var propList = property.split(";");
                for (var i = 0; i < propList.length; i++) {
                    var propVal = propList[i].split(":");
                    if (propVal.length == 2) {
                        this.css(propVal[0], propVal[1])
                    }
                }
                return this
            }
        } else if (prType == "object") {
            if (Array.isArray(property)) {
                var thisItem = this.first();
                var styleItem = thisItem.ownerDocument.defaultView ? thisItem.ownerDocument.defaultView.getComputedStyle(thisItem, null) : thisItem.currentStyle;
                var props = {};
                for (var i = 0; i < property.length; i++) {
                    var prName = property[i];
                    props[prName] = styleItem[prName]
                }
                return props
            } else {
                for (x in property) {
                    this.css(x, property[x])
                }
                return this
            }
        } else {
            return this
        }
    } else {
        var vlType = typeof value;
        if (vlType == "string") {
            this.forEach(function(i, item) {
                item.style[property] = value
            });
            return this
        } else if (vlType == "function") {
            this.forEach(function(i, item) {
                var styleItem = item.ownerDocument.defaultView ? item.ownerDocument.defaultView.getComputedStyle(item, null) : item.currentStyle;
                var itemValue = styleItem[property];
                var fnValue = eval("value(i, itemValue)");
                item.style[property] = fnValue
            });
            return this
        } else {
            return this
        }
    }
};
JendoSelector.prototype.hide = function() {
    this.style("display", "none");
    return this
};
JendoSelector.prototype.show = function() {
    this.style("display", "block");
    return this
};
JendoSelector.prototype.first = function() {
    if (this.items.length > 0) {
        return this.items[0]
    } else {
        return null
    }
};
JendoSelector.prototype.last = function() {
    if (this.items.length > 0) {
        return this.items[this.items.length - 1]
    } else {
        return null
    }
};
JendoSelector.prototype.children = function() {
    var childNodes = [];
    this.forEach(function(i, item) {
        var icNodes = item.childNodes;
        for (var i = 0; i < icNodes.length; i++) {
            childNodes.push(icNodes[i])
        }
    });
    return jendo(childNodes)
};
JendoSelector.prototype.lastChild = function() {
    var childNodes = [];
    this.forEach(function(i, item) {
        var icNodes = item.childNodes;
        if (icNodes.length > 0) {
            childNodes.push(icNodes[icNodes.length - 1])
        }
    });
    return jendo(childNodes)
};
JendoSelector.prototype.top = function(value) {
    if (jendo.isNull(value)) {
        var element = this.first();
        if (element != null) {
            return element.offsetTop
        } else {
            return 0
        }
    } else {
        var element = this.first();
        if (element != null) {
            return element.style.top = value + "px"
        }
        return this
    }
};
JendoSelector.prototype.bottom = function(value) {
    if (jendo.isNull(value)) {
        var element = this.first();
        if (element != null) {
            return element.offsetTop
        } else {
            return 0
        }
    } else {
        var element = this.first();
        if (element != null) {
            return element.style.bottom = value + "px"
        }
        return this
    }
};
JendoSelector.prototype.left = function(value) {
    if (jendo.isNull(value)) {
        var element = this.first();
        if (element != null) {
            return element.offsetLeft
        } else {
            return 0
        }
    } else {
        var element = this.first();
        if (element != null) {
            return element.style.left = value + "px"
        }
        return this
    }
};
JendoSelector.prototype.right = function(value) {
    if (jendo.isNull(value)) {
        var element = this.first();
        if (element != null) {
            return element.offsetLeft
        } else {
            return 0
        }
    } else {
        var element = this.first();
        if (element != null) {
            return element.style.right = value + "px"
        }
        return this
    }
};
JendoSelector.prototype.position = function(value) {
    if (jendo.isNull(value)) {
        var element = this.first();
        if (!jendo.isNull(element)) {
            return {
                top: element.offsetTop,
                left: element.offsetLeft
            }
        } else {
            return {
                top: 0,
                left: 0
            }
        }
    } else {
        var element = this.first();
        if (!jendo.isNull(element) && "style" in element) {
            if (!jendo.isNull(value.top)) {
                element.style.top = value.top + "px"
            }
            if (!jendo.isNull(value.left)) {
                element.style.left = value.left + "px"
            }
        }
        return this
    }
};
JendoSelector.prototype.width = function(value) {
    if (jendo.isNull(value)) {
        var element = this.first();
        if (element != null) {
            var constructorName = element.constructor.name;
            if (constructorName == "HTMLDocument") {
                return element.body.clientWidth
            } else {
                return element.clientWidth
            }
        } else {
            return 0
        }
    } else {
        if (value == 0) {} else if (typeof value == "number") {
            this.attr("width", value + "px")
        } else {
            this.attr("width", value)
        }
        return this
    }
};
JendoSelector.prototype.height = function(value) {
    if (jendo.isNull(value)) {
        var element = this.first();
        if (element != null) {
            return element.clientHeight
        } else {
            return 0
        }
    } else {
        if (value == 0) {} else if (typeof value == "number") {
            this.attr("height", value + "px")
        } else {
            this.attr("height", value)
        }
        return this
    }
};
JendoSelector.prototype.each = JendoSelector.prototype.forEach = function(callback) {
    if (callback) {
        for (var i = 0; i < this.items.length; i++) {
            callback(i, this.items[i])
        }
    }
};
JendoSelector.prototype.dispatchEvent = function(type, detail) {
    var evt = new CustomEvent(type, {
        detail: detail,
        bubbles: true,
        cancelable: true
    });
    for (var i = 0; i < this.items.length; i++) {
        this.items[i].dispatchEvent(evt)
    }
    return this
};
JendoSelector.prototype.on = JendoSelector.prototype.addEventListener = function(type, listener, data) {
    if (jendo.isNull(data)) {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].addEventListener(type, listener, false)
        }
    } else {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].addEventListener(type, function(e) {
                e.data = data;
                listener(e)
            }, false)
        }
    }
    return this
};
JendoSelector.prototype.keyDown = function(listener, data) {
    return this.addEventListener("keydown", listener, data)
};
JendoSelector.prototype.keyPress = function(listener, data) {
    return this.addEventListener("keypress", listener, data)
};
JendoSelector.prototype.keyUp = function(listener, data) {
    return this.addEventListener("keyup", listener, data)
};
JendoSelector.prototype.mouseEnter = function(listener, data) {
    return this.addEventListener("mouseenter", listener, data)
};
JendoSelector.prototype.mouseOver = function(listener, data) {
    return this.addEventListener("mouseover", listener, data)
};
JendoSelector.prototype.mouseMove = function(listener, data) {
    return this.addEventListener("mousemove", listener, data)
};
JendoSelector.prototype.mouseDown = function(listener, data) {
    return this.addEventListener("mousedown", listener, data)
};
JendoSelector.prototype.mouseUp = function(listener, data) {
    return this.addEventListener("mouseup", listener, data)
};
JendoSelector.prototype.click = function(listener, data) {
    return this.addEventListener("click", listener, data)
};
JendoSelector.prototype.dblClick = function(listener, data) {
    return this.addEventListener("dblclick", listener, data)
};
JendoSelector.prototype.contextMenu = function(listener, data) {
    return this.addEventListener("contextmenu", listener, data)
};
JendoSelector.prototype.wheel = function(listener, data) {
    return this.addEventListener("wheel", listener, data)
};
JendoSelector.prototype.mouseLeave = function(listener, data) {
    return this.addEventListener("mouseleave", listener, data)
};
JendoSelector.prototype.mouseOut = function(listener, data) {
    return this.addEventListener("mouseout", listener, data)
};
JendoSelector.prototype.select = function(listener, data) {
    return this.addEventListener("select", listener, data)
};
JendoSelector.prototype.pointerLockChange = function(listener, data) {
    return this.addEventListener("pointerlockchange", listener, data)
};
JendoSelector.prototype.pointerLockError = function(listener, data) {
    return this.addEventListener("pointerlockerror", listener, data)
};
JendoSelector.prototype.focus = function(listener, data) {
    if (jendo.isNullOrEmpty(listener)) {
        this.forEach(function(i, item) {
            item.focus()
        });
        return this
    } else {
        return this.addEventListener("focus", listener, data)
    }
};
JendoSelector.prototype.blur = function(listener, data) {
    if (jendo.isNullOrEmpty(listener)) {
        this.forEach(function(i, item) {
            item.blur()
        });
        return this
    } else {
        return this.addEventListener("blur", listener, data)
    }
};
JendoSelector.prototype.onClick = function(handler) {
    for (var i = 0; i < this.items.length; i++) {
        this.items[i].onclick = handler
    }
    return this
};
JendoSelector.prototype.onMouseDown = function(handler) {
    for (var i = 0; i < this.items.length; i++) {
        this.items[i].onmousedown = handler
    }
    return this
};
JendoSelector.prototype.onMouseUp = function(handler) {
    for (var i = 0; i < this.items.length; i++) {
        this.items[i].onmouseup = handler
    }
    return this
};
JendoSelector.prototype.onMouseMove = function(handler) {
    for (var i = 0; i < this.items.length; i++) {
        this.items[i].onmousemove = handler
    }
    return this
};

function JendoHttpRequest(method, url) {
    this._contentType = "text/xml";
    if ("XMLHttpRequest" in window) {
        if ("ActiveXObject" in window && jendo.isFileProtocol()) {
            try {
                this._request = new window.ActiveXObject("MSXML2.XMLHTTP")
            } catch (ex) {
                try {
                    this._request = new window.ActiveXObject("Microsoft.XMLHTTP")
                } catch (ex) {}
            }
        } else {
            this._request = new XMLHttpRequest;
            this._request.responseType = "text"
        }
    } else if ("ActiveXObject" in window) {
        try {
            this._request = new window.ActiveXObject("MSXML2.XMLHTTP")
        } catch (ex) {
            try {
                this._request = new window.ActiveXObject("Microsoft.XMLHTTP")
            } catch (ex) {}
        }
    }
    this._method = method;
    this._url = jendo.validateUrl(url);
    this._async = true;
    var jndreq = this;
    var xmlhttp = this._request;
    xmlhttp.onreadystatechange = function() {
        switch (xmlhttp.readyState) {
            case 0:
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                if (xmlhttp._onProcessing) {
                    jndreq._onProcessing(xmlhttp.responseText)
                }
                break;
            case 4:
                if (xmlhttp.status == 0 || xmlhttp.status == 200) {
                    if (jndreq._onDone) {
                        jndreq._onDone(xmlhttp.responseText)
                    }
                } else {
                    console.log(xmlhttp)
                }
                break;
            default:
                break
        }
    }
}
JendoHttpRequest.prototype.contentType = function(value) {
    if (jendo.isNull(value)) {
        return this._contentType
    } else {
        this._contentType = value
    }
};
JendoHttpRequest.prototype.done = function(handler) {
    this._onDone = handler;
    return this
};
JendoHttpRequest.prototype.processing = function(handler) {
    this._onProcessing = handler;
    return this
};
JendoHttpRequest.prototype.send = function(data) {
    if (data === undefined) {
        data = null
    }
    this._request.open(this._method, this._url, this._async);
    this._request.setRequestHeader("Content-Type", this._contentType);
    this._request.send(data)
};
JendoHttpRequest.prototype.sendJson = function(data) {
    this.contentType("application/json");
    this.send(JSON.stringify(data))
};

function JendoJSONPRequest(url) {
    this._url = url
}
JendoJSONPRequest.prototype.done = function(doneFunction) {
    this._onDone = doneFunction;
    return this
};
JendoJSONPRequest.prototype.fail = function(failFunction) {
    this._onFail = failFunction;
    return this
};
JendoJSONPRequest.prototype.always = function(alwaysFunction) {
    this._onAlways = alwaysFunction;
    return this
};
JendoJSONPRequest.prototype.send = function(data) {
    var callbackFun = "callback" + jendo.guid("");
    var on_done = this._onDone;
    var on_always = this._onAlways;
    var on_fail = this._onFail;
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    if (this._url.indexOf("?") > -1) {
        script.src = this._url + "&callback=" + callbackFun
    } else {
        script.src = this._url + "?callback=" + callbackFun
    }
    script.onerror = function(dataRs) {
        if (on_fail) {
            on_fail(dataRs, dataRs.type)
        }
        if (on_always) {
            on_always(dataRs, dataRs.type)
        }
    };
    window[callbackFun] = function(dataRs) {
        if (on_done) {
            on_done(dataRs, "success")
        }
        if (on_always) {
            on_always(dataRs, "success")
        }
    };
    var head = document.getElementsByTagName("head");
    if (head[0] !== null) {
        head[0].appendChild(script)
    }
};

function JendoLanguage() {}
JendoLanguage.prototype.load = function(value) {
    if (typeof value == "object") {
        for (x in value) {
            this[x] = value[x]
        }
    }
};
jendo.lang = new JendoLanguage;

function JendoCookies() {}
JendoCookies.prototype.set = function setCookie(cname, cvalue, exdays) {
    var d = new Date;
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1e3);
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
};
JendoCookies.prototype.get = function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ""
};
jendo.cookies = new JendoCookies;

function JendoGeolocation(options) {
    this.MSG_NOT_SUPPORTED = "Geolocation is not supported by this browser.";
    this.glOptions = {
        enableHighAccuracy: false,
        timeout: 5e3,
        maximumAge: 0
    };
    if (!jendo.isNull(options)) {
        if ("enableHighAccuracy" in options) {
            this.glOptions.enableHighAccuracy = options.enableHighAccuracy
        }
        if ("timeout" in options) {
            this.glOptions.timeout = options.timeout
        }
        if ("maximumAge" in options) {
            this.glOptions.maximumAge = options.maximumAge
        }
    }
}
JendoGeolocation.prototype.enableHighAccuracy = function(value) {
    if (jendo.isNull(value)) {
        return this.glOptions.enableHighAccuracy
    } else {
        this.glOptions.enableHighAccuracy = value
    }
};
JendoGeolocation.prototype.timeout = function(value) {
    if (jendo.isNull(value)) {
        return this.glOptions.timeout
    } else {
        this.glOptions.timeout = value
    }
};
JendoGeolocation.prototype.maximumAge = function(value) {
    if (jendo.isNull(value)) {
        return this.glOptions.maximumAge
    } else {
        this.glOptions.maximumAge = value
    }
};
JendoGeolocation.prototype.get = function(successCallback, errorCallback, options) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, jendo.isNull(options) ? this.glOptions : options)
    } else {
        console.log(this.MSG_NOT_SUPPORTED)
    }
};
JendoGeolocation.prototype.watch = function(successCallback, errorCallback, options) {
    if (navigator.geolocation) {
        return navigator.geolocation.watchPosition(successCallback, errorCallback, jendo.isNull(options) ? this.glOptions : options)
    } else {
        console.log(this.MSG_NOT_SUPPORTED)
    }
};
JendoGeolocation.prototype.clear = function(id) {
    if (navigator.geolocation) {
        return navigator.geolocation.clearWatch(id)
    } else {
        console.log(this.MSG_NOT_SUPPORTED)
    }
};

function JendoNavigator() {}
JendoNavigator.prototype.getUserMedia = function(constraints, successCallback, errorCallback) {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints).then(successCallback).catch(errorCallback)
    } else if (navigator.getUserMedia) {
        navigator.getUserMedia(constraints, successCallback, errorCallback)
    } else if (navigator.webkitGetUserMedia) {
        navigator.webkitGetUserMedia(constraints, successCallback, errorCallback)
    } else if (navigator.mozGetUserMedia) {
        navigator.mozGetUserMedia(constraints, successCallback, errorCallback)
    } else if (navigator.msGetUserMedia) {
        navigator.msGetUserMedia(constraints, successCallback, errorCallback)
    } else {
        var error = "Native web camera streaming (getUserMedia) not supported in this browser.";
        if (!jendo.isNull(errorCallback)) {
            qrcodeErrorEvent(error)
        } else {
            console.log(error)
        }
    }
};
jendo.navigator = new JendoNavigator;
if (jendo.isNull(jendo.rootUrl)) {
    jendo.rootUrl = ""
}
if (jendo.isNull(jendo.pageLinkType)) {
    jendo.pageLinkType = 0
}
var _ = jendo;

function _jendoSortMultiple() {
    var props = _jendoSortArguments(arguments);
    return function(obj1, obj2) {
        var i = 0,
            result = 0,
            numberOfProperties = props.length;
        while (result === 0 && i < numberOfProperties) {
            var prop = props[i];
            result = _jendoSort(prop.field, prop.sort)(obj1, obj2);
            i++
        }
        return result
    }
}

function _jendoReverseMultiple() {
    var props = _jendoSortArguments(arguments);
    return function(obj1, obj2) {
        var i = 0,
            result = 0,
            numberOfProperties = props.length;
        while (result === 0 && i < numberOfProperties) {
            var prop = props[i];
            result = _jendoSort(prop.field, prop.sort)(obj1, obj2) * -1;
            i++
        }
        return result
    }
}

function _jendoSort(property, sortOrder) {
    return function(a, b) {
        var ap = a[property];
        if (typeof ap == "string") {
            ap = ap.toLowerCase()
        }
        var bp = b[property];
        if (typeof bp == "string") {
            bp = bp.toLowerCase()
        }
        var result = ap < bp ? -1 : ap > bp ? 1 : 0;
        return result * sortOrder
    }
}

function _jendoSortArguments(args) {
    var props = [];
    for (arg in args) {
        var propValue = args[arg];
        var propType = typeof propValue;
        if (propType == "string") {
            var sortOrder = 1;
            if (propValue[0] === "-") {
                sortOrder = -1;
                propValue = propValue.substr(1, propValue.length - 1)
            }
            props.push({
                field: propValue,
                sort: sortOrder
            })
        } else if (propType == "object" && Array.isArray(propValue)) {
            for (var ic = 0; ic < propValue.length; ic++) {
                props.push(propValue[ic])
            }
        }
    }
    return props
}
Array.prototype.sortBy = function() {
    return this.sort(_jendoSortMultiple.apply(null, arguments))
};
Array.prototype.reverseBy = function() {
    return this.sort(_jendoReverseMultiple.apply(null, arguments))
};
Array.prototype.filterBy = function(value) {
    if (Array.isArray(value)) {
        return this.filter(function(item, i, arr) {
            for (var f = 0; f < value.length; f++) {
                var vField = value[f].field;
                var vFilter = value[f].filter.toLowerCase();
                if (typeof item == "object") {
                    var iValue = item[vField].toLowerCase();
                    var iType = typeof iValue;
                    if (iType == "undefined") {
                        return false
                    } else if (iType == "string") {
                        if (iValue.indexOf(vFilter) == -1) {
                            return false
                        }
                    } else {
                        if (iValue != vFilter) {
                            return false
                        }
                    }
                }
            }
            return true
        })
    } else {
        return this.filter(value)
    }
};
window.onload = function() {
    if (typeof jendo.readyFunctions != "undefined") {
        if (typeof jendo.readyFunctionIndex == "undefined") {
            jendo.readyFunctionIndex = 0
        }
        while (jendo.readyFunctionIndex < jendo.readyFunctions.length) {
            var readyFunction = jendo.readyFunctions[jendo.readyFunctionIndex];
            jendo.readyFunctionIndex += 1;
            readyFunction()
        }
    }
};