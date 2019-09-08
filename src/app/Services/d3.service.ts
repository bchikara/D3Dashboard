import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { d } from '@angular/core/src/render3';

@Injectable({
  providedIn: 'root'
})
export class D3Service {

  constructor() { }

  bubblechart(root) {
    //for checking the clcik duration
    var startTime, endTime;

    //color array 
    var color = [["hsl(0, 69%, 48%)", "Under Maintenance"], ["hsl(0, 0%, 58%)", "Working Properly"], ["hsl(195, 100%, 27%)", "Maintenance Required"]]

    //append g in svg
    var svg = d3.select(".svg"),
      margin = 20,
      diameter = +svg.attr("height"),
      g = svg.append("g")
      .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");
   
    //size and padding of circle
    var pack = d3.pack()
      .size([(diameter - margin) / 2, (diameter - margin) / 2])
      .padding(2);

    //tooltip initialize
    var tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("color", "white")
      .style("padding", "8px")
      .style("background-color", "rgba(0, 0, 0, 0.75)")
      .style("border-radius", "6px")
      .style("font", "12px sans-serif")
      .text("tooltip");
    
      //formating data in node hierarchy format
      root = d3.hierarchy(root, (d) => {
        return d.controls
      }).sum(function (d) {
        return d.size;
      })
        .sort(function (a, b) {
          return a.value - b.value;
        });

        console.log(root.links());

      //creating nodes of root data 
      var focus = root,
        nodes = pack(root).descendants(),
        view;
      
      //circle initialize
      var circle = g.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")

        //node--root for super-parent node && node--leaf for leaf node && else node for all nodes
        .attr("class", function (d) {
          return d.parent ? d.children ?
            "node" : "node node--leaf" : "node node--root";
        })

        //color implementation
        .style("fill", function (d) {
          if (d.children) {
            if (d.children.length < 5)
              return "hsl(195, 100%, 27%)"
            else if (d.children.length > 20)
              return "hsl(0, 69%, 48%)";
            else
              return "hsl(0, 0%, 58%)	"
          }
          else { return null; }
        })

        //tooltip implementation
        .on("mouseover", function (d) {
          if (d.children) {

            if (d.children.length < 5)
                tooltip.text(() => { return d.data.name + ":  Maintenance Required " })
            else if (d.children.length > 20)
                tooltip.text(() => { return d.data.name + ":  Under Maintenance" })
            else
                tooltip.text(() => { return d.data.name + ": Working Properly" })
          }
          tooltip.style("visibility", "visible");
        })
        .on("mousemove", function () {
          return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
        })
        .on("mouseout", function () { return tooltip.style("visibility", "hidden"); });
      
      //implementation of Long Click && Normal Click for ZOOM IN
      circle
        .on('mousedown', function (d) { startTime = new Date(); })
        .on('mouseup', function (d) {
          endTime = new Date();
          if ((endTime - startTime) > 200) {
            if (focus !== d) LongClick(d),
              d3.event.stopPropagation();
          }
          else {
            if (focus !== d) NormalClick(d),
              d3.event.stopPropagation();
            }
        });
        
      //for transparent super-parent 
      d3.select('.node').style("fill", "transparent")

     //text inside a circle initialize
      var text = g.selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("class", "label")
        .style("fill-opacity", function (d) { return d.parent === root ? 1 : 0; })
        .style("display", function (d) { return d.parent === root ? "none" : "none"; })
        .transition().duration(2000)
        .text(function (d) {
          return d.data.name.substring(0, d.r);
        });
      
      //for hide the text of super-parent 
      d3.select('.label').style("display", "none")

      var node = g.selectAll("circle,text");
     
      ////implementation of Long Click && Normal Click for ZOOM OUT
      svg.on('mousedown', function (d) { startTime = new Date(); })
        .on('mouseup', function (d) {
          endTime = new Date();
          if ((endTime - startTime) > 200) {
            if (focus !== d) LongClick(root),
              d3.event.stopPropagation();
          }
          else {
            if (focus !== d) NormalClick(root),
              d3.event.stopPropagation();
            console.log("regular click, " + (endTime - startTime) + " milliseconds long");
          }
        });
      
      //for first zoom
      zoomTo([root.x, root.y, root.r * 2 + margin]);
      
      //leends initialize
      var legend = svg.selectAll('.legend')
        .data(color)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function (d, i) {
          return 'translate(' + (1.5 * diameter) + ',' + ((diameter / 3) + i * 40) + ')';
        });
      
