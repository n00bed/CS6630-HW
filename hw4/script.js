/** Global var to store all match data for the 2014 Fifa cup */
var teamData;

/** Global var for list of all elements that will populate the table.*/
var tableElements;
var test;

/** Variables to be used when sizing the svgs in the table cells.*/
var cellWidth = 70,
    cellHeight = 20,
    cellBuffer = 15,
    barHeight = 20;

/**Set variables for commonly accessed data columns*/
var goalsMadeHeader = 'Goals Made',
    goalsConcededHeader = 'Goals Conceded';

/** Setup the scales*/
var goalScale;

/**Used for games/wins/losses*/
var gameScale;


/**Color scales*/
/**For aggregate columns*/
var aggregateColorScale = d3.scaleLinear()
    .domain([0,7])
    .range(['#ece2f0', '#016450']);

/**For goal Column*/
var goalColorScale = d3.scaleQuantize()
    .domain([-1, 1])
    .range(['#cb181d', '#034e7b']);

/**json Object to convert between rounds/results and ranking value*/
var rank = {
    "Winner": 7,
    "Runner-Up": 6,
    'Third Place': 5,
    'Fourth Place': 4,
    'Semi Finals': 3,
    'Quarter Finals': 2,
    'Round of Sixteen': 1,
    'Group': 0
};



//For the HACKER version, comment out this call to d3.json and implement the commented out
// d3.csv call below.

d3.json('data/fifa-matches.json',function(error,data){
    teamData = data;
    createTable();
    updateTable();
})



// // ********************** HACKER VERSION ***************************
// /**
//  * Loads in fifa-matches.csv file, aggregates the data into the correct format,
//  * then calls the appropriate functions to create and populate the table.
//  *
//  */
// d3.csv("data/fifa-matches.csv", function (error, csvData) {
//
//    // ******* TODO: PART I *******
//
//
// });
// // ********************** END HACKER VERSION ***************************

/**
 * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
 *
 */
d3.csv("data/fifa-tree.csv", function (error, csvData) {

    //Create a unique "id" field for each game
    csvData.forEach(function (d, i) {
        d.id = d.Team + d.Opponent + i;
    });

    createTree(csvData);


});


/**
 * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
 * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
 *
 */


function createTable() {

// ******* TODO: PART II *******


// Setting Scales
    goalScale = d3.scaleLinear()
        .domain([0, d3.max(teamData, function (d) {
            return d.value[goalsMadeHeader];
        })])
        .range([cellBuffer, 2 * cellWidth - cellBuffer]);


    gameScale = d3.scaleLinear()
        .domain([0, d3.max(teamData, function (d) {
            return d.value['TotalGames'];
        })])
        .range([0, cellWidth - cellBuffer]);


//  Creating xAxis for goal scored, conceded and difference

    var xAxis = d3.axisBottom();
    xAxis.scale(goalScale)


    var svg = d3.select('#goalHeader');
    svg.append("svg")
        .attr("width", cellWidth * 2)
        .attr("height", cellHeight)
        .call(xAxis)

    tableElements = teamData;



// ******* TODO: PART V *******

   isClickedT = 1;
   isClickedG = 1;
   isClickedR = 1;
    isClickedW = 1;
   isClickedL = 1;
   isClickedA = 1;




    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     *
     */
}

