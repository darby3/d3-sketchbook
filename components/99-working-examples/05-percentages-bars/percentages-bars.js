(function () {
  document.addEventListener('DOMContentLoaded', function () {
    console.log("vax-rate-chart-3 active");

    // Debug mode?

    const debug = false;

    // Config

    const width = 600;
    const height = 300;
    const margin = {
      "top": 20,
      "bottom": 30,
      "left": 40,
      "right": width / 4 + 40
    }

    const yScaleTarget = 100;

    // Useful functions

    function getPercentage(part, total) {
      return Math.round(part / total * 1000) / 10;
    }

    // Data initialization - bars

    function Datapoint(i, data) {
      this.group = data.group;
      this.part = data.part;
      this.total = data.total;
      this.percentage = getPercentage(data.part, data.total);
    }

    let datasetArray = [];

    for (let i = 0; i < dataset.length; i++) {
      datasetArray.push(new Datapoint(i, dataset[i]));
    }

    // Data initialization - totals

    function TotalsObject(data) {
      const totalsVax = d3.sum(data, d => d.part);
      const totalsPop = d3.sum(data, d => d.total);

      this.totalsVax = totalsVax;
      this.totalsPop = totalsPop;
      this.totalsPercentage = getPercentage(totalsVax, totalsPop);
    }

    let totalsObj = new TotalsObject(datasetArray);

    // Set up scales

    const xScale = d3.scaleBand()
      .domain(datasetArray.map(d => d.group))
      .range([margin.left, width - margin.right])
      .paddingInner(0.15)
      .paddingOuter(0.1);

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

    // Timeline variables and transition functions

    const barDuration = 750;
    const barsOverlap = barDuration / 2;

    const tBars = svg.transition()
      .ease(d3.easeCircleOut);
    const tPercentages = svg.transition()
      .ease(d3.easeCircleOut);
    const tTot = svg.transition()
      .ease(d3.easeQuadInOut);

    // Create and draw the bars

    const bars = svg.selectAll("rect.bar")
      .data(datasetArray)
      .join('rect');

    bars.append('title')
      .text((d) => `Percentage for ${d.group}: ${d.percentage}`)

    bars.attr('class', 'bar')
      .attr('data-id', (d) => d.id)
      .attr('data-percentage', (d) => (d.percentage))
      .attr('x', (d) => xScale(d.group))
      .attr('width', () => xScale.bandwidth())
      .attr("y", (d) => yScale(0))
      .attr('fill-opacity', 0);

    bars.transition(tBars)
      .duration(barDuration)
      .delay((d, i) => ((i + 1) * (barDuration - barsOverlap)))
      .attr("y", (d) => yScale(d.percentage))
      .attr('height', (d) => yScale(0) - yScale(d.percentage))
      .attr('fill-opacity', 1);

    // Create and draw the percentages

    const barsTotalTime = bars.size() * barDuration - (bars.size() - 1) * barsOverlap;
    const percentageDuration = 1000;
    const percentageOverlap = percentageDuration / 2;
    const percentageDelay = (i) => barsTotalTime + (i * (percentageDuration - percentageOverlap));

    const percentageLabels = svg.selectAll("text.title")
      .data(datasetArray)
      .join("text");

    percentageLabels.text((d) => `${d.percentage}%`)
      .attr('class', 'title')
      .attr("x", (d) => xScale(d.group) + xScale.bandwidth() / 2)
      .attr("y", () => height - margin.bottom - 20)
      .attr('fill-opacity', 0);

    percentageLabels.transition(tPercentages)
      .delay((d, i) => percentageDelay(i))
      .duration(percentageDuration)
      .attr('fill-opacity', 1)
      .attr("y", () => height - margin.bottom - 10);

    // Create and draw the total percentage call-out box information.
    // We set up an svg group and transform it over into the right-side
    // space, so everything is relative to that group's position.
    // If we turn on "debug" mode, above, we outline this space with a box.

    const calloutsPos = {
      x: width - margin.right + 28,
      y: margin.top + 30,
      width: width - (width - margin.right + 28) - 20,
    }

    const lineY = 68;
    const lineYheight = 4;

    const percentageTotalTime = percentageLabels.size() * percentageDuration - (percentageLabels.size() - 1) * percentageOverlap;
    const chartTotalTime = barsTotalTime + percentageTotalTime;

    const calloutContainer = svg.append('g')
      .attr('transform', `translate(${calloutsPos.x}, ${calloutsPos.y})`);
    const lineDuration = 1000;
    const textDuration = 1000;

    if (debug) {
      calloutContainer.append("rect")
        .attr('height', `${height - calloutsPos.y - margin.bottom}`)
        .attr('width', `${calloutsPos.width}`)
        .attr('stroke', 'blue')
        .attr('fill', 'none');
    }

    // Fun Line

    const gratuitousLine = calloutContainer.append('rect');

    gratuitousLine.attr('x', `${calloutsPos.width / 2}`)
      .attr('fill', 'var(--lightgray)')
      .attr('y', lineY)
      .attr('width', 0)
      .attr('height', lineYheight)
      .transition(tTot)
      .delay(chartTotalTime)
      .duration(lineDuration)
      .attr('x', '0')
      .attr('width', `${calloutsPos.width}`)

    // Text label.
    // We wrap the text in a group so we can position and line-break them.
    // We wrap all that in a clip path, then animation the position of the
    // actual text, so it appears to "slide" out of the separator line.

    calloutContainer.append("clipPath")
      .attr("id", "label-clip")
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", calloutsPos.width)
      .attr("height", 68);

    const calloutLabel = calloutContainer.append("g");

    calloutLabel.attr('class', 'calloutLabel')
      .attr("clip-path", "url(#label-clip)")
      .attr('fill-opacity', '1');

    calloutLabel.call(g => {
      g.append('text')
        .attr('dx', `${calloutsPos.width / 2}`)
        .attr('dy', `${35 + 50}`)
        .text('Total Group')
        .transition(tTot)
        .delay(chartTotalTime + 500)
        .duration(textDuration)
        .attr('dy', '35');

      g.append('text')
        .attr('dx', `${calloutsPos.width / 2}`)
        .attr('dy', `${55 + 50}`)
        .text('Percentage')
        .transition(tTot)
        .delay(chartTotalTime + 500)
        .duration(textDuration)
        .attr('dy', '55');
    });

    // Percentage

    const percentageDYval = 120;

    calloutContainer.append("clipPath")
      .attr("id", "perc-clip")
      .append("rect")
      .attr("x", 0)
      .attr("y", lineY + lineYheight)
      .attr("width", calloutsPos.width)
      .attr("height", 100);

    const calloutPercentage = calloutContainer.append("text");

    calloutPercentage.attr('class', 'percentageLabel')
      .attr("clip-path", "url(#perc-clip)")
      .attr('dx', `${calloutsPos.width / 2}`)
      .attr('dy', `${percentageDYval - 45}`)
      .text(`${totalsObj.totalsPercentage}%`)
      .style('fill-opacity', '0')
      .attr('font-size', '2.75rem');

    calloutPercentage.transition(tTot)
      .delay(chartTotalTime + 1000)
      .duration(textDuration)
      .style('fill-opacity', '1')
      .attr('dy', `${percentageDYval}`);
  });
})();
