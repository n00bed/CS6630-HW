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
        .domain([0, d3.max(teamData,function (d){
            //return 18
            return d.value[goalsMadeHeader];
        })])
        .range([cellBuffer, 2 * cellWidth - cellBuffer]);


    gameScale =   d3.scaleLinear()
        .domain([0, d3.max(teamData,function (d){
            return d.value['TotalGames'];
        })])
        .range([0, cellWidth - cellBuffer]);


//  Creating xAxis for goal scored, conceded and difference

    var xAxis = d3.axisBottom();
    xAxis.scale(goalScale)

    console.log(goalScale(18))
    var svg = d3.select('#goalHeader');
    svg.append("svg")
        .attr("width",cellWidth*2)
        .attr("height",cellHeight )
        .call(xAxis)

    tableElements = teamData;



// ******* TODO: PART V *******

}
/**
 * Updates the table contents with a row for each element in the global variable tableElements.
 *
 */


function updateTable() {

// ******* TODO: PART III *******

    var tr = d3.select("tbody").selectAll("tr")
        .data(tableElements)
        .enter()
        .append("tr")
        .on("click",function(d,i){
            updateList(i);

        });

    console.log("printing tr:");
    console.log(tr);



    var td = tr.selectAll("td")
        .data(function(d){
            return [
                { "type": d.value['type'], "vis": "text", "value": d.key },
                { "type": d.value['type'], "vis": "goals", "value": {"scored":d.value[goalsMadeHeader],"conceeded":d.value[goalsConcededHeader],"delta":d.value['Delta Goals']}},
                //  { "type": d.value['type'], "vis": "goals", "value": d.value[goalsMadeHeader] },
                { "type": d.value['type'], "vis": "text", "value": d.value['Result'].label },
                { "type": d.value['type'], "vis": "bar", "value": d.value['Wins'] },
                { "type": d.value['type'], "vis": "bar", "value": d.value['Losses'] },
                { "type": d.value['type'], "vis": "bar", "value": d.value['TotalGames'] },
            ];
        });

     var tdEnter = td.enter()
            .append('td')



    tdEnter.text(function(d){
        if(d.vis == 'text'){
            return d.value;
        }
    })


    console.log("printing td before filter:");
    console.log(td);



    var barChart =   tdEnter.filter(function (d) {
        return d.vis == 'bar'
    })
        .append("svg")
        .attr("width", cellWidth)
        .attr("height", cellHeight)


    var rect = barChart.append("rect")
        .attr("width",function(d){
            return gameScale(d.value);
        })
        .attr("height",cellHeight)

        .attr("fill",function (d) {
            return aggregateColorScale(d.value) ;
        })
      //  .attr("transform","translate(0,6)");


    barChart.append("text")
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


    var goalChart =  tdEnter.filter(function (d) {
        return d.vis == 'goals'
    }).append("svg")
        .attr("width", cellWidth*2)
        .attr("height", cellHeight)


    goalChart.append("rect")
        .attr("width",function(d,i){
            return goalScale(Math.abs(d.value.delta))-12.5 ;
        })
        .attr("height",cellHeight/2)
        // .attr("fill","#6794AF")
        .attr("fill", function(d){
            if(d.value.delta >0){
                return "#6794AF"
            }else
            {
                return "#E07477"
            }
        })
        .attr("class","goalBar")
        .attr('transform', function(d,i){
            if(d.value.delta<0){
                return ('transform','translate ('+(goalScale(d.value.scored))+','+ cellBuffer/2 + ')');
            }else if(d.value.delta>=0){
                return ('transform','translate ('+(goalScale(d.value.conceeded))+','+ cellBuffer/2 + ')');
            }
        })


    goalChart
        .append("circle")
        .attr("cx", function(d){
            return goalScale(d.value.scored);//subtracting by 2.5 since 5 is the radius
        })
        .attr("cy", 12.5)
        .attr("class", "goalCircle")
        .attr("fill","#364e74")

    goalChart
        .append("circle")
        .attr("cx", function(d){
            return goalScale(d.value.conceeded); //subtracting by 2.5 since 5 is the radius
        })
        .attr("cy", 12.5)
        .attr("class", "goalCircle")
        //  .attr("fill","#be2714")
        .attr("fill",function(d){
            if(d.value.delta == 0){
                return  '#808080'
            }else{
                return "#be2714"
            }
        });

    var td = tdEnter.merge(td);



console.log("td");
console.log(td);
}


/**
 * Collapses all expanded countries, leaving only rows for aggregate values per country.
 *
 */
function collapseList() {

    // ******* TODO: PART IV *******


}

/**
 * Updates the global tableElements variable, with a row for each row to be rendered in the table.
 *
 */
function updateList(i) {

    // ******* TODO: PART IV *******

 /*
    console.log( tableElements[i]);
    console.log("games ==================>")
    console.log(tableElements[i].value.games.length);

    var game = [];
    for(var j=0; j<tableElements[i].value.games.length; j++)
    {
       // console.log('x'+tableElements[i].value.games[j].key);
        game.push('x'+tableElements[i].value.games[j].key)
    }

  tableElements.splice(i,0,tableElements[i].value.games);

  console.log("after splicing");
  console.log(tableElements);

  console.log(tableElements[i].value.games[0]);

*/

    //console.log(tableElements[i].value.games.length);

    for(var j=0;j< tableElements[i].value.games.length; j++ ){

        tableElements.splice(i+1,0,tableElements[i].value.games[j]);
    }

 //   console.log(tableElements);
 //   tableElements.splice(i+1,0,tableElements[i].value.games[0]);
   updateTable();
   console.log(tableElements);

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

    console.log("Printing root eight below here==========>");
    console.log(root);


    var link = g.selectAll(".link")
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


}

/**
 * Removes all highlighting from the tree.
 */
function clearTree() {

    // ******* TODO: PART VII *******


}