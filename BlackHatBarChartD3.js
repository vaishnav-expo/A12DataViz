var margin = {top: 70, right: 30, bottom: 20, left: 120},
    width = 680 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right + 150)
    .attr("height", height + margin.top + margin.bottom + 30)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var states = ["Arizona","Arkansas","Connecticut","Georgia","Indiana"];
var years = [2009,2010,2011,2012];

d3.csv("state_crime.csv", function(data) {
    data = data.filter(function(d, i){ return states.includes(d["State"]) && years.includes(+d["Year"]) })

    var dict = {};
    data.forEach(function(d) {

        if(!(d["State"] in dict)){
            dict[d["State"]] = {};
            dict[d["State"]][d["Year"]] = d["Data.Population"];
            dict[d["State"]]["State"] = d["State"];
        }
        else{
            dict[d["State"]][d["Year"]] = d["Data.Population"];
        }
    });

    console.log("data = ",dict);

    var finalData = Object.values(dict);

    console.log("Finalized data = ",finalData);

    var subcategoriess = years;

    console.log("subcategoriess",subcategoriess)

    var categoriess = d3.map(finalData, function(d){return(d.State)}).keys()

    console.log("categoriess",categoriess)

    var max = d3.max(finalData, function(d) {
        return Math.max(d[2009],d[2010],d[2011],d[2012]) ;
    });

    console.log("Max : ",max)

    var x = d3.scaleBand()
        .domain(categoriess)
        .range([0, width])
        .padding([0.2])
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0));

    var y = d3.scaleLinear()
        .domain([0, 40000000])
        .range([ height, 0 ]);
    svg.append("g")
        .call(d3.axisLeft(y));

    const annotations = [
        {
            note: {
                label: "Year : 2012 Population : 6553255",
                title: "State : Arizona"
            },
            x: 50,
            y: 190,
            dy: -50,
            dx: 0
        },
        {
            note: {
                label: "Year : 2009 Population : 2949131",
                title: "State : Arkansas"
            },
            x: 150,
            y: 370,
            dy: -50,
            dx: 0
        },
        {
            note: {
                label: "Year : 2012 Population : 2431556",
                title: "State : Connecticut"
            },
            x: 270,
            y: 330,
            dy: -100,
            dx: -5
        },
        {
            note: {
                label: "Year : 2010 Population : 9919945",
                title: "State : Georgia"
            },
            x: 410,
            y: 90,
            dy: -5,
            dx: 15
        },
        {
            note: {
                label: "Year : 2011 Population : 6537334",
                title: "State : Indiana"
            },
            x: 460,
            y: 220,
            dy: -50,
            dx: 0
        }
    ]

// Add annotation to the chart
    const makeAnnotations = d3.annotation()
        .annotations(annotations)

    svg.append("svg")
        .call(makeAnnotations)

    svg.append("text")
        .attr("x", width/2)
        .attr("y", -30)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Stacked bar chart of population")

    var color = d3.scaleOrdinal()
        .domain(subcategoriess)
        .range(['#000000','#ffffff','#474646','#ab3456'])

    var stackedData = d3.stack()
        .keys(subcategoriess)
        (finalData)

    //colour labels
    svg.append("text")
        .attr("x", width + 100)
        .attr("y", 0)
        .style("text-anchor", "middle")
        .text("Colour shades");

    // Handmade legend
    for(let i = 0;i<years.length;i++){
        svg.append("circle").attr("cx",width + 60).attr("cy",20 + (25*i)).attr("r", 6).style("fill", color(i));
        svg.append("text").attr("x",  width + 80).attr("y", 20 + (25*i)).text(years[i]).style("font-size", "15px").attr("alignment-baseline","middle");
    }

    console.log("Stacked data = ",stackedData)

    svg.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = categories per categories
        .data(stackedData)
        .enter().append("g")
        .attr("fill", function(d) { return color(d.key); })
        .selectAll("rect")
        // enter a second time = loop subcategories per subcategories to add all rectangles
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("x", function(d) { return x(d.data.State); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth())
        .attr("stroke", "grey")

})