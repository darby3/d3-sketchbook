(function () {
  document.addEventListener('DOMContentLoaded', function () {
    console.log("bar-chart-2 active");

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

    svg.selectAll("rect.bar")
      .data(datasetArray)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => {
        return i * (w / datasetArray.length) + 2;
      })
      .attr("y", (d) => {
        return h - yScale(d.count);
      })
      .attr("width", () => {
        return (w / datasetArray.length) - 4;
      })
      .attr("height", (d) => {
        return yScale(d.count);
      })
      .attr("data-count", (d) => (d.count))
      .on("click", barClickHandler);

    svg.selectAll("text.title")
      .data(datasetArray)
      .enter()
      .append("text")
      .attr('class', 'title')
      .text((d) => (d.property))
      .attr('x', (d, i) => {
        return i * (w / datasetArray.length) + 10;
      })
      .attr("y", (d) => {
        return h - 10;
      })
      .style('font-family', 'Courier New')
      .style('font-size', '0.75rem')
      .style('font-weight', 'bold')
      .style('fill', 'white');

    svg.selectAll("text.count")
      .data(datasetArray)
      .enter()
      .append("text")
      .attr('class', 'count')
      .text((d) => (d.count))
      .attr('x', (d, i) => {
        return i * (w / datasetArray.length) + 20;
      })
      .attr("y", (d) => {
        return h - yScale(d.count) - 10;
      })
      .style('font-size', '0.75rem')
      .style('font-weight', 'bold')
      .style('font-family', 'Courier New')
      .style('fill', 'navy')
      .attr('transform', (d, i) => {
        return `rotate(-90 ${i * (w / datasetArray.length) + 20} ${h - yScale(d.count) - 10}) `
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
