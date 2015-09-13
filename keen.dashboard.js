var userFilter = [{
    "operator": "ne",
    "property_name": "visitor.user_id",
    "property_value": "ec26fc9e9342d7df21a87ab2477e192a"
}, {
    "operator": "ne",
    "property_name": "visitor.user_id",
    "property_value": "627dc18163380b1f1b3e44267e0da225"
}, {
    "operator": "ne",
    "property_name": "visitor.user_id",
    "property_value": "ec26fc9e9342d7df21a87ab2477e737f"
}, {
    "operator": "ne",
    "property_name": "visitor.user_id",
    "property_value": "89e09a2739e6ca2d544e779fbdf98b40"
}, {
    "operator": "ne",
    "property_name": "visitor.user_id",
    "property_value": "ec26fc9e9342d7df21a87ab2477d5cf7"
}, {
    "operator": "ne",
    "property_name": "visitor.user_id",
    "property_value": "ec26fc9e9342d7df21a87ab2477eda97"
}, {
    "operator": "ne",
    "property_name": "visitor.user_id",
    "property_value": "970a46123bc92b62bf26c31dff24367c"
}, {
    "operator": "ne",
    "property_name": "visitor.user_id",
    "property_value": "11a2ae383bf25eefde31b138605e797f"
}, {
    "operator": "ne",
    "property_name": "visitor.user_id",
    "property_value": "ec26fc9e9342d7df21a87ab2477d8d80"
}, {
    "operator": "ne",
    "property_name": "visitor.user_id",
    "property_value": "ec26fc9e9342d7df21a87ab2477db625"
}, {
    "operator": "ne",
    "property_name": "visitor.user_id",
    "property_value": "89e09a2739e6ca2d544e779fbd1be5b8"
}, {
    "operator": "ne",
    "property_name": "visitor.user_id",
    "property_value": "89e09a2739e6ca2d544e779fbd33396d"
}, {
    "operator": "ne",
    "property_name": "visitor.user_id",
    "property_value": "ec26fc9e9342d7df21a87ab2477df260"
}, {
    "operator": "ne",
    "property_name": "visitor.user_id",
    "property_value": "ec26fc9e9342d7df21a87ab2477e3eb2"
}, {
    "operator": "ne",
    "property_name": "visitor.user_id",
    "property_value": "ec26fc9e9342d7df21a87ab2477eb3cd"
}, {
    "operator": "ne",
    "property_name": "visitor.user_id",
    "property_value": "89e09a2739e6ca2d544e779fbd1cd410"
}, {
    "operator": "ne",
    "property_name": "visitor.user_id",
    "property_value": "89e09a2739e6ca2d544e779fbd1fe30e"
}, {
    "operator": "ne",
    "property_name": "visitor.user_id",
    "property_value": "locator-app"
}, {
    "operator": "ne",
    "property_name": "parsed_user_agent.browser.family",
    "property_value": "PhantomJS"
}, {
    "operator": "ne",
    "property_name": "parsed_user_agent.browser.family",
    "property_value": "Googlebot"
}];


