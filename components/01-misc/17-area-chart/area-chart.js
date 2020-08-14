(function () {
  document.addEventListener('DOMContentLoaded', function () {
    console.log("area-chart active");

    // config

    const width = 1000;
    const height = 700;
    const margin = {
      "top": 20,
      "bottom": 30,
      "left": 40,
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

    // scales

    const xScale = d3.scaleBand()
      .domain(datasetArray.map(d => d.id))
      .range([margin.left, width - margin.right])
      .padding(0);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(datasetArray, d => d.count))
      .range([height - margin.bottom, margin.top]);

    // svg output

    const svg = d3.select("#svgOutput")
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("preserveAspectRatio", "xMidYMid meet");

    // create an area function and use it to draw an area chart

    const area = d3.area()
      .x(d => xScale(d.id))
      .y0(height - margin.bottom)
      .y1(d => yScale(d.count));

    svg.append('path')
      .attr('d', area(datasetArray))
      .attr('fill', 'mediumvioletred');

    // plot the points as basic circles

    // svg.selectAll("circle.point")
    //   .data(datasetArray)
    //   .enter()
    //   .append('circle')
    //   .attr('class', 'point')
    //   .attr('cx', (d) => xScale(d.id))
    //   .attr("cy", (d) => yScale(d.count))
    //   .attr("r", () => xScale.bandwidth() / 2)
    //   .attr("fill", "white")
    //   .attr("stroke", "magenta")
    //   .attr("stroke-width", "1.5")
    //   .append('title')
    //   .text((d) => `id: ${d.id} / count: ${d.count}`);

    // axes

    const xAxis = d3.axisBottom(xScale)
      .tickValues(xScale.domain().filter(function (d, i) {
        return !(i % 10)
      }));
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("transform", "translate(" + margin.left + ", 0)")
      .call(yAxis);

    svg.append("g")
      .attr("transform", "translate(0, " + (height - margin.bottom) + ")")
      .call(xAxis);
  });
})();
