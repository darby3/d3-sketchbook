(function () {
  document.addEventListener('DOMContentLoaded', function () {
    console.log("bar-chart-3 active");

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
    const padding = 60;

    const svg = d3.select("#svgOutput")
      .append("svg");

    svg.attr("viewBox", [0, 0, w, h])
      .attr("preserveAspectRatio", "xMidYMid meet");

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(datasetArray, (d) => d.count)])
      .range([25, h - padding]);

    // converting to a scale for the width of the bars?

    const xScale = d3.scaleBand()
      .domain(datasetArray.map(d => d.property))
      .range([0, w])
      .padding(0.05)
      .round(true);

    svg.selectAll("rect.bar")
      .data(datasetArray)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => xScale(d.property))
      .attr("y", (d) => h - yScale(d.count))
      .attr("width", () => xScale.bandwidth())
      .attr("height", (d) => yScale(d.count))
      .attr("data-count", (d) => (d.count))
      .on("click", barClickHandler);

    svg.selectAll("text.title")
      .data(datasetArray)
      .enter()
      .append("text")
      .attr('class', 'title')
      .text((d) => (d.property))
      .attr("x", (d) => xScale(d.property) + 3)
      .attr("y", () => h - 10)
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
      .attr("y", (d) => h - yScale(d.count))
      .style('font-size', '0.75rem')
      .style('font-weight', 'bold')
      .style('font-family', 'Courier New')
      .style('fill', 'navy')
      .attr('transform', (d, i) => {
        return `rotate(-90 ${xScale(d.property) + 3} ${h - yScale(d.count) - 7}) `
      });


    function barClickHandler(d, i) {
      console.log("click handled");

      if (svg.select('.selected').size() > 0) {
        svg.select('.selected').classed('selected', false);
      }

      d3.select(this).classed('selected', true);

      svg.select('text.bigLabel').remove();

      svg.append('text')
        .attr("x", "10")
        .attr("y", "70")
        .attr('class', 'bigLabel')
        .style('font-family', 'Georgia, serif')
        .style('font-size', '4rem')
        .style('font-weight', 'bold')
        .style('fill', d.property)
        .text(d.property + " ∙ " + d.count);
    }


  });
})();
