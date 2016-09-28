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

    console.log("printing csv data: ")
    console.log(csvData);

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
            return 18
            //return d.value[goalsMadeHeader];
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
        .append("tr");

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
        })
        .enter()
        .append('td')

//Populating text for teams and round
    td.text(function(d){
        if(d.vis == 'text'){
            return d.value;
        }
    }).on("click",function(d,i){

      console.log(tableElements[i]);


    })

    console.log("printing td before filter:");
    console.log(td);

  var barChart =   td.filter(function (d) {
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
     });


barChart.append("text")
    .text(function(d){
        return d.value;
    })
    .attr("x",function(d){
        return gameScale(d.value) - 10;


    })
    .attr("y",cellHeight/1.5)
    .attr("fill","white");


 var goalChart =  td.filter(function (d) {
        return d.vis == 'goals'
    }).append("svg")
        .attr("width", cellWidth*2)
        .attr("height", cellHeight)


        goalChart.append("rect")
        .attr("width",function(d,i){
       //     console.log(goalScale(Math.abs(d.value.delta)) +':'+ Math.abs(d.value.delta));
            return goalScale(Math.abs(d.value.delta))  ;
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
         //   .attr("transform","translate(10,8)")

        .attr('transform', function(d,i){
                if(d.value.delta<=0){
                    return ('transform','translate ('+(gameScale(d.value.scored))+','+ cellHeight/2 + ')');
                }else if(d.value.delta>0){
                    return ('transform','translate ('+(gameScale(d.value.conceeded))+','+ cellHeight/2 + ')');
                }
        })


   goalChart
       .append("circle")
       .attr("cx", function(d){
           return goalScale(d.value.scored);
       })
       .attr("cy", 15)
       .attr("class", "goalCircle")
       .attr("fill","#364e74")

    goalChart
        .append("circle")
        .attr("cx", function(d){
            return goalScale(d.value.conceeded);
        })
        .attr("cy", 15)
        .attr("class", "goalCircle")
      //  .attr("fill","#be2714")
        .attr("fill",function(d){
            if(d.value.delta == 0){
                return  '#808080'
            }else{
                return "#be2714"
            }
        })



    console.log(tableElements);
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




}

/**
 * Creates a node/edge structure and renders a tree layout based on the input data
 *
 * @param treeData an array of objects that contain parent/child information.
 */
function createTree(treeData) {

    // ******* TODO: PART VI *******

    var root = d3.stratify()
        .id(function(d) { return d.id; }) //using d.id to get unique idenritfier for each node
        .parentId(function(d) {
            if(d.ParentGame != ''){
                return treeData[d.ParentGame].id;
            }else
            {
                return '';
            }

        })
        (treeData);



    var tree = d3.tree(root);


    console.log(root);
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
