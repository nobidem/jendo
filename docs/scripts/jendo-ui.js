/*!
 * Jendo UI v1.1.1
 * https://nobidem.github.io/jendo/
 *
 * Copyright Nobidem
 * Released under the MIT license
 * https://nobidem.github.io/jendo/license
 */
jendo.dateFormatUI = function(date, pattern) {
    if (jendo.constructorName(date).toLowerCase() == "date") {
        var nMM = date.getMonth();
        var wk = date.getDay();
        return jendo.dateFormat(date, pattern.replace(/MMMM/g, "p1").replace(/MMM/g, "p2").replace(/dddd/g, "p3").replace(/ddd/g, "p4")).replace(/p1/g, jendo.lang.monthNames[nMM]).replace(/p2/g, jendo.lang.monthShortNames[nMM]).replace(/p3/g, jendo.lang.weekdayNames[wk]).replace(/p4/g, jendo.lang.weekdayShortNames[wk])
    } else {
        return ""
    }
};
jendo.includeStyle("/content/font-awesome/css/font-awesome.min.css");
jendo.lang.load({
    weekdayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    weekdayShortNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    weekdayNarrowNames: ["S", "M", "T", "W", "T", "F", "S"],
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthShortNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});
var _JendoLastOpenElement = null;
var _JendoFuncCloseElement = null;
document.addEventListener("click", function(e) {
    if (_JendoFuncCloseElement != null && _JendoLastOpenElement != null) {
        _JendoFuncCloseElement(e.target)
    }
}, true);

function JendoSection(elements) {
    this.sectionElements = elements
}
JendoSection.prototype.append = function(jsonData) {
    if (!jendo.isNull(this.sectionElements) && !jendo.isNull(jsonData)) {
        var section = document.createElement("div");
        section.className = "jd-section jd-section-info";
        var header = document.createElement("div");
        header.className = "jd-header";
        section.appendChild(header);
        var headerH3 = document.createElement("h3");
        header.appendChild(headerH3);
        var headerA = document.createElement("A");
        headerA.href = jsonData.link;
        headerA.appendChild(document.createTextNode(jsonData.title));
        headerH3.appendChild(headerA);
        var summary = document.createElement("div");
        summary.className = "jd-summary";
        summary.appendChild(document.createTextNode(jsonData.text));
        section.appendChild(summary);
        this.sectionElements.append(section)
    }
};
JendoSection.prototype.load = function(jsonData) {
    if (!jendo.isNull(this.sectionElements) && !jendo.isNull(jsonData)) {
        for (var i = 0; i < jsonData.length; i++) {
            this.append(jsonData[i])
        }
    }
};
jendo.section = function(element) {
    if (jendo.isNull(element)) {
        return new JendoSection(null)
    } else {
        var targetElement = jendo(element);
        if (targetElement.length > 0) {
            return new JendoSection(targetElement)
        } else {
            return new JendoSection(null)
        }
    }
};

function JendoNavBar(elements) {
    this.sectionElements = elements
}
JendoNavBar.prototype.append = function(jsonData) {
    if (!jendo.isNull(this.sectionElements) && !jendo.isNull(jsonData)) {
        var menuItem = this.sectionElements.appendLI();
        if ("items" in jsonData) {
            menuItem.class("dropdown");
            var userItem = null;
            if ("link" in jsonData) {
                userItem = menuItem.appendA(jsonData.link, jsonData.text)
            } else {
                userItem = menuItem.appendButton(jsonData.text)
            }
            var thisNB = this;
            userItem.attr("role", "button").click(function(source) {
                var itemClk = jendo(source.target);
                var liElement = itemClk.parent();
                var canOpened = true;
                if (_JendoLastOpenElement != null) {
                    if (_JendoLastOpenElement.is(liElement)) {
                        canOpened = false;
                        _JendoLastOpenElement = null
                    }
                }
                if (canOpened) {
                    _JendoFuncCloseElement = thisNB.closeElement;
                    _JendoLastOpenElement = liElement;
                    liElement.addClass("open")
                }
            });
            new JendoNavBar(menuItem.appendUL().class("dropdown-menu")).load(jsonData.items)
        } else {
            if (!jendo.isNullOrWhiteSpace(jsonData.link)) {
                menuItem.appendA(jsonData.link, jsonData.text)
            } else {
                var userItem = menuItem.appendButton(jsonData.text);
                userItem.click(function() {
                    document.dispatchEvent(new CustomEvent("navbar.navigate", {
                        detail: jsonData.args
                    }))
                })
            }
        }
    }
};
JendoNavBar.prototype.closeElement = function(source) {
    var parentSource = source.parentElement;
    if (_JendoLastOpenElement.is(parentSource)) {
        _JendoLastOpenElement.removeClass("open");
        _JendoFuncCloseElement = null
    } else if (!_JendoLastOpenElement.isContains(source.parentElement)) {
        _JendoLastOpenElement.removeClass("open");
        _JendoFuncCloseElement = null;
        _JendoLastOpenElement = null
    }
};
JendoNavBar.prototype.load = function(jsonData) {
    if (!jendo.isNull(this.sectionElements) && !jendo.isNull(jsonData)) {
        for (var i = 0; i < jsonData.length; i++) {
            this.append(jsonData[i])
        }
    }
};
JendoNavBar.prototype.navigate = function(func) {
    document.addEventListener("navbar.navigate", func, false);
    return this
};
jendo.navbar = function(element) {
    jendo._IsInitNavbar = true;
    if (jendo.isNull(element)) {
        return new JendoNavBar(null)
    } else {
        var jdElement = jendo(element);
        if (jdElement.length > 0) {
            return new JendoNavBar(jdElement.appendUL())
        } else {
            return new JendoNavBar(null)
        }
    }
};

