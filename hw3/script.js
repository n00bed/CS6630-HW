// Global var for FIFA world cup data
var allWorldCupData;
var worldCup;
var projectedCordinate= [];
var projectedRun=[];
//var allcountries=[];
/**
 * Render and update the bar chart based on the selection of the data type in the drop-down box
 *
 * @param selectedDimension a string specifying which dimension to render in the bar chart
 */
function updateBarChart(selectedDimension) {

    var svgBounds = d3.select("#barChart").node().getBoundingClientRect(),
        xAxisWidth = 100,
        yAxisHeight = 70;

    // ******* TODO: PART I *******

    // Create the x and y scales; make
    // sure to leave room for the axes

    min = d3.min(allWorldCupData,function(d){
        return d[selectedDimension];
    });

    max = d3.max(allWorldCupData,function(d){
        return d[selectedDimension];
    });


    console.log("The min value is: " + min + " max is: " + max );

    var yScale = d3.scaleLinear()
        .domain([0,max])
        .range([svgBounds.height-xAxisWidth,0]);


    var xScale = d3.scaleBand()
        .domain(allWorldCupData.map(function(d){
            return d.year;
        }))
        .rangeRound([svgBounds.width-20,yAxisHeight])

    // Create colorScale

    var colorScale = d3.scaleLinear()
        .domain([min,(min+max)/2 ,max])
        .range(["lightblue","steelblue","darkblue"]);

    // Create the axes (hint: use #xAxis and #yAxis)
    xAxis = d3.axisBottom();
    xAxis.scale(xScale);

    yAxis = d3.axisLeft();
    yAxis.scale(yScale);

    // Create the bars (hint: use #bars)

    d3.select("svg#barChart").select("g#xAxis")
        .attr('transform', 'translate(0,' + (svgBounds.height-xAxisWidth) + ')')
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-0.6em")
        .attr("dy", "-.30em")
        .attr("transform", function(d) {
            return "rotate(-90)"
        });

    //d3.select("svg#barChart").select("g#yAxis")
    d3.select("#yAxis")
        .attr('transform', 'translate(' + (yAxisHeight) + ',0)')
        .call(yAxis);

    d3.select('svg#barChart').select("g#bars").selectAll("rect").remove();

    //d3.select('svg#barChart').select("g#bars").selectAll("rect")
    d3.select("#bars").selectAll("rect")
        .data(allWorldCupData)
        .enter().append('rect')


    //  d3.select('svg#barChart').select("g#bars").selectAll("rect")
    d3.select("#bars").selectAll("rect")
        .data(allWorldCupData)
        .attr('transform', 'translate(0, ' + (svgBounds.height-xAxisWidth)  + ') scale(1,-1)')
        .attr('x', function(d) { return xScale(d.year); })
        .attr('y', 0)
        .attr('fill',function(d) { return colorScale(d[selectedDimension]); })
        .attr('width',15)
        .attr('height', function(d) {
            return (svgBounds.height-xAxisWidth) - yScale(d[selectedDimension])
        })
        .on("click", function (d,i) {
            d3.select(".selected").classed("selected", false);
            d3.select(this).classed("selected", true);

            console.log(xScale.domain()[i]);
            worldCup = xScale.domain()[i];
            updateInfo(worldCup);
            updateMap(worldCup)


        });


    // ******* TODO: PART II *******

    // Implement how the bars respond to click events
    // Color the selected bar to indicate is has been selected.
    // Make sure only the selected bar has this new color.

    // Call the necessary update functions for when a user clicks on a bar.
    // Note: think about what you want to update when a different bar is selected.


}

/**
 *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
 *
 *  There are 4 attributes that can be selected:
 *  goals, matches, attendance and teams.
 */
function chooseData() {

    // ******* TODO: PART I *******
    //Changed the selected data when a user selects a different
    // menu item from the drop down.

    dataFile =  document.getElementById('dataset').value;
    updateBarChart(dataFile);
    console.log(dataFile);

}

/**
 * Update the info panel to show info about the currently selected world cup
 *
 * @param oneWorldCup the currently selected world cup
 */
function updateInfo(oneWorldCup) {

    // ******* TODO: PART III *******

    // Update the text elements in the infoBox to reflect:
    // World Cup Title, host, winner, runner_up, and all participating teams that year

    // Hint: For the list of teams, you can create an list element for each team.
    // Hint: Select the appropriate ids to update the text content.

    var team = [];


    allWorldCupData.forEach(function(d,i){

        if(d.year == oneWorldCup){
            console.log(allWorldCupData[i].EDITION)

            d3.select("#edition")
                .text(allWorldCupData[i].EDITION);
            d3.select("#host")
                .text(allWorldCupData[i].host);
            d3.select("#winner")
                .text(allWorldCupData[i].winner);
            d3.select("#silver")
                .text( allWorldCupData[i].runner_up);

            for(var j=0 ; j < allWorldCupData[i].teams_names.length ; j++){
                //  team = team + allWorldCupData[i].teams_names[j]  + "\r\n";
                team.push(allWorldCupData[i].teams_names[j])

            }
            projectedCordinate.push(allWorldCupData[i].WIN_LON);
            projectedCordinate.push(allWorldCupData[i].WIN_LAT);
            projectedRun.push (allWorldCupData[i].RUP_LON);
            projectedRun.push (allWorldCupData[i].RUP_LAT);

        }


    })

    d3.select("#teams").selectAll('ul').remove();

    d3.select("#teams")
        .append('ul')
        .selectAll('li')
        .data(team)
        .enter()
        .append('li')
        .html(String);


}

