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
      .domain(datasetArray.map(d => d.end))
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
        // return !(i % 2)
        return true
      }));

    const yAxis = d3.axisLeft(yScale).ticks(5);

    const gx = svg.append("g")
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

    const gy = svg.append("g")
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
      .attr('x', (d, i) => xScale(d.end))
      .attr("y", (d) => yScale(d.total))
      .attr("width", () => xScale.bandwidth())
      .attr("height", (d) => yScale(0) - yScale(d.total))
      .attr("data-total", (d) => (d.total))
      .attr("data-available", (d) => (d.total > 0))
      .on("click", barClickHandler)
      .append('title')
      .text((d) => `Total tests for ${d.end}: ${d.total}`);


    // create a line function and use it to draw a line

    const line = d3.line()
      .defined((d) => {
//        return yScale(0) - yScale(d.count) > 0;
        return yScale(0) - yScale(d.total) > 0;
      })
      .x(d => xScale(d.end))
      .y(d => yScale(d.count));

    const chillPath = svg.append('path')
      .attr('d', line(datasetArray))
      .attr('class', 'trendLine')
      .attr('fill', 'none')
      .attr('transform', 'translate(' + xScale.bandwidth() / 2 + ', 0)');

    // plot the points as basic circles

    svg.selectAll("circle.point")
      .data(datasetArray)
      .enter()
      .append('circle')
      .attr('class', 'point')
      .attr('cx', (d) => xScale(d.end) + xScale.bandwidth() / 2)
      .attr("cy", (d) => yScale(d.count))
      .attr("r", (d) => {
//        return (yScale(0) - yScale(d.count) > 0 ? '4' : '0');
        return (yScale(0) - yScale(d.count) >= 0 ? '4' : '0');
      })
      .append('title')
      .text((d) => `Positive tests for ${d.end}: ${d.count}`);

    svg.selectAll("circle.point")
      .each(function(p) {
        const d3this = d3.select(this);
//        if (p.count === 0) {
        if (p.total === 0) {
          d3.select(this).remove();
        }
      })

    svg.selectAll('rect.bar[data-available="true"]').dispatch('click');


    // draw some additional shapes


    svg.append("g")
      .attr('id', 'dateBox')
      .attr('class', 'statsBox statsBox--plain')
      .attr("transform", `translate(${width - margin.right + 48}, ${margin.top})`)
      .call(g => g.append('text')
        .attr('class', 'smallLabel')
        .attr('dx', `${(margin.right - 70) / 2}`)
        .attr('dy', "35")
        .text("For the week reported on")
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
              .text("tests processed")
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
          .text(d.end)
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

    // Zoom updater

    const triggerButton = document.querySelector("#zoomToggle");
    triggerButton.setAttribute('data-zoomed', 'false');

    triggerButton.addEventListener('click', function () {
      if (this.getAttribute('data-zoomed') === 'false') {
        this.setAttribute('data-zoomed', 'true');
        const maxNumber = d3.max(datasetArray, (d) => d.count);
        svg.update([0, maxNumber + 2]);
        this.innerText = "Zoom Out";
      } else {
        this.setAttribute('data-zoomed', 'false');
        svg.update([0, d3.max(datasetArray, (d) => d.total)]);
        this.innerText = "Zoom In";
      }
    })

    Object.assign(svg, {
      update(domain) {
        console.log("updating");

        // we need this
        const zoomed = triggerButton.getAttribute('data-zoomed');

        const t = svg.transition()
          .duration(1250)
          .ease(d3.easeCubicInOut);

        const tFast = svg.transition()
          .duration(750)
          .ease(d3.easeCubicInOut);

        yScale.domain(domain);

        // reset the y axis
        gy.transition(t)
          .call(yAxis, yScale);

        // zoom the line
        chillPath.transition(t)
          .attr("d", line(datasetArray))
          .style("stroke-width", (zoomed === 'true') ? "3" : "1.5");

        // zoom the circles?

        const dotRadius = (zoomed === 'true') ? '8' : '4';
        const strokeWidth = (zoomed === 'true') ? '1.5' : '1';
        const circleFill = (zoomed === 'true') ? '#fff' : '#efefef';

        svg.selectAll("circle.point").transition(t)
          .attr("cy", (d) => yScale(d.count))
          .attr("r", dotRadius)
          .style("stroke-width", strokeWidth)
          .style("fill", circleFill);

        // zoom the rects?

        if (zoomed === "true") {
          svg.selectAll("rect.bar").transition(tFast)
            .attr("height", (d) => yScale(0) - yScale(d.total))
            .attr("y", (d) => yScale(d.total))
            .style("fill", '#efefef')
            .style("stroke", '#c6c4c4');
        } else {
          svg.selectAll("rect.bar").transition(tFast)
            .attr("height", (d) => yScale(0) - yScale(d.total))
            .attr("y", (d) => yScale(d.total))
            .style("fill", '#c6c4c4')
            .style("stroke", '#fff');
        }
      }
    })

  });
})();