function JendoDialog(element) {
    this.jDialog = jendo(element);
    if (this.jDialog.length == 0) {
        return
    }
    if (jendo.isNullOrEmpty(this.jDialog.attr("role"))) {
        this.jDialog.attr("role", "dialog")
    }
    if (jendo.isNullOrEmpty(this.jDialog.attr("class"))) {
        this.jDialog.attr("class", "jd-dialog")
    }
    this.dialogTitle = "Jendo Dialog";
    this.withTitlebar = true;
    this.withCloseBtnLeft = false;
    this.withCloseBtnRight = true;
    this.isModalForm = false
}
JendoDialog.moveElement = null;
JendoDialog.moveTop = 0;
JendoDialog.moveLeft = 0;
JendoDialog.showPositionTop = 50;
JendoDialog.prototype.load = function(url, callback) {
    var dialog = this.jDialog;
    jendo.get(url).done(function(responseText) {
        dialog.loadHTML(responseText);
        if (callback) {
            callback()
        }
    }).send()
};
JendoDialog.prototype.show = function(args) {
    if (this.jDialog.length == 0) {
        return
    }
    this.jDialog.dispatchJEvent("jendo.dialog.show", args);
    if (jendo.isNull(args)) {
        args = {}
    } else {
        if (!jendo.isNull(args.style)) {
            this.jDialog.class("jd-dialog");
            this.jDialog.addClass(args.style)
        }
    }
    if (this.isModalForm) {
        this.jDialog.addClass("jd-dialog-modal")
    }
    var jdDocument = this.jDialog.find('[role="document"]');
    if (jdDocument.length == 0) {
        jdDocument = jendo.createDiv().class("jd-dialog-document").attr("role", "document").attr("tabindex", 0);
        jdDocument.append(this.jDialog.children());
        jdDocument.addClass(this.jDialog.data("class"));
        this.jDialog.append(jdDocument);
        this.jDialog.keyPress(function(e) {
            if (e.keyCode == 27) {
                jendo.dialog(this).hide()
            }
        })
    }
    var jdContent = jdDocument.find('[data-dialog="content"]');
    if (jdContent.length == 0) {
        jdContent = jdDocument.find(".jd-dialog-content");
        if (jdContent.length == 0) {
            jdContent = jendo.createDiv().class("jd-dialog-content").attr("data-dialog", "content");
            jdContent.append(jdDocument.children());
            jdDocument.append(jdContent)
        } else {
            jdContent.attr("data-dialog", "content")
        }
    }
    if (this.withTitlebar) {
        var jdTitlebar = jdDocument.find('[data-dialog="titlebar"]');
        if (jdTitlebar.length == 0) {
            jdTitlebar = jdDocument.find(".jd-dialog-titlebar");
            if (jdTitlebar.length == 0) {
                jdTitlebar = jdDocument.insertDiv().class("jd-dialog-titlebar").attr("data-dialog", "titlebar");
                if (this.withCloseBtnLeft) {
                    jdTitlebar.appendElement().class("jd-dt-button jd-dt-button-left").appendButton().attr("data-dialog", "close").appendI().class("fa fa-chevron-left").attr("aria-hidden", "true")
                }
                jdTitlebar.appendDiv().class("jd-dt-title").text(jendo.isNullOrWhiteSpace(args.title) ? this.dialogTitle : args.title);
                if (this.withCloseBtnRight) {
                    jdTitlebar.appendDiv().class("jd-dt-button jd-dt-button-right").appendButton().attr("data-dialog", "close").class("jd-btn").appendI().class("fa fa-times").attr("aria-hidden", "true")
                }
            } else {
                jdTitlebar.attr("data-dialog", "titlebar")
            }
        } else {
            if (jendo.isNullOrEmpty(jdDocument.attr("class"))) {
                jdDocument.attr("class", "jd-dialog-titlebar")
            }
            if (!jendo.isNullOrWhiteSpace(args.title)) {
                jdTitlebar.find(".jd-dt-title").text(args.title)
            }
        }
        var htmlDocument = jendo(document);
        jdTitlebar.mouseDown(function(e) {
            var targetEl = jendo(e.target);
            if (targetEl.attr("data-dialog") != "close") {
                var docEl = JendoDialog.findDocument(e.target);
                if (!jendo.isNull(docEl)) {
                    JendoDialog.moveElement = jendo(docEl);
                    JendoDialog.moveTop = e.offsetY + e.target.offsetTop;
                    JendoDialog.moveLeft = e.offsetX + e.target.offsetLeft
                }
            }
        });
        htmlDocument.mouseUp(function(e) {
            JendoDialog.moveElement = null;
            JendoDialog.moveTop = 0;
            JendoDialog.moveLeft = 0
        });
        htmlDocument.mouseMove(function(e) {
            if (JendoDialog.moveElement != null) {
                var pos = {
                    top: 0,
                    left: 0
                };
                pos.top = e.clientY - JendoDialog.moveTop;
                if (pos.top < 0) {
                    pos.top = 0
                }
                pos.left = e.clientX - JendoDialog.moveLeft;
                if (pos.left < 0) {
                    pos.left = 0
                }
                JendoDialog.moveElement.position(pos);
                JendoDialog.moveElement.prop("position", pos)
            }
        })
    }
    jdDocument.find('[data-dialog="close"]').click(function(e) {
        JendoDialog.findDialog(e.target).hide()
    });
    this.jDialog.show();
    var pos = jdDocument.prop("position");
    if (jendo.isNull(pos)) {
        if (jendo.screenWidth() == jdDocument.offsetWidth()) {
            pos = {
                top: 0,
                left: 0
            }
        } else {
            pos = {
                top: jdDocument.height() < jendo.windowHeight() ? JendoDialog.showPositionTop : 0,
                left: jendo.windowWidth() / 2 - jdDocument.width() / 2
            };
            JendoDialog.showPositionTop += 30;
            jdDocument.prop("position", pos)
        }
    }
    jdDocument.position(pos);
    jdDocument.focus();
    this.jDialog.dispatchJEvent("jendo.dialog.shown", args)
};
JendoDialog.prototype.showModal = function(args) {
    this.isModalForm = true;
    this.show(args)
};
JendoDialog.prototype.hide = function(args) {
    if (this.jDialog.length == 0) {
        return
    }
    if (jendo.isNull(args)) {
        args = {}
    }
    this.jDialog.dispatchJEvent("jendo.dialog.hide", args);
    this.jDialog.hide();
    this.jDialog.dispatchJEvent("jendo.dialog.hidden", args)
};
JendoDialog.prototype.onShow = function(listener) {
    this.jDialog.addJListener("jendo.dialog.show", listener);
    return this
};
JendoDialog.prototype.onShown = function(listener) {
    this.jDialog.addJListener("jendo.dialog.shown", listener);
    return this
};
JendoDialog.prototype.onHide = function(listener) {
    this.jDialog.addJListener("jendo.dialog.hide", listener);
    return this
};
JendoDialog.prototype.onHidden = function(listener) {
    this.jDialog.addJListener("jendo.dialog.hidden", listener);
    return this
};
JendoDialog.findDialog = function(target) {
    var elm = this.findParentElement(target, "role", "dialog");
    return new JendoDialog(elm)
};
JendoDialog.findDocument = function(target) {
    return this.findParentElement(target, "role", "document")
};
JendoDialog.findTitlebar = function(target) {
    return this.findParentElement(target, "data-dialog", "titlebar")
};
JendoDialog.findParentElement = function(target, attrName, attrValue) {
    var element = target.parentElement;
    while (element != null) {
        var elementRole = element.attributes[attrName];
        if (!jendo.isNull(elementRole) && elementRole.value.toLowerCase() == attrValue) {
            return element
        }
        element = element.parentElement
    }
    return null
};
jendo.dialog = function(element) {
    return new JendoDialog(element)
};
jendo.dialogInit = function() {
    jendo('[data-toggle="jd-dialog"]').forEach(function(i, item) {
        var jdItem = jendo(item);
        var dTarget = jdItem.data("target");
        if (!jendo.isNullOrWhiteSpace(dTarget)) {
            jdItem.click(function(e) {
                jendo.dialog(dTarget).show()
            })
        }
    })
};

