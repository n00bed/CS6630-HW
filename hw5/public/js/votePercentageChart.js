/**
 * Constructor for the Vote Percentage Chart
 */
function VotePercentageChart(){
    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
VotePercentageChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};
    var divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divvotesPercentage.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 200;

    //creates svg element within the div
    self.svg = divvotesPercentage.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
VotePercentageChart.prototype.chooseClass = function (party) {
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
 * Renders the HTML content for tool tip
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for toop tip
 */
VotePercentageChart.prototype.tooltip_render = function (tooltip_data) {
    var self = this;
    var text = "<ul>";
    tooltip_data.result.forEach(function(row){
        text += "<li class = " + self.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
    });

    return text;
}

/**
 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
 *
 * @param electionResult election data for the year selected
 */
VotePercentageChart.prototype.update = function(electionResult){
    var self = this;



    // ******* TODO: PART III *******

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .votesPercentage class to style your bars.



   //console.log((electionResult[0].I_PopularPercentage));


    var voteData = [[{vPOP: electionResult[0].I_PopularPercentage,diff:0,y0:0,vNominee:electionResult[0].I_Nominee},
                    {vPOP:electionResult[0].D_PopularPercentage,diff:-1,y0:0,vNominee:electionResult[0].D_Nominee},
                    {vPOP:electionResult[0].R_PopularPercentage,diff:1,y0:"",vNominee:electionResult[0].R_Nominee}]];



     tracker = 0;

    for(l=0; l<voteData[0].length; l++){
       if(voteData[0][l].vPOP == "" ){

           voteData[0][l].y0 = 0 ;
           tracker = tracker + 0;

       }else{
           voteData[0][l].y0 = tracker ;
           tracker = tracker + +parseFloat(voteData[0][l].vPOP);
       }
    }

    iVote = voteData[0][0].vPOP;
    dVote = voteData[0][1].vPOP;
    rVote = voteData[0][2].vPOP;

    iNominee = voteData[0][0].vNominee;
    dNominee = voteData[0][1].vNominee;
    rNominee = voteData[0][2].vNominee;



    //Use this tool tip element to handle any hover over the chart
    tip = d3.tip().attr('class', 'd3-tip')
        .direction('s')
        .offset(function() {
            return [0,0];
        })
        .html(function(d) {
            tooltip_data = {
                "result":[
                    {"nominee": dNominee,"votecount": dVote,"percentage": dVote,"party":"D"} ,
                    {"nominee": rNominee,"votecount": rVote,"percentage": rVote,"party":"R"} ,
                    {"nominee": iNominee,"votecount": iVote,"percentage": iVote,"party":"I"}
                ]
            }
            /* pass this as an argument to the tooltip_render function then,
             * return the HTML content returned from that method.
             * */
            return ;
        });


   // console.log("hello oh hello oh one more hello");

    d3.selectAll("#votes-percentage g").remove();
    d3.selectAll("#votes-percentage svg text").remove();

    var svg = d3.select("#votes-percentage svg");

    var yScale = d3.scaleLinear()
        .domain([0, 100]) //changes this to be some of total electoral votes
        .range([0, svg.node().getBoundingClientRect().width-20]);


    // Add a group for each row of data
    var groups = svg.selectAll("#votes-percentage")
        //.data([electionResult[0].I_PopularPercentage,electionResult[0].D_PopularPercentage,electionResult[0].R_PopularPercentage]);
        .data(voteData[0]);

    var groupsEnter = groups.enter()
        .append("g")
        .classed("electoralVotes",true);


    groups = groups.merge(groupsEnter);



    groupsEnter.append("rect")
        .attr("x",function(d,i){
          //  return yScale(d[0].y0)
            console.log("from inside:")
            console.log(d.y0);
             return yScale(d.y0);
        })
        .attr("y", 110)
        .attr("width",function(d,i){


            if((d.vPOP) == ""){
                 console.log("I made inside when I am blank:")
                console.log(0);
                return 0;
            }
            else{
                return(yScale(parseFloat(d.vPOP)))
            }
        })
        .attr("height", 50)
        .attr("class",function(d,i){
            if(d.diff >0){
                return "republican"
            }
            else if(d.diff<0){
                return "democrat"
            }
            else {
                return "independent";
            }
        })



  //  parseFloat(percent) / 100.0

//Drawing middle line
    groups.append("line")
        .attr("x1", svg.node().getBoundingClientRect().width/2)
        .attr("y1", 100)
        .attr("x2", svg.node().getBoundingClientRect().width/2)
        .attr("y2", 180)
        //.classed("middlePoint",true)
        .style("stroke", "#333")
        .style("stroke-width", 1)


//Text for popular vote percentage
    svg.append("text")
        .text("Popular Vote(50%)")
        .attr("x",svg.node().getBoundingClientRect().width/2)
        .attr("y",90)
        .classed("votesPercentageNote", true);


//Independent vote percentage text
    svg.append("text")
        .text(function(){
            if((iVote) == ""){
                return "";
            } else
            {
                return iVote;
            }
        })
        .attr("x",0)
        .attr("y","90")
        .classed("independent", true);


//Democrat vote percentage text
    svg.append("text")
        .text(dVote)
        .attr("x", function(){

            if(iVote == ""){
                return 10;
            } else
            {
                return yScale(parseFloat(iVote)) + 20;
            }

        })
        .attr("y","90")
        .classed("democrat", true);


//Republic vote percentage text
    svg.append("text")
        .text(rVote)
        .attr("x",function(){

            if(iVote == ""){
                return yScale((parseFloat(rVote) + parseFloat(dVote)));
            }else{
                return  yScale(parseFloat(iVote) + parseFloat(rVote) + parseFloat(dVote));
            }

        })
        .attr("y","90")
        .classed("republican", true);


//Independent nominee text
    svg.append("text")
        .text(function(d,i){
            if((iNominee) == ""){
                return "";
            } else
            {
                return iNominee;
            }
        })
        .attr("x",0)
        .attr("y","50")
        .classed("independent", true);


//Republican nominee text
    svg.append("text")
        .text(dNominee)
        .attr("x", function(){

            if(iNominee == ""){
                return 10;
            } else
            {
                //return yScale(parseFloat(iVote)) + 200;
                return svg.node().getBoundingClientRect().width/2 - 75;
            }

        })
        .attr("y","50")
        .classed("democrat", true);

 //Democrat nominee text

    svg.append("text")
        .text(rNominee)
        .attr("x",function(){
            if(iVote == ""){
                return yScale((parseFloat(rVote) + parseFloat(dVote)));
            }else{
                return  yScale(parseFloat(iVote) + parseFloat(rVote) + parseFloat(dVote));
            }

        })
        .attr("y","50")
        .classed("republican", true);











    //Display the total percentage of votes won by each party
    //on top of the corresponding groups of bars.
    //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning details about this mark on top of this bar
    //HINT: Use .votesPercentageNote class to style this text element

    //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
    //then, vote percentage and number of votes won by each party.

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

};
