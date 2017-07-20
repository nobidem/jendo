jendo.rootUrl = '/jendo';

var jsonNavBar = [{
    link: _.route.pageLink('/jendo/?home/index'),
    text: 'Home',
}, {
    link: _.route.pageLink('/jendo/?traversing'),
    text: 'Traversing',
}, {
    link: _.route.pageLink('/jendo/?selectors'),
    text: 'Selectors',
}, {
    link: _.route.pageLink('/jendo/?events'),
    text: 'Events',
}, {
    text: 'Manipulation',
    items: [{
        link: _.route.pageLink('/dom?filter=insertion'),
        text: 'DOM Insertion',
    }]
}, {
    text: 'User Interface',
    items: [{
        link: _.route.pageLink('/jendo/?ui'),
        text: 'Component',
    }, {
        link: _.route.pageLink('/jendo/?ui/datepicker'),
        text: 'DatePicker',
    }, {
        link: _.route.pageLink('/jendo/?ui/grid_view'),
        text: 'Grid View',
    }]
}, {
    link: _.route.pageLink('/jendo/?dialog'),
    text: 'Dialog'
}, {
    link: _.route.pageLink('/jendo/?utilities'),
    text: 'Utilities'
}];