/**
 * Renders and updated the map and the highlights on top of it
 *
 * @param the json data with the shape of all countries
 */
function drawMap(world) {

    //(note that projection is global!
    // updateMap() will need it to add the winner/runner_up markers.)

    projection = d3.geoConicConformal()
        .scale(150)
        .translate([400, 350]);


    console.log();
    // ******* TODO: PART IV *******

    // Draw the background (country outlines; hint: use #map)
    // Make sure and add gridlines to the map


    var path = d3.geoPath()
        .projection(projection);


    var svg = d3.select('#map')
        .attr("class", "countries");

    var graticule = d3.geoGraticule();
    svg.append("path")
        .datum(graticule)
        .attr("class","grat")
        .attr("d",path);

    //var featuresId = topojson.feature(world, world.objects.countries).features ;

    svg.selectAll("path")
        .data(topojson.feature(world, world.objects.countries).features)
        .enter()
        .append("path")
        .attr("d",path)
        .attr("id",function(d){
         //   allcountries.push(d.id);
            return d.id;

        }) .on("click", function (d,i) {

            var val = d.id;
          console.log("on click " + d.id);
          console.log("val" + d.id);
    });

}

//console.log(allcountries);
/**
 * Clears the map
 */
function clearMap() {

    // ******* TODO: PART V*******
    d3.selectAll("path").classed("host", false);
    d3.selectAll("path").classed("team", false);

}


/**
 * Update Map with info for a specific FIFA World Cup
 * @param the data for one specific world cup
 */
function updateMap(worldcupData) {

    //Clear any previous selections;
    clearMap();

    allWorldCupData.forEach(function(d,i){
        if(d.year == worldcupData){

            d3.selectAll('#'+d.host_country_code).attr("class", "host");
            for(var i = 0 ; i < d.teams_iso.length; i++){

                if(d.teams_iso[i]!=d.host_country_code){
                    d3.selectAll('#' + d.teams_iso[i]).attr("class","team");
                }
            }


        }

    })




    // ******* TODO: PART V *******

    // Add a marker for the winner and runner up to the map.


    //Hint: remember we have a conveniently labeled class called .winner
    // as well as a .silver. These have styling attributes for the two
    //markers.


    //Select the host country and change it's color accordingly.

    //Iterate through all participating teams and change their color as well.

    //We strongly suggest using classes to style the selected countries.

    d3.select("#points").selectAll("circle").remove();
    d3.select("#run").selectAll("circle").remove();

    d3.select("#points").selectAll("circle")
        .data(projectedCordinate)
        .enter()
        .append("circle")
        .attr("cx",function(){
            return projection(projectedCordinate)[0];
        })
        .attr("cy",function (){
            return projection(projectedCordinate)[1];
        })
        .attr("r",7.5)
        .attr("class","gold")

    console.log("winner:" + projectedCordinate);
    projectedCordinate = [];


    d3.select("#run").selectAll("circle")
        .data(projectedRun)
        .enter()
        .append("circle")
        .attr("cx",function(){
            return projection(projectedRun)[0];
        })
        .attr("cy",function (){
            return projection(projectedRun)[1];
            console.log('rup cy from inisde:' + projection(projectedRun)[1])
        })
        .attr("r",7.5)
        .attr("class","silver")
    console.log("rup:" + projectedRun);
    projectedRun = [];


}




/* DATA LOADING */

// This is where execution begins; everything
// above this is just function definitions
// (nothing actually happens)

//Load in json data to make map
d3.json("data/world.json", function (error, world) {
    if (error) throw error;
    drawMap(world);
});


// Load CSV file
d3.csv("data/fifa-world-cup.csv", function (error, csv) {

    csv.forEach(function (d) {

        // Convert numeric values to 'numbers'
        d.year = +d.YEAR;
        d.teams = +d.TEAMS;
        d.matches = +d.MATCHES;
        d.goals = +d.GOALS;
        d.avg_goals = +d.AVERAGE_GOALS;
        d.attendance = +d.AVERAGE_ATTENDANCE;
        //Lat and Lons of gold and silver medals teams
        d.win_pos = [+d.WIN_LON, +d.WIN_LAT];
        d.ru_pos = [+d.RUP_LON, +d.RUP_LAT];

        //Break up lists into javascript arrays
        d.teams_iso = d3.csvParse(d.TEAM_LIST).columns;
        d.teams_names = d3.csvParse(d.TEAM_NAMES).columns;

    });

    // Store csv data in a global variable
    allWorldCupData = csv;
    // Draw the Bar chart for the first time
    updateBarChart('attendance');
    console.log(allWorldCupData);


});