      //rectangles of legends
      legend.append('rect').transition().duration(2000)
        .attr('width', 20)
        .attr('height', 20)
        .style('fill', (d) => { return d[0] })
        .style('stroke', (d) => { return d[0] })

      //text of legends
      legend.append('text').transition().delay(1250)
        .attr("class", "legendtext")
        .attr('x', (d) => { return diameter / 20 })
        .attr('y', (d, i) => { return ((diameter / 33) + i * 0.6) })
        .style("font-size", 15)
        .text(function (d) { return d[1]; });

      //function for long click
      function LongClick(d) {
        var focus0 = focus;
        focus = d;
        //transition on zoom In 
        var transition = d3.transition()
          .duration(d3.event.altKey ? 7500 : 750)
          .tween("zoom", function (d) {
            var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
            return function (t) { zoomTo(i(t)); };
          });
        
        //for hiding the label of parent-node
        transition.selectAll(".label")
          .filter(function (d) {
            console.log(d.children !== undefined && d.parent != null)
            return d.children !== undefined && d.parent !== null
          })
          .style("fill-opacity", function (d) {
            return d.parent === focus ? 0 : 0;
          })
          .on("start", function (d) { if (d.parent === focus) this.style.display = "none"; })
          .on("end", function (d) { if (d.parent !== focus) this.style.display = "none"; });

        //showing the label of node--leaf
        transition.selectAll(".label")
          .filter(function (d) {
            console.log(this.attr)
            return d.children === undefined
          })
          .style("fill-opacity", function (d) {
            return d.parent === focus ? 1 : 0;
          })
          .on("start", function (d) { if (d.parent === focus) this.style.display = "inline"; })
          .on("end", function (d) { if (d.parent !== focus) this.style.display = "none"; });
        
        //showing the controls on long click
        d3.selectAll(".node--leaf").
          style("opacity", function (d) {
            return d.parent === focus ? 1 : 0;
          })
        
        //hiding the legends
        d3.selectAll(".legend")
          .transition().delay(750)
          .style("opacity", () => {
            return d.parent === null ? 1 : 0;
          })
      }

      //NormalClick funcion
      function NormalClick(d) {
        var focus0 = focus;
        focus = d;
        //transition on zoomIn
        var transition = d3.transition()
          .duration(d3.event.altKey ? 7500 : 750)
          .tween("zoom", function (d) {
            var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
            return function (t) { zoomTo(i(t)); };
          });
        
          //showing data of parent-node
        transition.selectAll(".label")
          .filter(function (d) {
            return d.children !== undefined && d.parent !== null
          })
          .style("fill-opacity", function (d) {
            return d.parent === focus ? 0 : 1;
          })
          .on("start", function (d) { if (d.parent === focus) this.style.display = "none"; })
          .on("end", function (d) { if (d.parent !== focus) this.style.display = "inline"; });
        
        //hiding data of leaf--node
        transition.selectAll(".label")
          .filter(function (d) {
            return d.children === undefined
          })
          .style("fill-opacity", function (d) {
            return d.parent === focus ? 0 : 0;
          })
          .on("start", function (d) { if (d.parent === focus) this.style.display = "none"; })
          .on("end", function (d) { if (d.parent !== focus) this.style.display = "none"; });
        
        //hiding controls
        d3.selectAll(".node--leaf").
          style("opacity", function (d) {
            return d.parent === focus ? 0 : 0;
          })

        //hiding the legends
        d3.selectAll(".legend")
          .transition().delay(750)
          .style("opacity", () => {
            return d.parent === null ? 1 : 0;
          })
      }
      