function JendoDatepicker(element, options) {
    this.jdElement = element;
    this.dElement = this.jdElement.first();
    this.dpOptions = this.dElement.options;
    if (jendo.isNull(this.dpOptions)) {
        this.dpOptions = {
            weekdayStart: 1,
            format: "yyyy-MM-dd",
            viewMode: "days",
            showButton: false,
            position: "left"
        };
        this.dElement.options = this.dpOptions
    }
    if (!this.isInit()) {
        var dpParent = this.jdElement.parent();
        if (this.dpOptions.showButton) {
            var dBtn = document.createElement("i");
            dBtn.setAttribute("class", "fa fa-calendar");
            dBtn.setAttribute("aria-hidden", "true");
            dpParent.insertAfter(dBtn, this.jdElement)
        }
        this.dDatepicker = this.createDatepicker(this.jdElement.attrId() + "_datepicker");
        dpParent.insertAfter(this.dDatepicker, this.jdElement);
        var jdp = this;
        var jdDatepicker = jendo(this.dDatepicker);
        this.jdElement.click(function(source) {
            if (jdDatepicker.isVisible()) {
                jdDatepicker.hide()
            } else {
                if (jdp.dpOptions.position == "right") {
                    jdDatepicker.left(jdp.jdElement.left() + jdp.jdElement.width() - 228)
                } else {
                    jdDatepicker.left(jdp.jdElement.left())
                }
                jdDatepicker.show();
                _JendoFuncCloseElement = jdp.hideElement;
                _JendoLastOpenElement = jdDatepicker
            }
        });
        this.isInit(true)
    }
}
JendoDatepicker.prototype.isInit = function(value) {
    if (jendo.isNull(value)) {
        var isInit = this.dElement.jdp_IsInit;
        return jendo.isNull(isInit) ? false : isInit
    } else {
        this.dElement.jdp_IsInit = value;
        return this
    }
};
JendoDatepicker.prototype.hide = function() {
    jendo(this.dDatepicker).hide();
    _JendoFuncCloseElement = null;
    _JendoLastOpenElement = null
};
JendoDatepicker.prototype.hideElement = function(source) {
    if (!_JendoLastOpenElement.isContains(source)) {
        _JendoLastOpenElement.hide();
        _JendoFuncCloseElement = null;
        _JendoLastOpenElement = null
    }
};
JendoDatepicker.prototype.format = function(pattern) {
    if (jendo.isNullOrWhiteSpace(pattern)) {
        return this.dpOptions.format
    } else {
        this.dpOptions.format = pattern;
        if (!jendo.isNull(this.dElement.dateValue)) {
            this.jdElement.val(jendo.dateFormatUI(this.dElement.dateValue, pattern))
        }
        return this
    }
};
JendoDatepicker.prototype.positionLeft = function() {
    this.dpOptions.position = "left";
    return this
};
JendoDatepicker.prototype.positionRight = function() {
    this.dpOptions.position = "right";
    return this
};
JendoDatepicker.prototype.createDatepicker = function(datepickerId) {
    var dp = document.createElement("div");
    dp.setAttribute("class", "datepicker");
    dp.id = datepickerId;
    var dpDate = jendo.now();
    this.loadDPDays(dp, dpDate.getFullYear(), dpDate.getMonth(), dpDate.getDate());
    return dp
};
JendoDatepicker.prototype.addDPHead = function(content, titleText, titleClick, leftClick, rightClick) {
    var dpHead = document.createElement("div");
    dpHead.setAttribute("class", "dp-head");
    content.appendChild(dpHead);
    var dphLeft = document.createElement("div");
    dphLeft.setAttribute("class", "dph-left");
    dpHead.appendChild(dphLeft);
    var dphlButton = document.createElement("button");
    dphlButton.setAttribute("type", "button");
    dphlButton.innerText = "<";
    dphlButton.onclick = leftClick;
    dphLeft.appendChild(dphlButton);
    var dphTitle = document.createElement("div");
    dphTitle.setAttribute("class", "dph-title");
    dpHead.appendChild(dphTitle);
    var dphtButton = document.createElement("button");
    dphtButton.setAttribute("type", "button");
    dphtButton.innerText = titleText;
    dphtButton.onclick = titleClick;
    dphTitle.appendChild(dphtButton);
    var dphRight = document.createElement("div");
    dphRight.setAttribute("class", "dph-right");
    dpHead.appendChild(dphRight);
    var dphrButton = document.createElement("button");
    dphrButton.setAttribute("type", "button");
    dphrButton.innerText = ">";
    dphrButton.onclick = rightClick;
    dphRight.appendChild(dphrButton)
};
JendoDatepicker.prototype.loadDPDays = function(content, dYear, dMonth, dDate) {
    content.innerText = "";
    var jdp = this;
    this.addDPHead(content, jendo.lang.monthNames[dMonth] + " " + dYear, function(source) {
        jdp.loadDPMonths(content, dYear, dMonth, dDate)
    }, function(source) {
        var hDate = new Date(dYear, dMonth - 1, dDate);
        jdp.loadDPDays(content, hDate.getFullYear(), hDate.getMonth(), hDate.getDate())
    }, function(source) {
        var hDate = new Date(dYear, dMonth + 1, dDate);
        jdp.loadDPDays(content, hDate.getFullYear(), hDate.getMonth(), hDate.getDate())
    });
    var dpBody = document.createElement("div");
    dpBody.setAttribute("class", "dp-month");
    content.appendChild(dpBody);
    var pWeekday = document.createElement("div");
    pWeekday.setAttribute("class", "dpm-weekdays");
    dpBody.appendChild(pWeekday);
    for (var iwd = this.dpOptions.weekdayStart; iwd < jendo.lang.weekdayNames.length; iwd++) {
        var wd = document.createElement("div");
        wd.setAttribute("class", "dpm-weekday");
        wd.innerText = jendo.lang.weekdayNarrowNames[iwd];
        pWeekday.appendChild(wd)
    }
    for (var iwd = 0; iwd < this.dpOptions.weekdayStart; iwd++) {
        var wd = document.createElement("div");
        wd.setAttribute("class", "dpm-weekday");
        wd.innerText = jendo.lang.weekdayNarrowNames[iwd];
        pWeekday.appendChild(wd)
    }
    var mDays = document.createElement("div");
    mDays.setAttribute("class", "dpm-days");
    dpBody.appendChild(mDays);
    var shiftStart = new Date(Date.UTC(dYear, dMonth, 1)).getDay() - this.dpOptions.weekdayStart;
    if (shiftStart < 0) {
        shiftStart += 7
    }
    for (var iss = 0; iss < shiftStart; iss++) {
        var elmDay = document.createElement("button");
        elmDay.setAttribute("type", "button");
        elmDay.setAttribute("class", "dpm-day");
        elmDay.innerText = "";
        mDays.appendChild(elmDay)
    }
    var days = jendo.daysInMonth(dMonth + 1, dYear);
    for (var d = 1; d <= days; d++) {
        var elmDay = document.createElement("button");
        elmDay.setAttribute("type", "button");
        elmDay.setAttribute("class", "dpm-day");
        elmDay.setAttribute("data-day", d);
        elmDay.innerText = d;
        elmDay.onclick = function(source) {
            var dayIndex = source.target.getAttribute("data-day");
            var selDate = new Date(Date.UTC(dYear, dMonth, dayIndex));
            jdp.dElement.dateValue = selDate;
            jdp.jdElement.val(jendo.dateFormatUI(selDate, jdp.format()));
            jdp.hide()
        };
        mDays.appendChild(elmDay)
    }
    var shiftEnd = (shiftStart + days) % 7;
    if (shiftEnd > 0) {
        shiftEnd = 7 - shiftEnd
    }
    for (var ise = 0; ise < shiftEnd; ise++) {
        var elmDay = document.createElement("button");
        elmDay.setAttribute("type", "button");
        elmDay.setAttribute("class", "dpm-day");
        elmDay.innerText = "";
        mDays.appendChild(elmDay)
    }
};
JendoDatepicker.prototype.loadDPMonths = function(content, dYear, dMonth, dDate) {
    content.innerText = "";
    var jdp = this;
    this.addDPHead(content, dYear, function(source) {
        jdp.loadDPYears(content, dYear, dMonth, dDate)
    }, function(source) {
        var hDate = new Date(dYear - 1, dMonth, dDate);
        jdp.loadDPMonths(content, hDate.getFullYear(), hDate.getMonth(), hDate.getDate())
    }, function(source) {
        var hDate = new Date(dYear + 1, dMonth, dDate);
        jdp.loadDPMonths(content, hDate.getFullYear(), hDate.getMonth(), hDate.getDate())
    });
    var dpBody = document.createElement("div");
    dpBody.setAttribute("class", "dp-months");
    content.appendChild(dpBody);
    for (var i = 0; i < jendo.lang.monthShortNames.length; i++) {
        var ym = document.createElement("button");
        ym.setAttribute("type", "button");
        ym.setAttribute("class", "dpm-month");
        ym.setAttribute("data-month", i);
        ym.innerText = jendo.lang.monthShortNames[i];
        ym.onclick = function(source) {
            var monthIndex = source.target.getAttribute("data-month");
            var mDate = new Date(dYear, monthIndex, dDate);
            jdp.loadDPDays(content, mDate.getFullYear(), mDate.getMonth(), mDate.getDate())
        };
        dpBody.appendChild(ym)
    }
};
JendoDatepicker.prototype.loadDPYears = function(content, dYear, dMonth, dDate) {
    content.innerText = "";
    var jdp = this;
    var strYear = dYear.toString();
    var dYearFrom = dYear - parseInt(strYear[strYear.length - 1]);
    var dYearTo = dYearFrom + 9;
    this.addDPHead(content, dYearFrom + " - " + dYearTo, function(source) {}, function(source) {
        var hDate = new Date(dYear - 12, dMonth, dDate);
        jdp.loadDPYears(content, hDate.getFullYear(), hDate.getMonth(), hDate.getDate())
    }, function(source) {
        var hDate = new Date(dYear + 12, dMonth, dDate);
        jdp.loadDPYears(content, hDate.getFullYear(), hDate.getMonth(), hDate.getDate())
    });
    var dpBody = document.createElement("div");
    dpBody.setAttribute("class", "dp-months");
    content.appendChild(dpBody);
    for (var i = -1; i < 11; i++) {
        var iYear = dYearFrom + i;
        var ym = document.createElement("button");
        ym.setAttribute("type", "button");
        if (i == -1 || i == 10) {
            ym.setAttribute("class", "dpm-month dpm-outside")
        } else {
            ym.setAttribute("class", "dpm-month")
        }
        ym.setAttribute("data-year", iYear);
        ym.innerText = iYear;
        ym.onclick = function(source) {
            var yearIndex = source.target.getAttribute("data-year");
            var mDate = new Date(yearIndex, dMonth, dDate);
            jdp.loadDPMonths(content, mDate.getFullYear(), mDate.getMonth(), mDate.getDate())
        };
        dpBody.appendChild(ym)
    }
};
jendo.datepicker = function(element) {
    if (!jendo.isNull(element)) {
        var targetElement = jendo(element);
        if (targetElement.length > 0) {
            return new JendoDatepicker(targetElement)
        }
    }
};

