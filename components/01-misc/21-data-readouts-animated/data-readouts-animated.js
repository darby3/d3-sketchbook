(function () {
  document.addEventListener('DOMContentLoaded', function () {
    console.log("data-readouts-animated active");
    console.log("data-readouts-animated active for real");

    // config

    const width = 1000;
    const height = 400;
    const margin = {
      "top": 20,
      "bottom": 30,
      "left": 40,
      "right": 300
    }

    // data input and massaging

    let datasetArray = [];

    datasetArray.push({
      id: 1,
      count: dataset[0].number,
      total: dataset[0].total
    })

    for (let i = 1; i < dataset.length; i++) {
      datasetArray.push({
        id: dataset[i].id,
        count: dataset[i].number,
        total: dataset[i].total
      })
    }

    // scales

    const xScale = d3.scaleBand()
      .domain(datasetArray.map(d => d.id))
      .range([margin.left, width - margin.right])
      .paddingInner(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(datasetArray, (d) => d.total)])
      .range([height - margin.bottom, margin.top]);

    // svg output

    const svg = d3.select("#svgOutput")
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("preserveAspectRatio", "xMidYMid meet");

    // axes

    const xAxis = d3.axisBottom(xScale)
      .tickValues(xScale.domain().filter(function (d, i) {
        // return (i % 2)
        return true
      }));

    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("transform", "translate(" + margin.left + ", 0)")
      .call(yAxis)
      .call(g => g.selectAll(".domain")
        .attr('stroke', '#c6c4c4'))
      .call(g => g.selectAll(".tick text")
        .attr('fill', '#787272'))
      .call(g => g.selectAll(".tick line")
        .attr('stroke', '#c6c4c4'));

    svg.append("g")
      .attr("transform", "translate(0, " + (height - margin.bottom) + ")")
      .call(xAxis)
      .call(g => g.selectAll(".domain")
        .attr('stroke', '#787272'))
      .call(g => g.selectAll(".tick text")
        .attr('fill', '#787272'))
      .call(g => g.selectAll(".tick line")
        .remove());


    // add some bars

    svg.selectAll("rect.bar")
      .data(datasetArray)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => xScale(d.id))
      .attr("y", (d) => yScale(d.total))
      .attr("width", () => xScale.bandwidth())
      .attr("height", (d) => yScale(0) - yScale(d.total))
      .attr("data-total", (d) => (d.total))
      .on("click", barClickHandler)
      .append('title')
      .text((d) => `id: ${d.id} / total: ${d.total}`);


    // create a line function and use it to draw a line

    const line = d3.line()
      .x(d => xScale(d.id))
      .y(d => yScale(d.count))

    svg.append('path')
      .attr('d', line(datasetArray))
      .attr('fill', 'none')
      .attr('stroke', '#363232')
      .attr('stroke-width', '1')
      .attr('stroke-linejoin', 'round')
      .attr('transform', 'translate(' + xScale.bandwidth() / 2 + ', 0)');

    // plot the points as basic circles

    svg.selectAll("circle.point")
      .data(datasetArray)
      .enter()
      .append('circle')
      .attr('class', 'point')
      .attr('cx', (d) => xScale(d.id) + xScale.bandwidth() / 2)
      .attr("cy", (d) => yScale(d.count))
      .attr("r", '4')
      .attr("fill", "#a6192e")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", "0")
      .append('title')
      .text((d) => `id: ${d.id} / count: ${d.count}`);

    svg.append('text')
      .attr("x", width - margin.right + 64)
      .attr("y", margin.top + 96)
      .attr('class', 'smallLabel')
      .style('font-family', 'Verdana, sans-serif')
      .style('font-size', '1rem')
      .style("fill", "#000000")
      .text("date goes above");

    svg.append('text')
      .attr("x", width - margin.right + 64)
      .attr("y", margin.top + 224)
      .attr('class', 'smallLabel')
      .style('font-family', 'Verdana, sans-serif')
      .style('font-size', '1rem')
      .style("fill", "#000000")
      .text("tests performed");

    svg.append('text')
      .attr("x", width - margin.right + 64)
      .attr("y", margin.top + 352)
      .attr('class', 'smallLabel')
      .style('font-family', 'Verdana, sans-serif')
      .style('font-size', '1rem')
      .style("fill", "#000000")
      .text("positive results");

    function barClickHandler(d, i) {
      console.log("click handled");

      const tIn = d3.transition()
        .duration(1000)
        .ease(d3.easeSinOut);

      if (svg.select('.selected').size() > 0) {
        svg.select('.selected').classed('selected', false);
      }

      d3.select(this).classed('selected', true);

      console.log();

      if (svg.selectAll('text.bigLabel').size()) {
        // remove everything, then go
        svg.selectAll('text.bigLabel')
          .attr('dx', '0')
          .transition()
          .duration(500)
          .ease(d3.easeSinIn)
          .delay((d, i) => i * 250)
          .style('fill-opacity', '0')
          .attr('dx', '40')
          .remove()
          .end()
            .then(() => {
              console.log("we done");
              addNewDataReadouts(d);
            });
      } else {
        addNewDataReadouts(d);
      }

      function addNewDataReadouts(d) {
        svg.append('text')
          .attr('class', 'bigLabel')
          .attr('id', 'idData')
          .style('font-family', 'Verdana, sans-serif')
          .style('font-size', '4rem')
          .style('font-weight', 'bold')
          .style("fill", "#000000")
          .style("fill-opacity", "0")
          .attr("x", width - margin.right + 64)
          .attr("y", margin.top + 64)
          .attr("dx", "-40")
          .text(d.id)
          .transition()
          .duration(500)
          .ease(d3.easeSinOut)
          .delay(0)
          .style("fill-opacity", "1")
          .attr("dx", "0");

        svg.append('text')
          .attr('class', 'bigLabel')
          .style('font-family', 'Verdana, sans-serif')
          .style('font-size', '4rem')
          .style('font-weight', 'bold')
          .style("fill", "#000000")
          .style("fill-opacity", "0")
          .text(d.total)
          .attr("x", width - margin.right + 64)
          .attr("y", margin.top + 192)
          .attr("dx", "-40")
          .transition()
          .duration(500)
          .ease(d3.easeSinOut)
          .delay(250)
          .style("fill-opacity", "1")
          .attr("dx", "0");

        svg.append('text')
          .attr('class', 'bigLabel')
          .style('font-family', 'Verdana, sans-serif')
          .style('font-size', '4rem')
          .style('font-weight', 'bold')
          .style("fill", "#000000")
          .style("fill-opacity", "0")
          .text(`${d.count} (${(d.percentage * 100).toFixed(2)}%)`)
          .attr("x", width - margin.right + 64)
          .attr("y", margin.top + 320)
          .attr('dx', '-40')
          .transition()
          .duration(500)
          .ease(d3.easeSinOut)
          .delay(500)
          .style("fill-opacity", "1")
          .attr('dx', '0');
      }

    }


  });
})();
