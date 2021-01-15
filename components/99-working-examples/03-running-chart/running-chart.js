(function () {
  document.addEventListener('DOMContentLoaded', function () {
    console.log("running-chart active");

    // config

    const width = 1000;
    const height = 400;
    const margin = {
      "top": 20,
      "bottom": 30,
      "left": 40,
      "right": 10
    };

    const running_31_1 = "#99AABF";
    const running_31_2 = "#EDFCFF";
    const running_31_3 = "#383F40";
    const running_31_4 = "#16260F";
    const running_31_5 = "#DFF24B";


    // data input and massaging

    let datasetArray = [];

    datasetArray.push({
      id: 0,
      count: 0
    })

    for (let i = 0; i < dataset.length; i++) {
      datasetArray.push({
        id: dataset[i].id,
        count: datasetArray[i].count + dataset[i].number
      })
    }

    // scales

    const xScale = d3.scaleLinear()
      .domain(d3.extent(datasetArray, d => d.id))
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(datasetArray, d => d.count))
      .range([height - margin.bottom, margin.top]);

    // svg output

    const svg = d3.select("#svgOutput")
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("preserveAspectRatio", "xMidYMid meet");

    // axes

    const xAxis = d3.axisBottom(xScale).ticks(width / 200);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("transform", "translate(0, " + (height - margin.bottom) + ")")
      .call(xAxis);

    svg.append("g")
      .attr("transform", "translate(" + margin.left + ", 0)")
      .call(yAxis);

    // create a line function and use it to draw a line

    const line = d3.line()
             .x(d => xScale(d.id))
             .y(d => yScale(d.count))

    svg.append('path')
      .attr('d', line(datasetArray))
      .attr('fill', 'none')
      .attr('stroke', running_31_4)
      .attr('stroke-width', '2.5')
      .attr('stroke-linejoin', 'round');

    // plot the points as basic circles

    svg.selectAll("circle.point")
      .data(datasetArray)
      .enter()
      .append('circle')
      .attr('class', 'point')
      .attr('cx', (d) => xScale(d.id))
      .attr("cy", (d) => yScale(d.count))
      .attr("r", () => 5)
      .attr("fill", running_31_5)
      .attr("stroke", running_31_4)
      .attr("stroke-width", "2.5")
      .append('title')
      .text((d) => `run number: ${d.id} / total mileage: ${d.count}`);

  });
})();