function updateTable() {


// ******* TODO: PART III *******



    var tr = d3.select("tbody").selectAll("tr")
        .data(tableElements)

        tr.exit().remove();

       var trEnter =  tr.enter().append("tr");

    trEnter.append("th");

    tr.attr("class",function(d,i){
        d.value.type;
    })

    tr = trEnter.merge(tr)
    tr.attr("class",function(d){
        return d.value.type;
    });

        tr.on("click",function(d,i){
            updateList(i);
        })

  var th = tr.select("th")
      .text(function(d){

          if(d.value.type != "aggregate")
            return 'x' +  d.key
          else
              return d.key;
      })

    var td = tr.selectAll("td")
        .data(function(d){
            return [
                { "type": d.value['type'], "vis": "goals", "value": {"scored":d.value[goalsMadeHeader],"conceeded":d.value[goalsConcededHeader],"delta":d.value['Delta Goals']}},
                { "type": d.value['type'], "vis": "text", "value": d.value['Result'].label },
                { "type": d.value['type'], "vis": "bar", "value": d.value['Wins'] },
                { "type": d.value['type'], "vis": "bar", "value": d.value['Losses'] },
                { "type": d.value['type'], "vis": "bar", "value": d.value['TotalGames'] },
            ];
        });


    var tdEnter = td.enter().append('td');
    td = tdEnter.merge(td);

  /* Text for the rounds */
    tdEnter.text(function(d){
        if(d.vis == 'text'){
            return d.value;
        }
    })

    td.filter(function(d){return d.vis == 'text'}).text(function(d){
            return d.value;

    })


    /*Barchart for the total games wins and loss*/
    var barChart =   tdEnter.filter(function (d) {
        return d.vis == 'bar'
    })

        barChart.append("svg")
        .attr("width", cellWidth)
        .attr("height", cellHeight)
            .append("rect")

        barChart.select("svg").append("text")

    var barChartNew =   td.filter(function (d) {
        return d.vis == 'bar'
    })

        barChartNew.select("svg").select("rect")
            .attr("width",function(d){
            return gameScale(d.value);
        })
        .attr("height",cellHeight)
        .attr("fill",function (d) {
            return aggregateColorScale(d.value) ;
        })


    barChartNew.select("svg").select("text")
        .text(function(d){
            return d.value;
        })
        .attr("x",function(d){
            return gameScale(d.value) - cellHeight/2;
        })
        .attr("y",cellHeight/2)
        .attr("fill","white")
        .attr("transform","translate(2,2)")
        .attr("font-size","12px");


    /* Goal chart and circles */

    var goalChart =  tdEnter.filter(function (d) {
        return d.vis == 'goals'
        })
        goalChart.append("svg")
        .attr("width", cellWidth*2)
        .attr("height", cellHeight)
            .append("rect")


    goalChart
        .select("svg")
        .append("circle")
        .attr("class", "goalCircle1")


    goalChart
        .select("svg")
        .append("circle")
        .attr("class", "goalCircle2")

    //var td = tdEnter.merge(td);

    var goalChartNew =  td.filter(function (d) {
        return d.vis == 'goals'
    })

    goalChartNew.select('svg')
        .select("rect")
        .attr("width", function(d){return Math.abs(goalScale(d.value.scored) -goalScale(d.value.conceeded))})
        .attr("height", cellHeight/2)
        .attr("height",function(d){
            if(d.type == 'aggregate'){
                return cellHeight/2
            }else
                return cellHeight/3
        })
        .attr("fill", function(d){
            if( (d.value.scored-  d.value.conceeded)> 0){
                return "#6794AF"
            }else
            {
                return "#E07477"
            }
        })
        .attr("class","goalBar")
        .attr('transform', function(d,i){
            if(d.type == 'aggregate'){
                if(d.type == "aggregate" && d.value.delta<0){
                    return ('transform','translate ('+(goalScale(d.value.scored))+','+ cellBuffer/2 + ')');
                }else if(d.type == "aggregate" && d.value.delta>=0){
                    return ('transform','translate ('+(goalScale(d.value.conceeded))+','+ cellBuffer/2 + ')');
                }
                if(d.type != "aggregate" && (goalScale(d.value.scored) -(goalScale(d.value.conceeded) )<0)){
                    return ('transform','translate ('+(goalScale(d.value.scored))+','+ cellBuffer/2 + ')');

                }else if(d.type != "aggregate" && (goalScale(d.value.scored) -(goalScale(d.value.conceeded) )>=0)){
                    return ('transform','translate ('+(goalScale(d.value.conceeded))+','+ cellBuffer/2 + ')');
                }
            }else{
                if(d.type == "aggregate" && d.value.delta<0){
                    return ('transform','translate ('+(goalScale(d.value.scored))+','+ cellBuffer/1.5 + ')');
                }else if(d.type == "aggregate" && d.value.delta>=0){
                    return ('transform','translate ('+(goalScale(d.value.conceeded))+','+ cellBuffer/1.5 + ')');
                }
                if(d.type != "aggregate" && (goalScale(d.value.scored) -(goalScale(d.value.conceeded) )<0)){
                    return ('transform','translate ('+(goalScale(d.value.scored))+','+ cellBuffer/1.5 + ')');

                }else if(d.type != "aggregate" && (goalScale(d.value.scored) -(goalScale(d.value.conceeded) )>=0)){
                    return ('transform','translate ('+(goalScale(d.value.conceeded))+','+ cellBuffer/1.5 + ')');
                }
            }

        })


    goalChartNew
        .select("svg")
        .select(".goalCircle1")
        .attr("cx", function(d){
            return goalScale(d.value.scored);
        })
        .attr("cy", 12.5)
       // .attr("fill","#364e74")
        .attr("fill",function(d){
            if(d.type == 'aggregate'){
                return "#364e74"
            }else{
                return "#FFFFFF"
            }
        })
        .attr("r",5)
        .attr("stroke-width",function(d){
            if(d.type != 'aggregate'&& (Math.abs(goalScale(d.value.scored)-goalScale(d.value.conceeded))!= 0)){
                return 2
            }else
                return 0
        })
        .attr("stroke", "#364e74");


    goalChartNew
        .select("svg")
        .select(".goalCircle2")
        .attr("cx", function(d){
            return goalScale(d.value.conceeded);
        })
        .attr("cy", 12.5)

        .attr("fill",function(d){

            if(Math.abs(goalScale(d.value.scored)-goalScale(d.value.conceeded))== 0){
                return  '#808080'
            }else if((Math.abs(goalScale(d.value.scored)-goalScale(d.value.conceeded))!= 0) & d.type == 'aggregate'){
                return "#be2714"
            }else{
                return "#FFFFFF"
            }

        }).attr("r",5)
        .attr("stroke-width",function(d){
            if((d.type != 'aggregate') && (Math.abs(goalScale(d.value.scored)-goalScale(d.value.conceeded))!= 0)){
                return 2
            }else
                return 0
        })
        .attr("stroke", "#be2714");



    var headersTeam = d3.select("th");
    headersTeam.on("click", function(d) {
        collapseList();
        console.log(d3.select(this).text());

        tableElements.sort(function (a, b) {
            var nameA = a.key.toLowerCase(), nameB = b.key.toLowerCase();
            if(isClickedT % 2 == 0){
                if(nameA <nameB)
                    return -1
                if(nameA > nameB)
                    return 1
                return 0

            }else {
                if (nameA < nameB)
                    return 1
                if (nameA > nameB)
                    return -1

                return 0
            }
        })

        if(d3.select(this).text() == 'Team' ){isClickedT++}
        console.log(isClickedT);
        console.log(tableElements);
        updateTable();

    })


    var headers = d3.select("#matchTable").selectAll("thead td")

    headers.on("click", function (d) {
        collapseList();
        sortClick = d3.select(this).text();
        console.log(tableElements);
        console.log("HEYHEHEHE:");
        console.log(tableElements[0].value['Delta Goals'])

        tableElements.sort(function (a, b) {

            if(sortClick == 'Goals'){
                if(isClickedG %2 == 0){

                    return a.value['Delta Goals'] - b.value['Delta Goals']

                    //return a.value['Delta Goals'] - b.value['Delta Goals'];
                }else
                {

                    return b.value['Delta Goals'] -  a.value['Delta Goals']
                }

            }
            else if(sortClick == 'Round/Result'){
                if(isClickedR % 2 == 0){
                    console.log(sortClick);
                    return a.value['Result'].ranking - b.value['Result'].ranking;
                }
                else
                {

                    return b.value['Result'].ranking - a.value['Result'].ranking;
                }
            }
            else if(sortClick == 'Wins'){
                if(isClickedW % 2 == 0){

                    return a.value['Wins']-b.value['Wins'];
                }
                else{

                    return b.value['Wins']-a.value['Wins'];
                }
            }

            else if(sortClick == 'Losses'){
                if(isClickedL % 2 == 0){

                    return a.value['Losses']-b.value['Losses'];
                }
                else{
                    return b.value['Losses']-a.value['Losses'];
                }
            }

            else if(sortClick == 'Total Games'){
                if(isClickedA % 2 == 0){

                    return a.value['TotalGames']-b.value['TotalGames'];
                }
                else{
                    return b.value['TotalGames']-a.value['TotalGames'];
                }
            }
        })
        if(sortClick  == 'Goals' ){isClickedG++}
        if(sortClick  == 'Round/Result' ){isClickedR++}
        if(sortClick  == 'Wins' ){isClickedW++}
        if(sortClick  == 'Losses' ){isClickedL++}
        if(sortClick  == 'Total Games' ){isClickedA++}
        updateTable();

    })

    d3.select("#matchTable").selectAll("tr")
        .on("mouseover",function(d,i){
            console.log(d.key)

            if(d.value.type == 'aggregate')
            {
                updateTree(d.key);
            }

        })
        .on("mouseout",function(d,i){
            clearTree();
        });


}


