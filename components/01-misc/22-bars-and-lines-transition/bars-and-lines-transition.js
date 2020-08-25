(function () {
  document.addEventListener('DOMContentLoaded', function () {
    console.log("bars-and-lines-transition active");

    // config

    const width = 1000;
    const height = 400;
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
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(datasetArray, (d) => d.total)])
      .range([height - margin.bottom, margin.top]);

    // svg output

    const svg = d3.select("#svgOutput")
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("preserveAspectRatio", "xMidYMid meet");

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
      .append('title')
      .text((d) => `id: ${d.id} / total: ${d.total}`);


    // create a line function and use it to draw a line

    const line = d3.line()
      .x(d => xScale(d.id))
      .y(d => yScale(d.count))

    const chillPath = svg.append('path')
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

    // axes

    const xAxis = d3.axisBottom(xScale)
      .tickValues(xScale.domain().filter(function (d, i) {
        // return (i % 2)
        return true
      }));

    const yAxis = d3.axisLeft(yScale);

    // const zy = yScale.copy(); // x, but with a new domain.

    const gy = svg.append("g")
      .attr("transform", "translate(" + margin.left + ", 0)")
      .call(yAxis, yScale);
    // .call(g => g.selectAll(".domain")
    //   .attr('stroke', '#c6c4c4'))
    // .call(g => g.selectAll(".tick text")
    //   .attr('fill', '#787272'))
    // .call(g => g.selectAll(".tick line")
    //   .attr('stroke', '#c6c4c4'));

    const gx = svg.append("g")
      .attr("transform", "translate(0, " + (height - margin.bottom) + ")")
      .call(xAxis)
      .call(g => g.selectAll(".domain")
        .attr('stroke', '#787272'))
      .call(g => g.selectAll(".tick text")
        .attr('fill', '#787272'))
      .call(g => g.selectAll(".tick line")
        .remove());


    const triggerButton = document.querySelector("#seeDotsOnly");
    triggerButton.setAttribute('data-zoomed', 'false');

    triggerButton.addEventListener('click', function () {
      console.log(this);

      if (this.getAttribute('data-zoomed') === 'false') {
        this.setAttribute('data-zoomed', 'true');
        const maxNumber = d3.max(datasetArray, (d) => d.count);
        svg.update([0, maxNumber + 2]);
      } else {
        this.setAttribute('data-zoomed', 'false');
        svg.update([0, d3.max(datasetArray, (d) => d.total)])
      }
    })


    Object.assign(svg, {
      update(domain) {
        console.log("updating");

        // we need this
        const zoomed = triggerButton.getAttribute('data-zoomed');

        const t = svg.transition()
          .duration(1250)
          .ease(d3.easeCubicIn);
        yScale.domain(domain);

        // reset the y axis
        gy.transition(t)
          .call(yAxis, yScale);

        // zoom the line
        chillPath.transition(t)
          .attr("d", line(datasetArray));

        // zoom the circles?

        const dotRadius = (zoomed === 'true') ? '12' : '4';
        const strokeWidth = (zoomed === 'true') ? '2' : '0';
        const strokeColor = (zoomed === 'true') ? '#363232' : '#fff';

        svg.selectAll("circle.point").transition(t)
          .attr("cy", (d) => yScale(d.count))
          .attr("r", dotRadius)
          .style("stroke-width", strokeWidth)
          .style("stroke", strokeColor);

        // zoom the rects?

        if (zoomed === "true") {
          svg.selectAll("rect.bar").transition(t)
            .attr("height", (d) => yScale(0) - yScale(d.total))
            .attr("y", (d) => yScale(d.total))
            .style("fill", '#efefef')
            .style("stroke", '#c6c4c4');
        } else {
          svg.selectAll("rect.bar").transition(t)
            .attr("height", (d) => yScale(0) - yScale(d.total))
            .attr("y", (d) => yScale(d.total))
            .style("fill", '#c6c4c4')
            .style("stroke", '#fff');
        }
      }
    })


  });
})();