function JendoGridView(element) {
    if (jendo.isNull(element)) {
        return
    }
    if (element.length == 0) {
        return
    }
    this._Element = element;
    this._GridView = this._Element.find('[role="grid"]');
    if (this._GridView.length == 0) {
        this._GridView = this._Element.appendTable().role("grid")
    }
    this._GVData = this._GridView.prop("gvdata");
    if (jendo.isNull(this._GVData)) {
        this._GVData = {
            filterable: {
                enabled: false,
                mode: "row"
            },
            columns: [],
            records: [],
            sortData: [],
            filterData: [],
            allowPaging: true,
            pageSize: 10,
            pageNo: 1,
            pager: {
                numeric: true,
                numericCount: 5,
                prevNext: true,
                firstLast: true,
                goToPage: true,
                pageSize: true,
                pageSizeList: [],
                info: true
            },
            show: {
                rowNo: false
            }
        };
        this._GridView.prop("gvdata", this._GVData)
    }
}
JendoGridView.prototype.data = function(value) {
    if (jendo.isNull(value)) {
        return this
    }
    if ("allowPaging" in value) {
        this._GVData.allowPaging = value.allowPaging
    }
    if ("filterable" in value) {
        if ("enabled" in value.filterable) {
            this._GVData.filterable.enabled = value.filterable.enabled
        }
        if ("mode" in value.filterable) {
            this._GVData.filterable.mode = value.filterable.mode
        }
    }
    if ("show" in value) {
        if ("rowNo" in value.show) {
            this._GVData.show.rowNo = value.show.rowNo
        }
    }
    this.filterable(value.filterable);
    this.columns(value.columns);
    this.records(value.records);
    return this
};
JendoGridView.prototype.filterable = function(value) {
    if (jendo.isNull(value)) {
        return
    }
    var gFilterable = this._GVData.filterable;
    gFilterable.enabled = jendo.isNull(value.enabled) ? false : value.enabled;
    gFilterable.mode = jendo.isNull(value.mode) ? "row" : value.mode
};
JendoGridView.prototype.columns = function(value) {
    if (!jendo.isNull(value)) {
        var jgv = this;
        var gColumns = this._GVData.columns;
        var gFilterable = this._GVData.filterable;
        var sortData = this._GVData.sortData;
        var filterData = this._GVData.filterData;
        var tHead = this._GridView.appendTHead();
        var tRow = tHead.appendTRow();
        var tRowFilter = null;
        if (gFilterable.enabled && gFilterable.mode == "row") {
            tRowFilter = tHead.appendTRow()
        }
        if (this._GVData.show.rowNo) {
            tRow.appendTH().text("#")
        }
        if (tRowFilter != null && this._GVData.show.rowNo) {
            tRowFilter.appendTH()
        }
        for (var i = 0; i < value.length; i++) {
            var gCol = value[i];
            if (jendo.isNullOrEmpty(gCol.caption)) {
                gCol.caption = ""
            }
            var th = tRow.appendTH();
            th.text(gCol.caption);
            if (!jendo.isNull(gCol.field)) {
                th.append('<i class="fa fa-sort-asc jd-sort-asc" aria-hidden="true"></i>');
                th.append('<i class="fa fa-sort-desc jd-sort-desc" aria-hidden="true"></i>');
                th.data("field", gCol.field);
                th.click(function(e) {
                    if (e.ctrlKey) {
                        var dataField = _(e.target).data("field");
                        var sortField = sortData.find(function(item) {
                            return item.field === dataField
                        });
                        if (_.isNull(sortField)) {
                            sortData.push({
                                field: dataField,
                                sort: 1
                            })
                        } else {
                            if (sortField.sort == 1) {
                                sortField.sort = -1
                            } else if (sortField.sort == -1) {
                                var sortFieldIndex = sortData.findIndex(function(item) {
                                    return item.field === dataField
                                });
                                sortData.splice(sortFieldIndex, 1)
                            } else {
                                sortField.sort = 1
                            }
                        }
                    } else {
                        var dataField = jendo(e.target).data("field");
                        var sortField = sortData.find(function(item) {
                            return item.field === dataField
                        });
                        if (_.isNull(sortField)) {
                            sortData.splice(0, sortData.length);
                            sortData.push({
                                field: dataField,
                                sort: 1
                            })
                        } else {
                            sortField.sort = sortField.sort == 1 ? -1 : 1
                        }
                    }
                    jgv.sortData()
                });
                gColumns.push(gCol);
                if (tRowFilter != null) {
                    var thrf = tRowFilter.appendTH();
                    thrf.appendText("input").data("field", gCol.field).keyUp(function(e) {
                        var dField = _(e.target);
                        var dFieldName = dField.data("field");
                        var dFieldValue = dField.val();
                        if (!filterData.find(function(value, index) {
                                if (value.field == dFieldName) {
                                    value.filter = dFieldValue;
                                    return true
                                } else {
                                    return false
                                }
                            })) {
                            filterData.push({
                                field: dFieldName,
                                filter: dFieldValue
                            })
                        }
                        jgv.refreshRecords()
                    })
                }
            } else if (!jendo.isNull(gCol.commands)) {
                gColumns.push(gCol);
                if (tRowFilter != null) {
                    var thrf = tRowFilter.appendTH()
                }
            } else if (!jendo.isNull(gCol.bind)) {
                gColumns.push(gCol)
            }
        }
    }
};
JendoGridView.prototype.records = function(value) {
    if (!jendo.isNull(value)) {
        var gColumns = this._GVData.columns;
        this._GVData.records = value;
        var tBody = this._GridView.appendTBody().role("rowgroup");
        this.appendGRows(tBody, gColumns, value, this._GVData);
        this.appendGPaging(tBody, gColumns, value, this._GVData)
    }
};
JendoGridView.prototype.refreshRecords = function() {
    var gColumns = this._GVData.columns;
    var gRecords = this._GVData.records;
    var gSortData = this._GVData.sortData;
    var gFilterData = this._GVData.filterData;
    var tBody = this._Element.find('tbody[role="rowgroup"]');
    tBody.html("");
    var tHead = this._Element.find("th[data-field]");
    tHead.removeClass("jd-field-sort");
    tHead.removeClass("jd-field-desort");
    for (var i = 0; i < gSortData.length; i++) {
        var fieldData = gSortData[i];
        if (fieldData.sort == -1) {
            this._Element.find('th[data-field="' + fieldData.field + '"]').addClass("jd-field-desort")
        } else {
            this._Element.find('th[data-field="' + fieldData.field + '"]').addClass("jd-field-sort")
        }
    }
    if (gFilterData.length > 0) {
        gRecords = gRecords.filterBy(gFilterData)
    }
    this.appendGRows(tBody, gColumns, gRecords, this._GVData);
    this.appendGPaging(tBody, gColumns, gRecords, this._GVData)
};
JendoGridView.prototype.refresh = function() {
    this.refreshRecords()
};
JendoGridView.prototype.appendGRows = function(tBody, gColumns, gRecords, gvData) {
    var firstRowIndex = 0;
    var lastRowIndex = gRecords.length;
    if (this._GVData.allowPaging) {
        firstRowIndex = gvData.pageNo > 1 ? (gvData.pageNo - 1) * this._GVData.pageSize : 0;
        var maxRowIndex = firstRowIndex + this._GVData.pageSize;
        if (lastRowIndex > maxRowIndex) {
            lastRowIndex = maxRowIndex
        }
    }
    for (var i = firstRowIndex; i < lastRowIndex; i++) {
        var gRow = gRecords[i];
        typeof gRow == "object" ? this.recordBound(i, tBody, gRow, gColumns) : this.recordBound(i, tBody, {}, gColumns)
    }
};
JendoGridView.prototype.appendGPaging = function(tBody, gColumns, gRecords, gvData) {
    if (gvData.allowPaging) {
        var thisJGV = this;
        var tRow = tBody.appendTRow().addClass("jd-pager");
        var td = tRow.appendTD();
        var countColumns = gColumns.length;
        if (gvData.show.rowNo) {
            countColumns += 1
        }
        var countPageTmp = gRecords.length / gvData.pageSize;
        gvData.countPage = Math.round(countPageTmp, 0);
        if (countPageTmp > gvData.countPage) {
            gvData.countPage += 1
        }
        td.attr("colspan", countColumns);
        var pager = gvData.pager;
        if (pager.firstLast) {
            var btnFirst = td.appendButton().addClass("jd-pager-btn").click(function(e) {
                thisJGV.pageFirst()
            });
            btnFirst.appendI().attr("class", "fa fa-angle-double-left").attr("aria-hidden", true);
            if (gvData.pageNo == 1) {
                btnFirst.attr("disabled", "")
            }
        }
        if (pager.prevNext) {
            var btnPrev = td.appendButton().addClass("jd-pager-btn").click(function(e) {
                thisJGV.pagePrev()
            });
            btnPrev.appendI().attr("class", "fa fa-angle-left").attr("aria-hidden", true);
            if (gvData.pageNo == 1) {
                btnPrev.attr("disabled", "")
            }
        }
        if (pager.numeric) {
            var numericCount = pager.numericCount > gvData.countPage ? gvData.countPage : pager.numericCount;
            for (var i = 1; i <= numericCount; i++) {
                var btnNumeric = td.appendButton(i).addClass("jd-pager-btn").click(function(e) {
                    thisJGV.pageNo(e.data.pageNo)
                }, {
                    pageNo: i
                })
            }
        }
        if (pager.prevNext) {
            var btnNext = td.appendButton().addClass("jd-pager-btn").click(function(e) {
                thisJGV.pageNext()
            });
            btnNext.appendI().attr("class", "fa fa-angle-right").attr("aria-hidden", true);
            if (gvData.pageNo == gvData.countPage) {
                btnNext.attr("disabled", "")
            }
        }
        if (pager.firstLast) {
            var btnLast = td.appendButton().addClass("jd-pager-btn").click(function(e) {
                thisJGV.pageLast()
            });
            btnLast.appendI().attr("class", "fa fa-angle-double-right").attr("aria-hidden", true);
            if (gvData.pageNo == gvData.countPage) {
                btnLast.attr("disabled", "")
            }
        }
        if (pager.goToPage) {
            var pnlGTP = td.appendDiv().addClass("jd-pager-panel");
            pnlGTP.appendSpan().text("Page:");
            var textGTP = pnlGTP.appendText();
            pnlGTP.appendSpan().text("of " + gvData.countPage);
            pnlGTP.appendButton("Go").addClass("jd-pager-btn").click(function(e) {
                var goToPage = parseInt(textGTP.val());
                if (goToPage > 0) {
                    thisJGV.pageNo(textGTP.val())
                }
            })
        }
        if (pager.pageSize) {
            var pnlPS = td.appendDiv().addClass("jd-pager-panel");
            pnlPS.appendSpan().text("Page size:");
            if (Array.isArray(pager.pageSizeList) && pager.pageSizeList.length > 0) {} else {
                var textPS = pnlPS.appendText().val(gvData.pageSize);
                pnlPS.appendButton("Change").addClass("jd-pager-btn").click(function() {
                    console.log("Change", textPS.val())
                })
            }
        }
    }
};
JendoGridView.prototype.recordBound = function(rowIndex, tBody, gRow, gColumns) {
    var isAlt = rowIndex % 2;
    var tRow = tBody.appendTRow();
    if (isAlt == 1) {
        tRow.addClass("jd-alt")
    }
    if (this._GVData.show.rowNo) {
        var tdNo = tRow.appendTD().text(rowIndex + 1 + ".")
    }
    for (var f = 0; f < gColumns.length; f++) {
        var gCol = gColumns[f];
        var td = tRow.appendTD();
        if (!jendo.isNull(gCol.field)) {
            var tdValue = gRow[gCol.field];
            td.html(tdValue)
        } else if (!jendo.isNull(gCol.commands)) {
            for (var c = 0; c < gCol.commands.length; c++) {
                var command = gCol.commands[c];
                var btn = td.appendButton(command.caption);
                btn.class("jd-grid-btn-link");
                if (!jendo.isNullOrWhiteSpace(command.style)) {
                    btn.addClass(command.style)
                }
                if (!jendo.isNull(command.click)) {
                    var commandValue = {
                        rowIndex: rowIndex,
                        colIndex: f
                    };
                    if (!jendo.isNull(command.fields)) {
                        for (var cf = 0; cf < command.fields.length; cf++) {
                            var fieldName = command.fields[cf];
                            commandValue[fieldName] = gRow[fieldName]
                        }
                    }
                    btn.click(this.clickCommand(command.click, commandValue))
                }
            }
        } else if (!jendo.isNull(gCol.bind)) {
            var tdValue = gCol.bind({
                rowIndex: rowIndex,
                colIndex: f,
                row: gRow
            });
            td.html(tdValue)
        }
    }
};
JendoGridView.prototype.clickCommand = function(commandClick, e) {
    return function(event) {
        commandClick(event, e)
    }
};
JendoGridView.prototype.sortData = function(value) {
    var sortData = this._GVData.sortData;
    if (!jendo.isNull(value)) {
        sortData.splice(0, sortData.length);
        for (var i = 0; i < value.length; i++) {
            sortData.push(value[i])
        }
    }
    this._GVData.records.sortBy(sortData);
    this.refreshRecords()
};
JendoGridView.prototype.pageNo = function(value) {
    if (jendo.isNullOrWhiteSpace(value)) {
        return this._GVData.pageNo
    } else {
        var gvData = this._GVData;
        if (value > 0 && value <= gvData.countPage) {
            gvData.pageNo = value;
            this.refreshRecords()
        }
    }
};
JendoGridView.prototype.pagePrev = function() {
    var gvData = this._GVData;
    this.pageNo(gvData.pageNo - 1)
};
JendoGridView.prototype.pageNext = function() {
    var gvData = this._GVData;
    this.pageNo(gvData.pageNo + 1)
};
JendoGridView.prototype.pageFirst = function() {
    this.pageNo(1)
};
JendoGridView.prototype.pageLast = function() {
    var gvData = this._GVData;
    this.pageNo(gvData.countPage)
};
jendo.gridView = function(element) {
    if (!jendo.isNull(element)) {
        var targetElement = jendo(element);
        if (targetElement.length > 0) {
            return new JendoGridView(targetElement)
        }
    }
};

