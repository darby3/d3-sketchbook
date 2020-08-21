(function () {
  document.addEventListener('DOMContentLoaded', function () {
    console.log("bar-chart-5 active");

    // Let's get this party started.
    console.log("Hello from the main app file");

    const button = document.querySelector("#story_submit");

    console.dir(dataset);

    let datasetArray = [];
    for (var prop in dataset) {
      if (Object.prototype.hasOwnProperty.call(dataset, prop)) {
        datasetArray.push({
          'property': prop,
          'count': dataset[prop]
        })
      }
    }

    datasetArray.sort(function (x, y) {
      return d3.ascending(x.count, y.count);
    })

    // the d3 part

    const w = 1000;
    const h = 500;

    // adding a margin object for better control of chart placement
    const margin = {
      "top": 20,
      "bottom": 30,
      "left": 40,
      "right": 10
    }

    const svg = d3.select("#svgOutput")
      .append("svg");

    svg.attr("viewBox", [0, 0, w, h])
      .attr("preserveAspectRatio", "xMidYMid meet");

    // colorable background rectangle

    svg.append('rect')
      .attr('class', 'bg')
      .attr('x', margin.left)
      .attr('y', margin.top)
      .attr('height', h - margin.bottom - margin.top)
      .attr('width', w - margin.right - margin.left)
      .attr('stroke', 'black')
      .attr('stroke-width', '2')
      .style('fill', '#ffffff');

    // converting to a scale for the width of the bars?

    const xScale = d3.scaleBand()
      .domain(datasetArray.map(d => d.property))
      .range([margin.left, w - margin.right])
      .padding(0.05)
      .round(true);

    // inverting the scale gives us the bottom-up y axis

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(datasetArray, (d) => d.count) + 2])
      .range([h - margin.bottom, margin.top]);

    console.log(yScale(0));
    console.log(yScale(1));
    console.log(yScale(25));

    // the y scale now gives us the coordinate of the top of the bar. so we can use that as our y attribute. so to draw
    // the height of the bar we take the yScale of 0, which corresponds to the y coordinate of the bottom of the chart,
    // and subtract the yScale of the data point, giving us the distance from the bottom of the chart to the top of the
    // bar.

    svg.selectAll("rect.bar")
      .data(datasetArray)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => xScale(d.property))
      .attr("y", (d) => yScale(d.count))
      .attr("width", () => xScale.bandwidth())
      .attr("height", (d) => yScale(0) - yScale(d.count))
      .attr("data-count", (d) => (d.count))
      .on("click", barClickHandler);


    svg.selectAll("text.title")
      .data(datasetArray)
      .enter()
      .append("text")
      .attr('class', 'title')
      .text((d) => (d.property))
      .attr("x", (d) => xScale(d.property) + 3)
      .attr("y", () => h - margin.bottom - 5)
      .style('font-family', 'Verdana')
      .style('font-size', '0.75rem')
      .style('font-weight', 'bold')
      .style('fill', 'white');

    svg.selectAll("text.count")
      .data(datasetArray)
      .enter()
      .append("text")
      .attr('class', 'count')
      .text((d) => (d.count))
      .attr("x", (d) => xScale(d.property))
      .attr("y", (d) => yScale(d.count))
      .style('font-size', '0.75rem')
      .style('font-weight', 'bold')
      .style('font-family', 'Courier New')
      .style('fill', 'navy')
      .attr('transform', (d, i) => {
        return `rotate(-90 ${xScale(d.property) + 3} ${yScale(d.count) - 7}) `
      });


    // yAxis

    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("transform", "translate(" + margin.left + ", 0)")
      .call(yAxis);

    // xAxis

    const xAxis = d3.axisBottom(xScale);

    svg.append("g")
      .attr("transform", "translate(0, " + (h - margin.bottom) + ")")
      .call(xAxis);



    function barClickHandler(d, i) {
      console.log("click handled");

      if (svg.select('.selected').size() > 0) {
        svg.select('.selected').classed('selected', false);
      }

      d3.select(this).classed('selected', true);

      svg.select('text.bigLabel').remove();

      svg.append('text')
        .attr("x", margin.left + 8)
        .attr("y", margin.top + 64)
        .attr('class', 'bigLabel')
        .style('font-family', 'Verdana, sans-serif')
        .style('font-size', '4rem')
        .style('font-weight', 'bold')
        .style("fill", "#000000")
        .text(d.count);

      svg.select('rect.bg')
        .style('fill', d.property)
    }


  });
})();
