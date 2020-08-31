(function () {
  document.addEventListener('DOMContentLoaded', function () {
    console.log("basic-dashboard active");

    // Config

    const width = 1000;
    const height = 400;
    const margin = {
      "top": 20,
      "bottom": 45,
      "left": 50,
      "right": 300
    }

    // Data initialization

    const months = {
      1: 'January',
      2: 'February',
      3: 'March',
      4: 'April',
      5: 'May',
      6: 'June',
      7: 'July',
      8: 'August',
      9: 'September',
      10: 'October',
      11: 'November',
      12: 'September'
    }

    let datasetArray = [];

    for (let i = 0; i < dataset.length; i++) {
      const reportDate = dataset[i].dateEnd.split('/');

      datasetArray.push({
        id: i,
        start: dataset[i].dateStart,
        end: dataset[i].dateEnd,
        dateRange: dataset[i].dateStart + '–' + dataset[i].dateEnd,
        reportMonth: months[reportDate[0]],
        reportDay: reportDate[1],
        reportYear: dataset[i].dateYear || '2020',
        positiveCount: dataset[i].number,
        totalCount: dataset[i].total,
        percentagePositive: dataset[i].number / dataset[i].total
      })
    }

    // Set the top of the y axis to the nearest 100

    let yScaleTarget = d3.max(datasetArray, (d) => d.totalCount);
    while (yScaleTarget % 100) {
      yScaleTarget++;
    }

    // Scales

    const xScale = d3.scaleBand()
      .domain(datasetArray.map(d => d.end))
      .range([margin.left, width - margin.right])
      .paddingInner(0.1)
      .paddingOuter(0.05);

    const yScale = d3.scaleLinear()
      .domain([0, yScaleTarget])
      .range([height - margin.bottom, margin.top]);

    // Create the svg container

    const svg = d3.select("#svgOutput")
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("preserveAspectRatio", "xMidYMid meet");

    // Create and draw the axes

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(5);

    const gx = svg.append("g")
      .attr('class', 'xAxis')
      .attr("transform", "translate(0, " + (height - margin.bottom) + ")")
      .call(xAxis)
      .call(g => g.selectAll(".tick text")
        .attr('dy', '18'))
      .call(g => g.selectAll(".tick line")
        .attr('y2', '10'));

    const gy = svg.append("g")
      .attr('class', 'yAxis')
      .attr("transform", "translate(" + margin.left + ", 0)")
      .call(yAxis);

    // Draw the bars

    svg.selectAll("rect.bar")
      .data(datasetArray)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.end))
      .attr('y', (d) => yScale(d.totalCount))
      .attr('width', () => xScale.bandwidth())
      .attr('height', (d) => yScale(0) - yScale(d.totalCount))
      .attr('data-total', (d) => (d.totalCount))
      .attr('data-available', (d) => (d.totalCount > 0))
      .attr('data-id', (d) => d.id)
      .on('click', barClickHandler)
      .append('title')
      .text((d) => `Total tests for ${d.end}: ${d.totalCount}`);

    // Create a line function and use it to draw the positives line

    const line = d3.line()
      .defined((d) => (yScale(0) - yScale(d.totalCount) > 0))
      .x(d => xScale(d.end))
      .y(d => yScale(d.positiveCount));

    const positivesLine = svg.append('path')
      .attr('d', line(datasetArray))
      .attr('class', 'trendLine')
      .attr('transform', 'translate(' + xScale.bandwidth() / 2 + ', 0)');

    // Draw positive counts circles

    svg.selectAll("circle.point")
      .data(datasetArray)
      .enter()
      .append('circle')
      .attr('class', 'point')
      .attr('cx', (d) => xScale(d.end) + xScale.bandwidth() / 2)
      .attr('cy', (d) => yScale(d.positiveCount))
      .attr('r', (d) => yScale(0) - yScale(d.positiveCount) >= 0 ? '4' : '0')
      .append('title')
      .text((d) => `Positive tests for ${d.end}: ${d.positiveCount}`);

    svg.selectAll("circle.point")
      .each(function (p) {
        if (p.totalCount === 0) {
          d3.select(this).remove();
        }
      });

    // Draw data readout shapes and labels
    // TODO: there's some magic numbers in here which could be turned into config vars, probably

    const dataAlignments = {
      rectX: width - margin.right + 48,
      rectH: height / 3 - 24,
      textX: (margin.right - 70) / 2
    }

    // Date box

    const dataDatebox = svg.append("g")
      .attr('id', 'dateBox')
      .attr('class', 'statsBox statsBox--plain')
      .attr('transform', `translate(${dataAlignments.rectX}, ${margin.top})`);

    dataDatebox.call(g => g.append('text')
      .attr('class', 'smallLabel')
      .attr('dx', `${dataAlignments.textX}`)
      .attr('dy', '35')
      .text('For the week reported on')
      .attr('fill-opacity', '0')
      .transition()
      .duration(750)
      .ease(d3.easeSinOut)
      .delay(0)
      .style('fill-opacity', '1')
    );

    // Data Readout boxes

    const rectT = d3.transition().duration(500).ease(d3.easeSinOut);

    const dataReadoutRects = svg.append('g')
      .attr('id', 'dataReadoutRects')
      .attr('transform', `translate(${dataAlignments.rectX}, ${margin.top + height / 3 - 32})`);

    const dataTestsBox = dataReadoutRects.call(g => g.append('rect')
      .attr('id', 'testsBox')
      .attr('width', margin.right - 70)
      .attr('height', `${dataAlignments.rectH}`)
      .attr('rx', `8`)
      .attr('transform', `translate(0, -20)`)
      .style('fill-opacity', '0')
      .transition(rectT)
      .delay(500)
      .style('fill-opacity', '1')
      .attr('transform', `translate(0, 0)`)
      .end()
      .then(() => {
        svg.select('#dataReadoutRects')
          .call(g => g.append('text')
            .attr('class', 'smallLabel')
            .attr('dx', `${dataAlignments.textX}`)
            .attr('dy', '82')
            .text('tests processed')
            .style('fill-opacity', '0')
            .transition(rectT)
            .style('fill-opacity', '1')
          )
      })
    );

    const dataResultsBox = dataReadoutRects.call(g => g.append('rect')
      .attr('id', 'resultsBox')
      .attr('width', margin.right - 70)
      .attr('height', `${dataAlignments.rectH}`)
      .attr('rx', `8`)
      .attr('y', `${dataAlignments.rectH + 12}`)
      .attr('transform', `translate(0, 20)`)
      .style('fill-opacity', '0')
      .transition(rectT)
      .delay(1000)
      .style('fill-opacity', '1')
      .attr('transform', `translate(0, 0)`)
      .end()
      .then(() => {
        // Send a click to every bar, in order to activate the last active bar.
        // TODO: find a better way to do this
        svg.selectAll('rect.bar[data-available="true"]').dispatch('click');

        svg.select('#dataReadoutRects')
          .call(g => g.append('text')
            .attr('class', 'smallLabel')
            .attr('dx', `${dataAlignments.textX}`)
            .attr('dy', '181')
            .text('positive results')
            .style('fill-opacity', '0')
            .transition(rectT)
            .style('fill-opacity', '1')
          )
      })
    );

    // Zoom in/out button

    const zoomButton = document.querySelector("#zoomToggle");
    zoomButton.setAttribute('data-zoomed', 'false');
    zoomButton.addEventListener('click', zoomButtonClickHandler);

    // Update data readouts when bars are clicked

    function barClickHandler(d) {
      if (svg.select('.selected').size() > 0) {
        svg.select('.selected').classed('selected', false);
      }

      d3.select(this).classed('selected', true);

      // TODO: rename classes more better
      svg.selectAll('.bigLabel').remove();
      svg.selectAll('.mediumLabel').remove();
      svg.selectAll('.dateLabel').remove();

      // Data readout transition
      const t = d3.transition().duration(450).ease(d3.easeSinOut);

      // Draw the report date
      dataDatebox.call(g => g.append('text')
        .attr('class', 'dateLabel')
        .attr('dx', `${dataAlignments.textX}`)
        .attr('dy', '60')
        .attr('fill-opacity', '0')
        .text(`${d.reportMonth} ${d.reportDay}, ${d.reportYear}`)
        .transition(t)
        .delay(250)
        .attr('dy', '70')
        .style('fill-opacity', '1')
      );

      // Draw the tests performed number
      dataReadoutRects.call(g => g.append('text')
        .attr('class', 'bigLabel')
        .attr('dx', `${dataAlignments.textX}`)
        .attr('dy', '35')
        .style('fill-opacity', '0')
        .text(d.totalCount)
        .transition(t)
        .delay(500)
        .style('fill-opacity', '1')
        .attr('dy', '50')
      );

      // Draw the positive test results number
      dataReadoutRects.call(g => g.append('text')
        .attr('class', 'bigLabel')
        .attr('dx', `${dataAlignments.textX}`)
        .attr('dy', '148')
        .attr('fill-opacity', '0')
        .text(`${d.positiveCount}`)
        .transition(t)
        .delay(750)
        .attr('dy', '158')
        .style('fill-opacity', '1')
      );

      // Draw the positive test percentage number
      dataReadoutRects.call(g => g.append('text')
        .attr('class', 'mediumLabel')
        .attr('dx', `${dataAlignments.textX}`)
        .attr('dy', '220')
        .attr('fill-opacity', '0')
        .text(`(${(d.percentagePositive * 100).toFixed(2)}%)`)
        .transition(t)
        .delay(1000)
        .attr('dy', '210')
        .style('fill-opacity', '1')
      )
    }

    // Update chart when zoom button clicked

    function zoomButtonClickHandler() {
      if (this.getAttribute('data-zoomed') === 'false') {
        this.setAttribute('data-zoomed', 'true');
        const maxNumber = d3.max(datasetArray, (d) => d.positiveCount);
        svg.update([0, maxNumber + 4]);
        this.innerText = "Zoom Out";
      } else {
        this.setAttribute('data-zoomed', 'false');
        svg.update([0, d3.max(datasetArray, (d) => d.totalCount)]);
        this.innerText = "Zoom In";
      }
    }

    // Add an update method (or update the update method?) on the svg object.
    // Basically: this is where we handle all the cool transitions in the chart.

    Object.assign(svg, {
      update(domain) {
        // Are we zoomed?
        const zoomed = zoomButton.getAttribute('data-zoomed');

        // Transition functions
        const t = svg.transition().duration(1250).ease(d3.easeCubicInOut);
        const tFast = svg.transition().duration(750).ease(d3.easeCubicInOut);

        // Update the yScale domain
        yScale.domain(domain);

        // Redraw the yAxis
        gy.transition(t).call(yAxis, yScale);

        // Redraw the positives trend line

        const lineStrokeWidth = (zoomed === 'true') ? "3" : "1.5";

        positivesLine.transition(t)
          .attr("d", line(datasetArray))
          .style("stroke-width", lineStrokeWidth);

        // Redraw the circles

        const dotRadius = (zoomed === 'true') ? '15' : '4';
        const strokeWidth = (zoomed === 'true') ? '1.5' : '1';
        const circleFill = (zoomed === 'true') ? '#fff' : '#efefef';

        svg.selectAll("circle.point").transition(t)
          .attr("cy", (d) => yScale(d.positiveCount))
          .attr("r", dotRadius)
          .style("stroke-width", strokeWidth)
          .style("fill", circleFill);

        // Redraw the bars

        const barsFill = (zoomed === 'true') ? '#efefef' : '#c6c4c4';
        const barsStroke = (zoomed === 'true') ? '#c6c4c4' : '#fff';

        svg.selectAll("rect.bar").transition(tFast)
          .attr("height", (d) => yScale(0) - yScale(d.totalCount))
          .attr("y", (d) => yScale(d.totalCount))
          .style("fill", barsFill)
          .style("stroke", barsStroke);

        // Draw the positives counts?
        if (zoomed === "true") {
          svg.selectAll('text.positivesCounts')
            .data(datasetArray)
            .enter()
            .append('text')
            .attr('class', 'positivesCounts')
            .attr('x', (d) => xScale(d.end) + xScale.bandwidth() / 2)
            .attr('y', (d) => yScale(d.positiveCount))
            .attr('dy', '-4')
            .attr('fill-opacity', '0')
            .text((d) => `${d.positiveCount}`)
            .transition(t)
            .delay((d, i) => (i * 100) + 750)
            .attr('dy', '4')
            .attr('fill-opacity', '1');

          svg.selectAll("text.positivesCounts")
            .each(function (p) {
              if (p.totalCount === 0) {
                d3.select(this).remove();
              }
            });
        } else {
          svg.selectAll("text.positivesCounts")
            .transition()
            .duration(100)
            .attr('fill-opacity', '0')
            .end()
            .then(() => {
              svg.selectAll("text.positivesCounts")
                .remove();
            });
        }

      }
    })

    document.querySelector('#fullscreenGo').addEventListener('click', function () {
      document.querySelector("#svgOutput").requestFullscreen();
    })
  });
})();