function JendoQRCodeReader(element) {
    this._QRCodeReader = jendo(element);
    this._Height = this._QRCodeReader.height();
    this._Width = this._QRCodeReader.width();
    this._OnSuccess = null;
    this._OnError = null;
    this._OnVideoError = null
}
JendoQRCodeReader.prototype.height = function(value) {
    if (jendo.isNull(value)) {
        return this._Height
    } else {
        this._Height = value;
        return this
    }
};
JendoQRCodeReader.prototype.width = function(value) {
    if (jendo.isNull(value)) {
        return this._Width
    } else {
        this._Width = value;
        return this
    }
};
JendoQRCodeReader.prototype.onSuccess = function(handler) {
    this._OnSuccess = handler;
    return this
};
JendoQRCodeReader.prototype.onError = function(handler) {
    this._OnError = handler;
    return this
};
JendoQRCodeReader.prototype.onVideoError = function(handler) {
    this._OnVideoError = handler;
    return this
};
JendoQRCodeReader.prototype.start = function() {
    var qrcReader = this._QRCodeReader;
    var height = this._Height == null ? 250 : this._Height;
    var width = this._Width == null ? 300 : this._Width;
    var qrcodeSuccessEvent = this._OnSuccess;
    var qrcodeErrorEvent = this._OnError;
    var qrcodeVideoErrorEvent = this._OnVideoError;
    var vidElem = this._QRCodeReader.find("#qr-video");
    if (vidElem.length == 0) {
        vidElem = this._QRCodeReader.appendElement("video").attr("id", "qr-video").height(height).width(width)
    } else {
        vidElem.show()
    }
    var canvasElem = this._QRCodeReader.find("#qr-canvas");
    if (canvasElem.length == 0) {
        canvasElem = this._QRCodeReader.appendElement("canvas").height(height - 2).width(width - 2).attr("id", "qr-canvas").style("display:none;")
    } else {
        canvasElem.hide()
    }
    var video = vidElem.first();
    var canvas = canvasElem.first();
    var context = canvas.getContext("2d");
    var qrcodeScan = function() {
        var mediaStream = qrcReader.data("stream");
        if (!jendo.isNull(mediaStream)) {
            context.drawImage(video, 0, 0, 307, 250);
            try {
                qrcode.decode()
            } catch (e) {
                if (!jendo.isNull(qrcodeErrorEvent)) {
                    qrcodeErrorEvent(e, mediaStream)
                }
            }
            setTimeout(qrcodeScan, 500)
        }
    };
    jendo.navigator.getUserMedia({
        video: true
    }, function(stream) {
        window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
        video.src = window.URL && window.URL.createObjectURL(stream) || stream;
        qrcReader.data("stream", stream);
        video.play();
        setTimeout(qrcodeScan, 1e3)
    }, function(error) {
        qrcodeVideoErrorEvent(error, qrcReader.data("stream"))
    });
    qrcode.callback = function(result) {
        if (!jendo.isNull(qrcodeSuccessEvent)) {
            qrcodeSuccessEvent(result, qrcReader.data("stream"))
        }
    }
};
JendoQRCodeReader.prototype.stop = function() {
    var stream = this._QRCodeReader.data("stream");
    if (!jendo.isNull(stream)) {
        stream.getVideoTracks().forEach(function(videoTrack) {
            videoTrack.stop()
        });
        this._QRCodeReader.dataRemove("stream")
    }
};
JendoQRCodeReader.prototype.files = function(value) {
    var qrcReader = this._QRCodeReader;
    var height = this._Height == null ? 250 : this._Height;
    var width = this._Width == null ? 300 : this._Width;
    var qrcodeSuccessEvent = this._OnSuccess;
    var qrcodeErrorEvent = this._OnError;
    var qrcodeVideoErrorEvent = this._OnVideoError;
    var vidElem = this._QRCodeReader.find("#qr-video");
    if (vidElem.length > 0) {
        vidElem.hide()
    }
    var canvasElem = this._QRCodeReader.find("#qr-canvas");
    if (canvasElem.length == 0) {
        canvasElem = this._QRCodeReader.appendElement("canvas").height(height - 2).width(width - 2).attr("id", "qr-canvas")
    } else {
        canvasElem.show()
    }
    var video = vidElem.first();
    var canvas = canvasElem.first();
    var context = canvas.getContext("2d");
    qrcode.callback = function(result) {
        if (!jendo.isNull(qrcodeSuccessEvent)) {
            qrcodeSuccessEvent(result, qrcReader.data("stream"))
        }
    };
    var img = new Image;
    img.onload = function() {
        img.width = context.canvas.width;
        img.height = context.canvas.height;
        context.drawImage(img, 0, 0, context.canvas.width, context.canvas.height)
    };
    for (var i = 0; i < value.length; i++) {
        var reader = new FileReader;
        reader.onload = function(imgFile) {
            return function(imgReader) {
                try {
                    qrcode.decode(imgReader.target.result);
                    img.src = imgReader.target.result
                } catch (e) {
                    if (!jendo.isNull(qrcodeErrorEvent)) {
                        qrcodeErrorEvent(e, mediaStream)
                    }
                }
            }
        }(value[i]);
        reader.readAsDataURL(value[i])
    }
};
jendo.QRCodeReader = function(element) {
    return new JendoQRCodeReader(element)
};

