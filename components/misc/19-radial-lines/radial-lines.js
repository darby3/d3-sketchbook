(function () {
  document.addEventListener('DOMContentLoaded', function () {
    console.log("radial-lines active");

    // line coordinate helper functions

    const pi = Math.PI;

    // function getXcoord(angle, length) {
    //   return Math.sqrt(Math.pow(length, 2) - Math.pow(Math.sin(angle * (pi/180)), 2));
    // }
    //
    // function getYcoord(angle, length) {
    //   return Math.sqrt(Math.pow(length, 2) - Math.pow(Math.cos(angle * (pi/180)), 2));
    // }
    //
    function getXcoord(angle, length) {
      return length * Math.cos(angle * (pi/180));
    }

    function getYcoord(angle, length) {
      return length * Math.sin(angle * (pi/180));
    }

    // config

    const width = 1200;
    const height = 800;
    const margin = {
      "top": 10,
      "bottom": 10,
      "left": 10,
      "right": 10
    }

    // data input and massaging

    let datasetArray = [];

    datasetArray.push({
      id: 1,
      count: 600 + dataset[0].number
    })

    for (let i = 1; i < dataset.length; i++) {
      datasetArray.push({
        id: dataset[i].id,
        count: datasetArray[i - 1].count + dataset[i].number
      })
    }

    // main svg output

    const svg = d3.select("#svgOutput")
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("preserveAspectRatio", "xMidYMid meet");

    // colorable background rectangle

    svg.append('rect')
      .attr('class', 'bg')
      .attr('x', margin.left)
      .attr('y', margin.top)
      .attr('height', height - margin.bottom - margin.top)
      .attr('width', width - margin.right - margin.left)
      .attr('stroke', 'darkslategray')
      .attr('stroke-width', '0.25')
      .attr('fill', '#ffffff');


    // scales

    const lengthScale = d3.scaleLinear()
      .domain([0, d3.max(datasetArray, (d) => d.count)])
      .range([0, (height - margin.top - margin.bottom) / 2]);

    const angleScale = d3.scaleLinear()
      .domain([0, d3.max(datasetArray, (d) => d.id)])
      .range([-90, 270]);


    // establish the center of the chart

    const centerX = (width - margin.left - margin.right) / 2 + margin.left;
    const centerY = (height - margin.top - margin.bottom) / 2 + margin.top;

    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', '25')
      .attr('stroke', 'navy')
      .attr('fill', 'none');


    // draw some lines, yeah!

    svg.selectAll('line.datapt')
      .data(datasetArray)
      .enter()
      .append('line')
      .attr('class', 'datapt')
      .attr('x1', centerX)
      .attr('y1', centerY)
      .attr('x2', (d, i) => {
        return getXcoord(angleScale(d.id), lengthScale(d.count)) + centerX;
      })
      .attr('y2', (d, i) => {
        return getYcoord(angleScale(d.id), lengthScale(d.count)) + centerY;
      })
      .attr('fill', 'none')
      .attr('stroke', 'darkslategray')
      .attr('stroke-width', '1.5')
      .attr('stroke-opacity', '0.2');

    // console.log(getXcoord(180, 1));
    // console.log(getYcoord(180, 1));

    console.log(getXcoord(180, 500));
    console.log(getYcoord(180, 500));



    //
    // const xScale = d3.scaleBand()
    //   .domain(datasetArray.map(d => d.id))
    //   .range([margin.left, width - margin.right])
    //   .padding(0);
    //
    // const yScale = d3.scaleLinear()
    //   .domain(d3.extent(datasetArray, d => d.count))
    //   .range([height - margin.bottom, margin.top]);
    //
    //
    // // create an area function and use it to draw an area chart
    //
    // const area = d3.area()
    //   .x(d => xScale(d.id))
    //   .y0(height - margin.bottom)
    //   .y1(d => yScale(d.count));
    //
    // svg.append('path')
    //   .attr('d', area(datasetArray))
    //   .attr('fill', 'mediumvioletred')
    //   .attr('class', 'area-fill');
    //
    // // plot the points as basic circles
    //
    // // svg.selectAll("circle.point")
    // //   .data(datasetArray)
    // //   .enter()
    // //   .append('circle')
    // //   .attr('class', 'point')
    // //   .attr('cx', (d) => xScale(d.id))
    // //   .attr("cy", (d) => yScale(d.count))
    // //   .attr("r", () => xScale.bandwidth() / 2)
    // //   .attr("fill", "white")
    // //   .attr("stroke", "magenta")
    // //   .attr("stroke-width", "1.5")
    // //   .append('title')
    // //   .text((d) => `id: ${d.id} / count: ${d.count}`);
    //
    // // axes
    //
    // const xAxis = d3.axisBottom(xScale)
    //   .tickValues(xScale.domain().filter(function (d, i) {
    //     return !(i % 10)
    //   }));
    // const yAxis = d3.axisLeft(yScale);
    //
    // svg.append("g")
    //   .attr("transform", "translate(" + margin.left + ", 0)")
    //   .call(yAxis);
    //
    // svg.append("g")
    //   .attr("transform", "translate(0, " + (height - margin.bottom) + ")")
    //   .call(xAxis);
    //
    // // let us make it do a trick
    //
    // const fillerButton = document.querySelector('#fillerButton');
    // fillerButton.addEventListener('click', function() {
    //   console.log("fill me up, buttercup");
    //
    //   const newPattern = patternSelector.value;
    //
    //   d3.select('svg')
    //     .selectAll('path.area-fill')
    //     .style('fill', 'url(#' + newPattern +')');
    // })
  });
})();
