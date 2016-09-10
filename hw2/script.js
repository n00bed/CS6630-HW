/*globals alert, document, d3, console*/
// These keep JSHint quiet if you're using it (highly recommended!)


window.onload = function(){
    changeData(); 
}

function staircase() {
    // ****** TODO: PART II ******

    var count = document.getElementById('bar1').childElementCount;
    var string = ''; 
    var string2 = ''; 

    for (var i = 0; i< count; i++) {    
        string2 = '<rect width="10" height="'+(i+1)*10 + '" y="0" x="'+i*10+'"></rect>\n'; 
        string = string + string2     
    }
    document.getElementById('bar1').innerHTML = string;  
    //alert(string);           
}

function update(error, data) {
    if (error !== null) {
        alert("Couldn't load the dataset!");
    } else {
        // D3 loads all CSV data as strings;
        // while Javascript is pretty smart
        // about interpreting strings as
        // numbers when you do things like
        // multiplication, it will still
        // treat them as strings where it makes
        // sense (e.g. adding strings will
        // concatenate them, not add the values
        // together, or comparing strings
        // will do string comparison, not
        // numeric comparison).

        // We need to explicitly convert values
        // to numbers so that comparisons work
        // when we call d3.max()
        data.forEach(function (d) {
            d.a = parseInt(d.a);
            d.b = parseFloat(d.b);
        });
    }

    // Set up the scales
    var aScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.a;
        })])
        .range([0, 150]);
    var bScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.b;
        })])
        .range([0, 150]);
    var iScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 110]);

    // ****** TODO: PART III (you will also edit in PART V) ******

    // TODO: Select and update the 'a' bar chart bars

    var bar1svg = d3.select('#bar1').selectAll("rect").data(data); 

    bar1svg .enter().append("rect")
    bar1svg .data(data).transition()
        .duration(2000)
        .attr("x",function(d,i){
            return i *10; 
        })
        .attr("y",0)
        .attr("height", function(d,i){
            return aScale(d.a); 
        })
        .attr("width",10)
        .attr("opacity",1)

    bar1svg .exit().attr("opacity",1)
        .transition()
        .duration(2000)
        .attr("opacity",0).remove(); 

    bar1svg.on("mouseover",function(){
        d3.select(this)
            .attr("fill", "red"); 
    })
    .on("mouseout",function(d,i){
        d3.select(this)
            .attr("fill", "steel blue");
    })


    // TODO: Select and update the 'b' bar chart bars

    var bar2svg = d3.select('#bar2').selectAll("rect").data(data);

    bar2svg.enter().append("rect")
    bar2svg.data(data).transition()
        .duration(2000)
        .attr("x",function(d,i){
            return i *10; 
        })
        .attr("y",0)
        .attr("height", function(d,i){
            return bScale(d.b); 
        })
        .attr("width",10)
        .attr("opacity",1)

    bar2svg.exit().attr("opacity",1)
        .transition()
        .duration(2000)
        .attr("opacity",0).remove(); 

    bar2svg.on("mouseover",function(){
    d3.select(this)
        .attr("fill", "red"); 
    })
    .on("mouseout",function(d,i){
        d3.select(this)
            .attr("fill", "steel blue");
    })

    // TODO: Select and update the 'a' line chart path using this line generator
    var aLineGenerator = d3.line()
        .x(function (d, i) {
            return iScale(i);
        })
        .y(function (d) {
            return aScale(d.a);
        });

    var line1svg = d3.select('#line1').select("path").data(data);

    line1svg.enter().append("path")
    line1svg.transition()
            .duration(2000)
            .attr("d", aLineGenerator(data));

     
    // TODO: Select and update the 'b' line chart path (create your own generator)
    var bLineGenerator = d3.line()
        .x(function (d, i) {
            return iScale(i);
        })
        .y(function (d) {
            return bScale(d.b);
        });

    var line2svg = d3.select('#line2').select("path").data(data); 

    line2svg.enter().append("path")
    line2svg.transition()
            .duration(2000)
            .attr("d", bLineGenerator(data));


    // TODO: Select and update the 'a' area chart path using this line generator
    var aAreaGenerator = d3.area()
        .x(function (d, i) {
            return iScale(i);
        })
        .y0(0)
        .y1(function (d) {
            return aScale(d.a);
        });
    
    var area1svg = d3.select('#area1').select("path").data(data);
    area1svg.enter().append("path")
    area1svg.transition()
            .duration(2000)
            .attr("d", aAreaGenerator(data));
                                

    // TODO: Select and update the 'b' area chart path (create your own generator)

    var bAreaGenerator = d3.area()
        .x(function (d, i) {
            return iScale(i);
        })
        .y0(0)
        .y1(function (d) {
            return aScale(d.b);
        });

    var area2svg = d3.select('#area2').select("path").data(data);

    area2svg.enter().append("path")
    area2svg.transition()
            .duration(2000)
            .attr("d", bAreaGenerator(data));

    // TODO: Select and update the scatterplot points
 var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


   var scatterSvg = d3.select("#scatter").selectAll("circle").data(data); 

    scatterSvg.enter().append("circle")
    scatterSvg
                        .transition()
                        .duration(2000)
                        .attr("cx", function(d,i){
                            return((d.a*10)); 
                        })
                        .attr("cy",function(d,i){
                            return (d.b*10);
                        })
                        .attr("r",5)
     scatterSvg                
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html("[ " + d.a + "," + d.b + " ]")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 30) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      })
      .on("click", function(d){
        console.log("x = " + d.a + " y = " + d.b)
      })
      ;


    scatterSvg.exit()
                        .transition()
                        .duration(2000)
                        .remove(); 



    // ****** TODO: PART IV ******
}

function changeData() {
    // // Load the file indicated by the select menu
    var dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        randomSubset();
    }
    else{
        d3.csv('data/' + dataFile + '.csv', update);
    }


}

function randomSubset() {
    // Load the file indicated by the select menu,
    // and then slice out a random chunk before
    // passing the data to update()
    var dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        d3.csv('data/' + dataFile + '.csv', function (error, data) {
            var subset = [];
            data.forEach(function (d) {
                if (Math.random() > 0.5) {
                    subset.push(d);
                }
            });
            update(error, subset);
        });
    }
    else{
        changeData();
    }
}


//Reference: Liu, W. (2016, May 21). D3 Scatterplot example. Retrieved September 10, 2016, from bl.ocks.org, http://bl.ocks.org/weiglemc/6185069