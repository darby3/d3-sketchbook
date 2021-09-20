(function () {
  document.addEventListener('DOMContentLoaded', function () {
    console.log("timeline-3 active");

    // Debug mode?

    const debug = false;

    // Config

    const width = 600;
    const height = 400;
    const margin = {
      "top": 20,
      "bottom": 60,
      "left": 60,
      "right": 40
    }

    const dotRadius = 4;

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
        svg.selectAll("circle.dot")
          .attr("cx", d => xScale(d.month));
        svg.selectAll("line.authorLine")
          .attr('x1', (d) => xScale(d.x1))
          .attr('y1', (d) => yScale(d.y1) + yScale.bandwidth() / 2)
          .attr('x2', (d) => xScale(d.x2))
          .attr('y2', (d) => yScale(d.y2) + yScale.bandwidth() / 2);
        svg.selectAll(".xAxis").call(xAxis);
      }
    }

    const svg = d3.select("#svgOutput")
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("preserveAspectRatio", "xMidYMid meet")
      .call(zoom);

    // Date parser

    const parseTime = d3.timeParse("%Y-%m-%d");

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
    let authorsList = [];

    for (let i = 0; i < dataset.length; i++) {
      const author = dataset[i].author;
      authorsList.push(author);

      dataset[i].details.forEach((item) => {
        const month = parseTime(item.month);
        const work = item.work;

        datasetArray.push(new Datapoint(author, month, work));
      })
    }

    // Set up scales

    const xScale = d3.scaleTime()
      .domain(d3.extent(datasetArray, d => d.month))
      .range([margin.left, width - margin.right]);

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
      .attr("transform", `translate(0, ${(height - margin.bottom)})`)
      .call(xAxis);

    gx.call(g => g.selectAll(".tick text")
      .attr('class', 'x-axis-label')
      .attr("transform", `translate(12, 0) rotate(45)`)
      .attr('dy', '12'));

    const gy = svg.append("g")
      .attr('class', 'yAxis')
      .attr("transform", "translate(" + margin.left + ", 0)")
      .call(yAxis);

    gy.call(g => g.select('.tick:nth-child(2) line').remove());


    // Create and draw the dots

    const clip = svg.append("clipPath")
      .attr("id", "dotsWindow")
      .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom);


    const dotsPanel = svg.append("g")
      .attr('id', 'dotsPanel')
      .attr("clip-path", "url(#dotsWindow)");

    const dots = dotsPanel.selectAll("circle.dot")
      .data(datasetArray)
      .join('circle');

    dots.append('title')
      .text((d) => `Work: ${d.work}`)

    dots.attr('class', 'dot')
      .attr('cx', (d) => xScale(d.month))
      .attr("cy", (d) => yScale(d.author) + yScale.bandwidth() / 2)
      .attr('r', dotRadius)
      .attr('fill-opacity', 1);


    // Create author lines

    const linesData = [];

    authorsList.forEach((author) => {
      console.group(author);

      const thisAuthor = d3.selectAll("circle.dot").filter((d) => d.author === author);
      const data = thisAuthor.data();

      const minIndex = d3.minIndex(data, d => d.month);
      const maxIndex = d3.maxIndex(data, d => d.month);


      const lineDatapoint = {
        'author': author,
        'x1': thisAuthor.filter((d, i) => i === minIndex).datum().month,
        'y1': thisAuthor.filter((d, i) => i === minIndex).datum().author,
        'x2': thisAuthor.filter((d, i) => i === maxIndex).datum().month,
        'y2': thisAuthor.filter((d, i) => i === maxIndex).datum().author,
      }

      linesData.push(lineDatapoint)

      console.groupEnd();
    })

    const lines = dotsPanel.selectAll("line.authorLine")
      .data(linesData)
      .join('line');

    lines
      .attr('x1', (d) => xScale(d.x1))
      .attr('y1', (d) => yScale(d.y1) + yScale.bandwidth() / 2)
      .attr('x2', (d) => xScale(d.x2))
      .attr('y2', (d) => yScale(d.y2) + yScale.bandwidth() / 2)
      .attr('class', 'authorLine');


    dots.raise();

  });
})();
