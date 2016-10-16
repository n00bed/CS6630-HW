
/**
 * Constructor for the ElectoralVoteChart
 *
 * @param shiftChart an instance of the ShiftChart class
 */
function ElectoralVoteChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
ElectoralVoteChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};

    //Gets access to the div element created for this chart from HTML
    var divelectoralVotes = d3.select("#electoral-vote").classed("content", true);
    self.svgBounds = divelectoralVotes.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 150;

    //creates svg element within the div
    self.svg = divelectoralVotes.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
ElectoralVoteChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R"){
        return "republican";
    }
    else if (party == "D"){
        return "democrat";
    }
    else if (party == "I"){
        return "independent";
    }
}

/**
 * Creates the stacked bar chart, text content and tool tips for electoral vote chart
 *
 * @param electionResult election data for the year selected
 * @param colorScale global quantile scale based on the winning margin between republicans and democrats
 */

ElectoralVoteChart.prototype.update = function(electionResult, colorScale){

    var self = this;



    // ******* TODO: PART II *******

    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory
    var stackData = [];

    for(k=0; k<electionResult.length; k++){
        stackData.push([{id:electionResult[k].State, x:electionResult[k].Year, y:electionResult[k].Total_EV}]);
    }
    var stack = d3.stack();

    console.log(stack);

    console.log("stack data printing:");

    console.log(stack(stackData));

    stack(stackData);



    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.

    //Set up scales
    var xScale = d3.scaleOrdinal()
        .domain(d3.range(stackData[0].length))
     //   .rangeRoundBands([0, 150], 0.2); // This is actually the Y scale (candidates)
    var yScale = d3.scaleLinear()
        .domain([0, self.svgWidth])
        .range([0, self.svgWidth-20]); // This is actually the X Scale (States)


    //console.log(electionResult);

    var svg = d3.select("#electoral-vote svg");

    // Add a group for each row of data
    var groups = svg.selectAll("g")
        .data(stackData)
        .enter()
        .append("g")

    var x0 = 0;
    // Add a rect for each data value
   // groups.exit().remove();


    var rects = groups
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter()
        .append("rect")


       rects.attr("x",function(d,i){
           x0 = +x0 + +d.y + 2;
            return x0;
        })
        .attr("y", 70)
        .attr("width",function(d,i){
            return d.y;
           // return d[i].y;
        })
        .attr("height", 50)
       // .attr("class","electoralVotes")
        .attr("class",function(d,i){
            if(d.y >0){
                return "republican"
            }
            else if(d[0].y<0){
                return "democrat"
            }
            else {
                return "independent";
            }
        }).attr("id", "deleteLater");



    d3.selectAll("#deleteLater").attr("opacity",1)
        .transition()
        .duration(2000)
        .attr("opacity",0).remove();






    //svg.append("circle")
    //    .attr("cy", 40)
    //    .attr("cx",100)
    //    .attr("r", 10)




    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.

};