/**
 * Collapses all expanded countries, leaving only rows for aggregate values per country.
 *
 */
function collapseList() {

    // ******* TODO: PART IV *******
tableElements = [];
    for(var i=0; i < teamData.length; i++){
        tableElements.push(teamData[i]);
    }

  updateTable();
}

/**
 * Updates the global tableElements variable, with a row for each row to be rendered in the table.
 *
 */
function updateList(i) {

    // ******* TODO: PART IV *******


     if(tableElements[i+1].value.type != 'game'){
         for(var j=0;j< tableElements[i].value.games.length; j++ ){
             tableElements.splice(i+1,0,tableElements[i].value.games[j]);
         }
     }else{
         tableElements.splice(i+1,tableElements[i].value.games.length )
     }
    updateTable();

}

/**
 * Creates a node/edge structure and renders a tree layout based on the input data
 *
 * @param treeData an array of objects that contain parent/child information.
 */
function createTree(treeData) {

    // ******* TODO: PART VI *******

    var svg = d3.select("#tree"),
        g = svg.append("g")
            .attr("transform", "translate(100,50)");

    var tree = d3.tree()
        .size([500,900])



    var root = d3.stratify()
        .id(function(d) { return d.id; })
        .parentId(function(d) {
            if(d.ParentGame != ''){
                return treeData[d.ParentGame].id;
            }else
            {
                return '';
            }
        })
        (treeData);

    tree(root);

     link = g.selectAll(".link")
        .data(root.descendants())
        .enter().append("path")
        .attr("class","link")
        .attr("d",function(d){

          if(d.id == "Germany26")
            {
                return ''
            }else
            {
                return "M" + d.y/2 + "," + d.x*1.3
                    + "C" + (d.y + d.parent.y)/4  + "," + d.x*1.3
                    + " " + (d.y + d.parent.y)/4 + "," + d.parent.x*1.3
                    + " " + d.parent.y/2 + "," + d.parent.x*1.3;
            }
        })

//*Code Reference: https://bl.ocks.org/mbostock/9d0899acb5d3b8d839d9d613a9e1fe04*/

    var node = g.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", function(d){
            return d.data["Wins"]==0 ? "node loser" : "node winner";
        })
        .attr("transform", function(d) { return "translate(" + d.y/2 + "," + d.x*1.3 + ")"; })

    node.append("circle")
        .attr("r", 5)


    node.append("text")
        .attr("dy", 3)
        .attr("x", function(d) { return d.children ? -8 : 8; })
        .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
        .text(function(d) { return d.data['Team']; });
    
}


/**
 * Updates the highlighting in the tree based on the selected team.
 * Highlights the appropriate team nodes and labels.
 *
 * @param team a string specifying which team was selected in the table.
 */
function updateTree(row) {

    // ******* TODO: PART VII *******

   pathHighlight = link.filter(function(d){
       return(d.data["Team"] == row && d.data['Wins'] == 1)
   })

    pathHighlight.classed("selected",true);
}

/**
 * Removes all highlighting from the tree.
 */
function clearTree() {

    // ******* TODO: PART VII *******
    pathHighlight.classed("selected",false);


}