(function () {
  document.addEventListener('DOMContentLoaded', function () {
    console.log("timeline-2 active");

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

    function zoom(svg) {
      const extent = [[margin.left, margin.top], [width - margin.right, height - margin.top]];

      svg.call(d3.zoom()
        .scaleExtent([1, 8])
        .translateExtent(extent)
        .extent(extent)
        .on("zoom", zoomed));

      function zoomed(event) {
        xScale.range([margin.left, width - margin.right].map(d => event.transform.applyX(d)));
        svg.selectAll("circle.dot").attr("cx", d => xScale(d.month)).attr("width", xScale.bandwidth());
        svg.selectAll(".xAxis").call(xAxis);
      }
    }

    const svg = d3.select("#svgOutput")
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("preserveAspectRatio", "xMidYMid meet")
      .call(zoom);



    //
    // Do stuff
    //

    // Data initialization

    function Datapoint(author, month, work) {
      this.author = author;
      this.month = month;
      this.work = work;
    }

    let datasetArray = [];

    for (let i = 0; i < dataset.length; i++) {
      const author = dataset[i].author;

      dataset[i].details.forEach((item) => {
        const month = item.month;
        const work = item.work;

        datasetArray.push(new Datapoint(author, month, work));
      })
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
      .attr('r', () => xScale.bandwidth() * 0.5)
      .attr('fill-opacity', 1);


  });
})();