google.maps.event.addDomListener(window, 'load', function () {

    var client = new Keen({
        projectId: "<%= keen.PROJECT_ID %>",
        readKey: "<%= keen.READ_KEY %>"
    });

    Keen.ready(function () {

        queryAndDrawCharts();
        var btns = $('#controls button');
        $('#controls button').on('click', function (ev) {
            queryAndDrawCharts({
                timeframe: 'this_' + ev.currentTarget.id
            });
            btns.removeClass('btn-primary').addClass('btn-default');
            $(ev.currentTarget).addClass('btn-primary');
        });


    });

    function queryAndDrawCharts(_opt) {
        if (!_opt) {
            _opt = {};
        }

        var options = {
            timeframe: _opt.timeframe || 'this_7_days'
        };

        var tomorrow = new Date(Date.now() + 86400000);


        var areaChartConfig = {
            chartType: "areachart",
            title: false,
            height: 250,
            width: "auto",
            chartOptions: {
                chartArea: {
                    height: "85%",
                    left: "5%",
                    top: "5%",
                    width: "80%"
                }
            }
        };

        var pieChartConfig = {
            chartType: "piechart",
            title: false,
            height: 250,
            width: "auto",
            chartOptions: {
                chartArea: {
                    height: "85%",
                    left: "5%",
                    top: "5%",
                    width: "100%"
                },
                pieHole: .4
            }
        }

        function getFilter(newData) {
            if (!newData) {
                return userFilter;
            }
            var tmp = userFilter.slice(0);
            tmp.push(newData);
            return tmp;
        }


        var visitorsmetric1 = new Keen.Query("count", {
            eventCollection: "visit",
            timeframe: options.timeframe,
            filters: getFilter()
        });
        client.draw(visitorsmetric1, document.getElementById("count-metric-1"), {
            chartType: "metric",
            title: "Total Visits",
            colors: ["#49c5b1"]
        });


        var visitorsmetric2 = new Keen.Query("count", {
            eventCollection: "schoen_hier",
            filters: getFilter({"operator": "eq", "property_name": "action", "property_value": "add"}),
            timeframe: options.timeframe
        });
        client.draw(visitorsmetric2, document.getElementById("count-metric-2"), {
            chartType: "metric",
            title: "Schoenhiers +",
            colors: ["#49c5b1"]
        });
        var visitorsmetric3 = new Keen.Query("count", {
            eventCollection: "schoen_hier",
            filters: getFilter({"operator": "eq", "property_name": "action", "property_value": "remove"}),
            timeframe: options.timeframe
        });
        client.draw(visitorsmetric3, document.getElementById("count-metric-3"), {
            chartType: "metric",
            title: "Schoenhiers -",
            colors: ["#49c5b1"]
        });


        // ----------------------------------------
        // page_view Area Chart
        // ----------------------------------------
        var visitors = new Keen.Query("count", {
            eventCollection: "visit",
            interval: "daily",
            filters: getFilter(),
            groupBy: "visitor.authenticated",
            timeframe: options.timeframe
        });
        client.draw(visitors, document.getElementById("chart-visitors"), areaChartConfig);

        // ----------------------------------------
        // visitor pie chart
        // ----------------------------------------
        var visitors_pie = new Keen.Query("count", {
            eventCollection: "visit",
            groupBy: "visitor.authenticated",
            filters: getFilter(),
            timeframe: options.timeframe,
            timezone: "UTC"
        });
        client.draw(visitors_pie, document.getElementById("chart-visitors-pie"), pieChartConfig);

        // ----------------------------------------
        // page_view Area Chart
        // ----------------------------------------
        var page_view_timeline = new Keen.Query("count", {
            eventCollection: "page_view",
            filters: getFilter({"operator": "ne", "property_name": "page_type", "property_value": null}),
            groupBy: "page_type",
            interval: 'daily',
            timeframe: options.timeframe
        });
        client.draw(page_view_timeline, document.getElementById("chart-01"), areaChartConfig);


        // ----------------------------------------
        // page_view Pie Chart
        // ----------------------------------------
        var page_view_static = new Keen.Query("count", {
            eventCollection: "page_view",
            filters: getFilter(),
            groupBy: "page_type",
            timeframe: options.timeframe
        });
        client.draw(page_view_static, document.getElementById("chart-02"), pieChartConfig);

        // ----------------------------------------
        // page_view Area Chart
        // ----------------------------------------
        var page_view_timeline = new Keen.Query("count", {
            eventCollection: "visit",
            interval: "daily",

            filters: getFilter({"operator": "ne", "property_name": "page_type", "property_value": null}),
            groupBy: "ip_geo_info.city",
            timeframe: options.timeframe
        });
        client.draw(page_view_timeline, document.getElementById("chart-visit-city"), areaChartConfig);


        // ----------------------------------------
        // page_view Pie Chart
        // ----------------------------------------
        var page_view_static = new Keen.Query("count", {
            eventCollection: "visit",
            filters: getFilter(),
            groupBy: "ip_geo_info.city",
            timeframe: options.timeframe
        });
        client.draw(page_view_static, document.getElementById("chart-visit-city-pie"), pieChartConfig);


        // ----------------------------------------
        // page_view Area Chart
        // ----------------------------------------
        var page_view_timeline = new Keen.Query("count", {
            eventCollection: "schoen_hier",
            interval: "daily",

            filters: getFilter({"operator": "ne", "property_name": "page_type", "property_value": null}),
            groupBy: "action",
            timeframe: options.timeframe
        });
        client.draw(page_view_timeline, document.getElementById("chart-schoenhier"), areaChartConfig);


        // ----------------------------------------
        // page_view Pie Chart
        // ----------------------------------------
        var page_view_static = new Keen.Query("count", {
            eventCollection: "schoen_hier",
            groupBy: "action",
            filters: getFilter(),
            timeframe: options.timeframe
        });
        client.draw(page_view_static, document.getElementById("chart-schoenhier-pie"), pieChartConfig);
    }

    function buildMaps() {
        var bounds = new google.maps.LatLngBounds();
        var map = new google.maps.Map(document.getElementById('map-canvas'), {
            center: new google.maps.LatLng(0, 0),
            zoom: 2
        });

        var bounds6 = new google.maps.LatLngBounds();
        var map6 = new google.maps.Map(document.getElementById('map-canvas-6'), {
            center: new google.maps.LatLng(0, 0),
            zoom: 2
        });

        var bounds_notUs = new google.maps.LatLngBounds();
        var map_notUs = new google.maps.Map(document.getElementById('map-canvas-notUs'), {
            center: new google.maps.LatLng(0, 0),
            zoom: 2
        });

        var infoWindow = new google.maps.InfoWindow({
            content: ''
        });


        var allLocationsCount = 0;
        var locationsLastWeekCount = 0;
        var withoutBlackListedCount = 0;

        function generateMarker(location, _map, _bounds) {
            location.__infowindowContent = '<div class="info-window"><a target="_blank" href="/location/' + location._id + '"><h3>' + location.title + '</h3></a><p>' + location.description + '</p></div>';
            var _latlng = new google.maps.LatLng(location.geotag.lat, location.geotag.long);
            var _marker = new google.maps.Marker({
                position: _latlng,
                map: _map,
                animation: google.maps.Animation.DROP,
                title: location.title
            });
            _marker.addListener('click', function () {
                infoWindow.close();
                infoWindow.setContent(location.__infowindowContent);
                infoWindow.open(_map, _marker);
            });
            _bounds.extend(_latlng);

        }

        $.ajax({
            url: 'https://locator-app.com/api/v1/locations/latest?page=0&elements=1200',
            method: 'GET',
            success: function (response) {

                for (var i = 0; i < response.length; i++) {
                    (function () {
                        if (response[i] !== undefined && response[i] !== null) {
                            generateMarker(response[i], map, bounds);
                            allLocationsCount++;

                            if (new Date(response[i].create_date) - (Date.now() - 604800000) > 0) {
                                generateMarker(response[i], map6, bounds6);
                                locationsLastWeekCount++;

                            }
                            var isInBlacklist = false;
                            userFilter.forEach(function (filterElem) {
                                if (filterElem.property_name === 'visitor.user_id' && filterElem.property_value === response[i].userid) {
                                    isInBlacklist = true;
                                }
                            });
                            if (!isInBlacklist) {
                                generateMarker(response[i], map_notUs, bounds_notUs);
                                withoutBlackListedCount++;
                            }


                        }
                    })();
                    map.fitBounds(bounds);
                    map6.fitBounds(bounds6);
                    map_notUs.fitBounds(bounds_notUs);

                    $('#location-count-all').html(allLocationsCount);
                    $('#location-count-7days').html(locationsLastWeekCount);
                    $('#location-count-notUs').html(withoutBlackListedCount);

                    var percentageTeamLocations = Math.round((allLocationsCount - withoutBlackListedCount) / allLocationsCount * 100);

                    var percentageUserLocations = 100 - percentageTeamLocations;
                    $('#location-ratio').html(percentageUserLocations);


                    $('#count-metric-4 span.keen-metric-value').html(allLocationsCount);
                    $('#count-metric-5 span.keen-metric-value').html(withoutBlackListedCount);
                    $('#count-metric-5 span.keen-metric-value').html(percentageUserLocations);
                }

            }
        });
    }


    buildMaps();

});