function JendoToolbar(element, options) {
    this.jdElement = element;
    if (jendo.isNull(options)) {
        return this
    } else if (!jendo.isNull(options.menu)) {
        var tabMenu = this.jdElement.appendDiv().class("jd-toolbar jd-toolbar-default");
        this.loadMenu(tabMenu, options)
    } else if (!jendo.isNull(options.tabs)) {
        var tBar = this.jdElement.appendDiv().class("jd-toolbar jd-toolbar-default");
        var tabMenu = tBar.appendUL().class("jd-tb-tabs");
        var selTab = null;
        for (var t = 0; t < options.tabs.length; t++) {
            var menuItem = options.tabs[t];
            var tabItemMenu = this.loadMenu(tBar, menuItem);
            tabItemMenu.hide();
            var menuBtn = tabMenu.appendLI().appendButton().class("jd-tb-button").text(menuItem.title).click(function(e) {
                var tiBtn = jendo(e.target);
                tiBtn.parent().parent().find("button").removeClass("jd-tb-active");
                tiBtn.addClass("jd-tb-active");
                var tiMenu = e.data.tabMenu;
                tiMenu.parent().find(".jd-tb-menu").hide();
                tiMenu.show()
            }, {
                tabMenu: tabItemMenu
            });
            menuBtn.prop("menu", tabItemMenu);
            if (menuItem.selected || selTab == null) {
                selTab = menuBtn
            }
        }
        if (selTab != null) {
            selTab.addClass("jd-tb-active");
            selTab.prop("menu").show()
        }
        return this
    }
}
JendoToolbar.prototype.loadMenu = function(jdTab, tbMenu) {
    var tabMenu = jdTab.appendUL().class("jd-tb-menu");
    for (var i = 0; i < tbMenu.menu.length; i++) {
        var menuItem = tbMenu.menu[i];
        var menuBtn = tabMenu.appendLI().appendButton().class("jd-tb-button");
        menuBtn.appendI().class(menuItem.glyphs).attr("aria-hidden", true);
        menuBtn.appendSamp().text(menuItem.title)
    }
    return tabMenu
};
jendo.toolbar = function(element, options) {
    return new JendoToolbar(jendo(element), options)
};