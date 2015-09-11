var client = new Keen({
    projectId: "<%= keen.PROJECT_ID %>",
    readKey: "<%= keen.READ_KEY %>"
});

Keen.ready(function () {

    var tomorrow = new Date(Date.now() + 86400000);

    var userFilter = [{"operator":"ne","property_name":"visitor.user_id","property_value":"ec26fc9e9342d7df21a87ab2477e192a"},{"operator":"ne","property_name":"visitor.user_id","property_value":"627dc18163380b1f1b3e44267e0da225"},{"operator":"ne","property_name":"visitor.user_id","property_value":"ec26fc9e9342d7df21a87ab2477e737f"},{"operator":"ne","property_name":"visitor.user_id","property_value":"89e09a2739e6ca2d544e779fbdf98b40"},{"operator":"ne","property_name":"visitor.user_id","property_value":"ec26fc9e9342d7df21a87ab2477d5cf7"},{"operator":"ne","property_name":"visitor.user_id","property_value":"ec26fc9e9342d7df21a87ab2477eda97"},{"operator":"ne","property_name":"visitor.user_id","property_value":"970a46123bc92b62bf26c31dff24367c"},{"operator":"ne","property_name":"visitor.user_id","property_value":"ec26fc9e9342d7df21a87ab2477df260"},{"operator":"ne","property_name":"visitor.user_id","property_value":"ec26fc9e9342d7df21a87ab2477e3eb2"},{"operator":"ne","property_name":"visitor.user_id","property_value":"ec26fc9e9342d7df21a87ab2477eb3cd"}];

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
        if(!newData) {
            return userFilter;
        }
        var tmp = userFilter.slice(0);
        tmp.push(newData);
        return tmp;
    }

    var visitorsmetric1 = new Keen.Query("count", {
        eventCollection: "visit",
        timeframe: "this_7_days"
    });
    client.draw(visitorsmetric1, document.getElementById("count-metric-1"), {
        chartType: "metric",
        title: "Total Visits",
        colors: ["#49c5b1"]
    });


    var visitorsmetric2 = new Keen.Query("count", {
        eventCollection: "schoen_hier",
        filters: getFilter({"operator": "eq", "property_name": "action", "property_value": "add"}),
        timeframe: "this_7_days"
    });
    client.draw(visitorsmetric2, document.getElementById("count-metric-2"), {
        chartType: "metric",
        title: "Schoenhiers +",
        colors: ["#49c5b1"]
    });
    var visitorsmetric3 = new Keen.Query("count", {
        eventCollection: "schoen_hier",
        filters: getFilter({"operator": "eq", "property_name": "action", "property_value": "remove"}),
        timeframe: "this_7_days"
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
        timeframe: "this_14_days"
    });
    client.draw(visitors, document.getElementById("chart-visitors"), areaChartConfig);

    // ----------------------------------------
    // visitor pie chart
    // ----------------------------------------
    var visitors_pie = new Keen.Query("count", {
        eventCollection: "visit",
        groupBy: "visitor.authenticated",
        filters: getFilter(),
        timeframe: "this_14_days",
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
        timeframe: "this_14_days"
    });
    client.draw(page_view_timeline, document.getElementById("chart-01"), areaChartConfig);


    // ----------------------------------------
    // page_view Pie Chart
    // ----------------------------------------
    var page_view_static = new Keen.Query("count", {
        eventCollection: "page_view",
        filters: getFilter(),
        groupBy: "page_type",
        timeframe: "this_14_days"
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
        timeframe: "this_14_days"
    });
    client.draw(page_view_timeline, document.getElementById("chart-visit-city"), areaChartConfig);


    // ----------------------------------------
    // page_view Pie Chart
    // ----------------------------------------
    var page_view_static = new Keen.Query("count", {
        eventCollection: "visit",
        filters: getFilter(),
        groupBy: "ip_geo_info.city",
        timeframe: "this_14_days"
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
        timeframe: "this_14_days"
    });
    client.draw(page_view_timeline, document.getElementById("chart-schoenhier"), areaChartConfig);


    // ----------------------------------------
    // page_view Pie Chart
    // ----------------------------------------
    var page_view_static = new Keen.Query("count", {
        eventCollection: "schoen_hier",
        groupBy: "action",
        filters: getFilter(),
        timeframe: "this_14_days"
    });
    client.draw(page_view_static, document.getElementById("chart-schoenhier-pie"), pieChartConfig);


});
