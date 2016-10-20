
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
    var x0 = 0;

    for(k=0; k<electionResult.length; k++){
        stackData.push([{diff:electionResult[k].RD_Difference,id:electionResult[k].State, x:electionResult[k].Year, y:electionResult[k].Total_EV, y0:x0}]);
      //  x0 = x0 + +electionResult[k].Total_EV;
    }

    var ind = [];
    var dem = [];
    var rep = [];

    for(k=0; k<stackData.length; k++){
        if(stackData[k][0].diff == 0){
            ind.push(stackData[k]);
        }
        else if (stackData[k][0].diff < 0){
            dem.push(stackData[k]);
        }else
        {
            rep.push(stackData[k]);
        }
    }

    ind.sort(function(a, b) {
        return parseFloat(b[0].diff) - parseFloat(a[0].diff);
    });

    dem.sort(function(a, b) {
        //return parseFloat(b[0].diff) - parseFloat(a[0].diff);
       return parseFloat(a[0].diff)  - parseFloat(b[0].diff)
    });

    rep.sort(function(a, b) {
        return parseFloat(a[0].diff) - parseFloat(b[0].diff);
    });


    var stackDataNew = []
    stackDataNew = ind.concat(dem,rep);

    totalEvI = 0;
    totalEvD = 0;
    totalEvR = 0;

    for(l=0; l<stackDataNew.length; l++){
        stackDataNew[l][0].y0 = x0 ;
        x0 = x0 + +stackDataNew[l][0].y;

        if(stackDataNew[l][0].diff < 0){
            totalEvD += +stackDataNew[l][0].y;

        }
        else if(stackDataNew[l][0].diff > 0){
            totalEvR += +stackDataNew[l][0].y;

        }
        else{

            totalEvI += +stackDataNew[l][0].y;
        }
    }



    //console.log(stackDataNew);

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.
    d3.selectAll("#electoral-vote svg g").remove();
    d3.selectAll("#electoral-vote svg text").remove();


    var svg = d3.selectAll("#electoral-vote svg");


    var yScale = d3.scaleLinear()
        .domain([0, (totalEvD+totalEvI+totalEvR)]) //changes this to be some of total electoral votes
        .range([0, svg.node().getBoundingClientRect().width-20]);

    // Add a group for each row of data
    var groups = svg.selectAll("#electoral-vote")
        .data(stackDataNew);


    var groupsEnter = groups.enter()
        .append("g")
        .classed("electoralVotes",true);


    //groups.exit().remove();

    groupsEnter.append("rect")
        .attr("x",function(d,i){
           // return d[0].y0 ;
            return yScale(d[0].y0)

    })
        .attr("y", 70)
        .attr("width",function(d,i){

            //return d[0].y;
            return yScale(d[0].y);
        })
        .attr("height", 50)
        // .attr("class","electoralVotes")
        .attr("class",function(d,i){
            if(d[0].diff >0){
                return "republican"
            }
            else if(d[0].diff<0){
                return "democrat"
            }
            else {
                return "independent";
            }
        })
        .style("fill", function(d){
            if(d[0].diff != 0 )
            return colorScale(d[0].diff)}

            )
        .on("mouseover", function(d) {
            console.log(d[0].y +", diff value" + d[0].diff  );
    })



    groups = groups.merge(groupsEnter);


    groups.selectAll("rect")
        .transition().duration(2000)
        .attr("width", function (d) {
           // return d[0].y;
            return yScale(d[0].y)

        })
        .attr("opacity", 1)


    groups.append("line")
        .attr("x1", svg.node().getBoundingClientRect().width/2)
        .attr("y1", 60)
        .attr("x2", svg.node().getBoundingClientRect().width/2)
        .attr("y2", 140)
        //.classed("middlePoint",true)
        .style("stroke", "#333")
        .style("stroke-width", 1)

    svg.append("text")
        .text("Electoral vote(270 needed to win)")
        .attr("x",svg.node().getBoundingClientRect().width/2 )
        .attr("y",50)
        .classed("electoralVotesNote", true);

    svg.append("text")
        .text(function(){
            if(totalEvI == 0){
                return "";
            } else
            {
                return totalEvI;
            }
        })
        .attr("x",0)
        .attr("y","50")
        .classed("independent", true);

    svg.append("text")
        .text(totalEvD)
        .attr("x", function(){

            if(totalEvI == 0){
                return 10;
            } else
            {
                return yScale(totalEvI) + 20;
            }

        })
        .attr("y","50")
        .classed("democrat", true);

    svg.append("text")
        .text(totalEvR)
        .attr("x",yScale(totalEvI + totalEvD + totalEvR))
        .attr("y","50")
        .classed("republican", true);


  // groups.exit().remove;

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
