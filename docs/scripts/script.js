jendo.rootUrl = '/jendo';

var jsonNavBar = [{
    link: _.route.pageLink('/home/index'),
    text: 'Home',
}, {
    link: _.route.pageLink('/traversing'),
    text: 'Traversing',
}, {
    link: _.route.pageLink('/selectors'),
    text: 'Selectors',
}, {
    link: _.route.pageLink('/events'),
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
        link: _.route.pageLink('/ui'),
        text: 'Component',
    }, {
        link: _.route.pageLink('/ui/datepicker'),
        text: 'DatePicker',
    }, {
        link: _.route.pageLink('/ui/grid_view'),
        text: 'Grid View',
    }]
}, {
    link: _.route.pageLink('/dialog'),
    text: 'Dialog'
}, {
    link: _.route.pageLink('/utilities'),
    text: 'Utilities'
}];