      //zoom fuunction
      function zoomTo(v) {
        var k = diameter / v[2]; view = v;
        //transform the circles according the d.x and d.y in hierarchy data
        node.attr("transform", function (d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
        console.log(k)
        //radius of circle
        if (k === 1.9088838268792712||k===1.9088838268792714)
          circle.transition().duration(2000).attr("r", function (d) { return d.r * k; });
        else {
          circle.attr("r", (d) => { return d.r * k; })
        }
      }
   
  }

  remove() {
    //remove all g from svg for creating new chart
    d3.selectAll("g").remove();
    d3.select(".svg3").remove();

  }

  linkChart(){
    var width,height
    var chartWidth, chartHeight
    var margin
    var svg = d3.select("#graph").append("svg").attr("class","svg3")
    var chartLayer = svg.append("g").classed("chartLayer", true)
    
    main()
    
    function main() {
        var range = 100
        var data = {

          //data we get from d3.hierarchy();
            nodes:d3.range(0, range).map(function(d){ return {label: "l"+d ,r:~~d3.randomUniform(8, 28)()}}),
       
            //data we get from d3.hierarchy().links();
            links:d3.range(0, range).map(function(){ return {source:~~d3.randomUniform(range)(), target:~~d3.randomUniform(range)()} })        
        }
        console.log(data)
        setSize(data)
        drawChart(data)    
    }
    
    function setSize(data) {
        width = document.querySelector("#graph").clientWidth
        height = document.querySelector("#graph").clientHeight
        margin = {top:0, left:0, bottom:0, right:0 }
        
        chartWidth = width - (margin.left+margin.right)
        chartHeight = height - (margin.top+margin.bottom)
        console.log(chartHeight,chartWidth)
        svg.attr("width", width).attr("height", height)
        
        
        chartLayer
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("transform", "translate("+[margin.left, margin.top]+")")
            
    }
    
    function drawChart(data) {
        
        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.index }))
            .force("collide",d3.forceCollide( function(d){return d.r + 8 }).iterations(16) )
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(chartWidth / 2, chartHeight / 2))
            .force("y", d3.forceY(0))
            .force("x", d3.forceX(0))
    
        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .enter()
            .append("line")
            .attr("stroke","white")
          
            var tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("color", "white")
            .style("padding", "8px")
            .style("background-color", "rgba(0, 0, 0, 0.75)")
            .style("border-radius", "6px")
            .style("font", "12px sans-serif")
            .text("tooltip");

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(data.nodes)
            .enter().append("circle")

            node.transition().duration(1000).delay(1250)
            .attr("r", function(d){ console.log(d)
               return d.r })
               .attr("fill",(d)=>{
                 if(d.r<=10){
                  return "red"
                 }
                else if(d.r>=25){
                   return "lightblue"
                 }
                 else{
                   return "lightgrey"
                 }
               })

          link.transition().duration(1000).delay(1500)
            .attr("stroke", "black")


            node.call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));    
           
            //tooltip implementation
        node.on("mouseover", function (d) {
          

            if (d.r<=10)
                tooltip.text(() => { return d.label + ":  Maintenance Required " })
            else if (d.r>=24)
                tooltip.text(() => { return d.label + ":  Under Maintenance" })
            else
                tooltip.text(() => { return d.label + ": Working Properly" })
          
          tooltip.style("visibility", "visible");}
        )
        .on("mousemove", function () {
          return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
        })
        .on("mouseout", function () { return tooltip.style("visibility", "hidden"); });
        
        
        var ticked = function() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
    
            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        }  
        
        simulation
            .nodes(data.nodes)
            .on("tick", ticked);
    
        simulation.force("link")
            .links(data.links);    
        
        
        
        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        
        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }
        
        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        } 
                
    }
  }
}
