(function () {
  document.addEventListener('DOMContentLoaded', function () {
    console.log("basic-dashboard active");
    console.log("basic-dashboard active for real");

    // config

    const width = 1000;
    const height = 400;
    const margin = {
      "top": 20,
      "bottom": 45,
      "left": 50,
      "right": 300
    }

    // data input and massaging

    let datasetArray = [];

    for (let i = 0; i < dataset.length; i++) {
      datasetArray.push({
        id: i,
        start: dataset[i].dateStart,
        end: dataset[i].dateEnd,
        dateRange: dataset[i].dateStart + '–' + dataset[i].dateEnd,
        count: dataset[i].number,
        total: dataset[i].total,
        percentage: dataset[i].number / dataset[i].total
      })
    }

    // lets set the top of our y axis to the nearest 100th

    let yScaleTarget = d3.max(datasetArray, (d) => d.total);

    while (yScaleTarget % 100) {
      yScaleTarget++;
    }

    // scales

    const xScale = d3.scaleBand()
      .domain(datasetArray.map(d => d.dateRange))
      .range([margin.left, width - margin.right])
      .paddingInner(0.1)
      .paddingOuter(0.05);

    const yScale = d3.scaleLinear()
      .domain([0, yScaleTarget])
      .range([height - margin.bottom, margin.top]);


    // svg output

    const svg = d3.select("#svgOutput")
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("preserveAspectRatio", "xMidYMid meet");

    // axes

    const xAxis = d3.axisBottom(xScale)
      .tickValues(xScale.domain().filter(function (d, i) {
        return !(i % 2)
        // return true
      }));

    const yAxis = d3.axisLeft(yScale).ticks(5);

    svg.append("g")
      .attr("transform", "translate(0, " + (height - margin.bottom) + ")")
      .call(xAxis)
      .call(g => g.selectAll(".domain")
        .attr('stroke', '#787272'))
      .call(g => g.selectAll(".tick text")
        .attr('fill', '#787272')
        .attr('dy', '20')
        .style('font-size', '0.875rem'))
      .call(g => g.selectAll(".tick line")
        .attr('y2', '12'));

    svg.append("g")
      .attr("transform", "translate(" + margin.left + ", 0)")
      .call(yAxis)
      .call(g => g.selectAll(".domain")
        .attr('stroke', '#c6c4c4'))
      .call(g => g.selectAll(".tick text")
        .attr('fill', '#787272'))
      .call(g => g.selectAll(".tick line")
        .attr('stroke', '#c6c4c4'));


    // add some bars

    svg.selectAll("rect.bar")
      .data(datasetArray)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => xScale(d.dateRange))
      .attr("y", (d) => yScale(d.total))
      .attr("width", () => xScale.bandwidth())
      .attr("height", (d) => yScale(0) - yScale(d.total))
      .attr("data-total", (d) => (d.total))
      .attr("data-available", (d) => (d.total > 0))
      .on("click", barClickHandler)
      .append('title')
      .text((d) => `id: ${d.id} / total: ${d.total}`);


    // create a line function and use it to draw a line

    const line = d3.line()
      .defined((d) => {
        return yScale(0) - yScale(d.count) > 0;
      })
      .x(d => xScale(d.dateRange))
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
      .attr('cx', (d) => xScale(d.dateRange) + xScale.bandwidth() / 2)
      .attr("cy", (d) => yScale(d.count))
      .attr("r", (d) => {
        console.log(yScale(d.count));
        return (yScale(0) - yScale(d.count) > 0 ? '4' : '0');
      })
      .attr("fill", "#a6192e")
      .attr("stroke", "#c6c4c4")
      .attr("stroke-width", "1")
      .append('title')
      .text((d) => `id: ${d.id} / count: ${d.count}`);


    // draw some additional shapes


    // d3.selection.prototype.first = function() {
    //   return d3.select(this[0]);
    // };
    // d3.selection.prototype.last = function() {
    //   var last = this.size() - 1;
    //   return d3.select(this[last]);
    // };
    //
    // svg.selectAll('rect.bar[data-available="true"]').last()
    //   .dispatch('click');

    svg.append("g")
      .attr('id', 'dateBox')
      .attr('class', 'statsBox statsBox--plain')
      .attr("transform", `translate(${width - margin.right + 48}, ${margin.top})`)
      .call(g => g.append('text')
        .attr('class', 'smallLabel')
        .attr('dx', `${(margin.right - 70) / 2}`)
        .attr('dy', "35")
        .text("Tests result for")
        .attr("fill-opacity", "0")
        .transition()
        .duration(750)
        .ease(d3.easeSinOut)
        .delay(0)
        .style("fill-opacity", "1")
      );

    svg.append('g')
      .attr('id', 'dataReadoutRects')
      .attr("transform", `translate(${width - margin.right + 48}, ${margin.top + height / 3 - 32})`)
      .call(g => g.append('rect')
        .attr("id", "testsBox")
        .attr("width", margin.right - 70)
        .attr("height", `${height / 3 - 24}`)
        .attr("rx", `8`)
        .attr("transform", `translate(0, -20)`)
        .style("fill-opacity", "0")
        .transition()
        .duration(500)
        .ease(d3.easeSinOut)
        .delay(500)
        .style("fill-opacity", "1")
        .attr("transform", `translate(0, 0)`)
        .end()
        .then(() => {
          svg.select("#dataReadoutRects")
            .call(g => g.append('text')
              .attr('class', 'smallLabel')
              .attr('dx', `${(margin.right - 70) / 2}`)
              .attr('dy', "82")
              .text("tests performed")
              .style("fill-opacity", "0")
              .transition()
              .duration(500)
              .ease(d3.easeSinOut)
              .style("fill-opacity", "1")
            )
        })
      )
      .call(g => g.append('rect')
        .attr("width", margin.right - 70)
        .attr("height", `${height / 3 - 24}`)
        .attr("rx", `8`)
        .attr("y", `${margin.top + height / 3 - 34}`)
        .attr("transform", `translate(0, -20)`)
        .style("fill-opacity", "0")
        .transition()
        .duration(500)
        .ease(d3.easeSinOut)
        .delay(1000)
        .style("fill-opacity", "1")
        .attr("transform", `translate(0, 0)`)
        .end()
        .then(() => {
          const dataAvails = svg.selectAll('rect.bar[data-available="true"]').dispatch('click');

          svg.select("#dataReadoutRects")
            .call(g => g.append('text')
              .attr('class', 'smallLabel')
              .attr('dx', `${(margin.right - 70) / 2}`)
              .attr('dy', "181")
              .text("positive results")
              .style("fill-opacity", "0")
              .transition()
              .duration(500)
              .ease(d3.easeSinOut)
              .style("fill-opacity", "1")
            )
        })
      );

    // Activate the data readouts

    // const dataAvails = svg.selectAll('rect.bar[data-available="true"]').dispatch('click');

    function barClickHandler(d, i) {
      console.log("click handled");

      if (svg.select('.selected').size() > 0) {
        svg.select('.selected').classed('selected', false);
      }

      d3.select(this).classed('selected', true);

      svg.selectAll('.bigLabel').remove();
      svg.selectAll('.mediumLabel').remove();
      svg.selectAll('.dateLabel').remove();

      svg.select("g#dateBox")
        .call(g => g.append('text')
          .attr('class', 'dateLabel')
          .attr('dx', `${(margin.right - 70) / 2}`)
          .attr('dy', "65")
          .attr("fill-opacity", "0")
          .text(d.dateRange)
          .transition()
          .duration(750)
          .ease(d3.easeSinOut)
          .delay(250)
          .attr('dy', "75")
          .style("fill-opacity", "1")
        );

      svg.append("g")
        .attr('id', 'testsBox')
        .attr('class', 'statsBox')
        .attr("transform", `translate(${width - margin.right + 48}, ${margin.top + height / 3 - 16})`)
        .attr("fill-opacity", "0")
        .call(g => g.append('text')
          .attr('class', 'bigLabel')
          .attr('dx', `${(margin.right - 70) / 2}`)
          .attr('dy', "25")
          .text(d.total)
          .transition()
          .duration(750)
          .ease(d3.easeSinOut)
          .delay(500)
          .style("fill-opacity", "1")
          .attr('dy', "35")
        );

      svg.append("g")
        .attr('id', 'positivesBox')
        .attr('class', 'statsBox')
        .attr("transform", `translate(${width - margin.right + 48}, ${margin.top + height / 3 * 2 - 32})`)
        .call(g => g.append('text')
          .attr('class', 'bigLabel')
          .attr('dx', `${(margin.right - 70) / 2}`)
          .attr('dy', "14")
          .attr("fill-opacity", "0")
          .text(`${d.count}`)
          .transition()
          .duration(750)
          .ease(d3.easeSinOut)
          .delay(750)
          .attr('dy', "24")
          .style("fill-opacity", "1")
        )
        .call(g => g.append('text')
          .attr('class', 'mediumLabel')
          .attr('dx', `${(margin.right - 70) / 2}`)
          .attr('dy', "85")
          .attr("fill-opacity", "0")
          .text(`(${(d.percentage * 100).toFixed(2)}%)`)
          .transition()
          .duration(750)
          .ease(d3.easeSinOut)
          .delay(1000)
          .attr('dy', "75")
          .style("fill-opacity", "1")
        )
    }
  });
})();