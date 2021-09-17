(function () {
  document.addEventListener('DOMContentLoaded', function () {
    console.log("timeline active");

    // Debug mode?

    const debug = false;

    // Config

    const width = 600;
    const height = 300;
    const margin = {
      "top": 20,
      "bottom": 30,
      "left": 60,
      "right": 40
    }

    // Create the svg container

    const svg = d3.select("#svgOutput")
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("preserveAspectRatio", "xMidYMid meet");

    //
    // Do stuff
    //

    // Data initialization

    function Datapoint(data) {
      this.author = data.author;
      this.month = data.month;
      this.work = data.work;
    }

    let datasetArray = [];

    for (let i = 0; i < dataset.length; i++) {
      datasetArray.push(new Datapoint(dataset[i]));
    }

    // Set up scales

    const xScale = d3.scaleBand()
      .domain(datasetArray.map(d => d.month))
      .range([margin.left, width - margin.right])
      .paddingInner(0.15)
      .paddingOuter(0.1);

    const yScale = d3.scaleBand()
      .domain(datasetArray.map(d => d.author))
      .range([margin.top, height - margin.bottom])
      .paddingInner(0.15)
      .paddingOuter(0.1);

    // Create and draw the axes

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(5);

    const gx = svg.append("g")
      .attr('class', 'xAxis')
      .attr("transform", "translate(0, " + (height - margin.bottom) + ")")
      .call(xAxis);

    gx.call(g => g.selectAll(".tick text")
      .attr('class', 'x-axis-label')
      .attr('dy', '12'));

    gx.call(g => g.selectAll(".tick line").remove());

    const gy = svg.append("g")
      .attr('class', 'yAxis')
      .attr("transform", "translate(" + margin.left + ", 0)")
      .call(yAxis);

    gy.call(g => g.select('.tick:nth-child(2) line').remove());


    // Create and draw the dots

    const dots = svg.selectAll("circle.dot")
      .data(datasetArray)
      .join('circle');

    dots.append('title')
      .text((d) => `Work: ${d.work}`)

    dots.attr('class', 'dot')
      .attr('cx', (d) => xScale(d.month) + xScale.bandwidth() / 2)
      .attr("cy", (d) => yScale(d.author) + yScale.bandwidth() / 2)
      .attr('r', () => xScale.bandwidth() * 0.10)
      .attr('fill-opacity', 1);

    // bars.transition(tBars)
    //   .duration(barDuration)
    //   .delay((d, i) => ((i + 1) * (barDuration - barsOverlap)))
    //   .attr("y", (d) => yScale(d.percentage))
    //   .attr('height', (d) => yScale(0) - yScale(d.percentage))
    //   .attr('fill-opacity', 1);


  });
})();
