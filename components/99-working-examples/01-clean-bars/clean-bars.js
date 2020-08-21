(function () {
  document.addEventListener('DOMContentLoaded', function () {
    console.log("clean-bars active");

    const button = document.querySelector('#trigger');
    // const outputBox = document.querySelector('#outputBox');
    const svgOutput = document.querySelector('#svgOutput');

    button.addEventListener('click', function () {
      const spinnerA = document.createElement('div');
      spinnerA.classList.add('spinner');
      // outputBox.appendChild(spinnerA);

      const spinnerB = document.createElement('div');
      spinnerB.classList.add('spinner');
      svgOutput.appendChild(spinnerB);

      const dataSet = [{
        "id": 1,
        "date": "2020-08-15",
        "count": 835,
        "percentage": 0.0223
      }, {
        "id": 2,
        "date": "2020-11-19",
        "count": 857,
        "percentage": 0.0214
      }, {
        "id": 3,
        "date": "2020-09-05",
        "count": 820,
        "percentage": 0.015
      }, {
        "id": 4,
        "date": "2020-10-21",
        "count": 845,
        "percentage": 0.0155
      }, {
        "id": 5,
        "date": "2020-08-22",
        "count": 879,
        "percentage": 0.0005
      }, {
        "id": 6,
        "date": "2020-11-18",
        "count": 839,
        "percentage": 0.0078
      }, {
        "id": 7,
        "date": "2020-11-09",
        "count": 856,
        "percentage": 0.0167
      }, {
        "id": 8,
        "date": "2020-11-28",
        "count": 859,
        "percentage": 0.0048
      }, {
        "id": 9,
        "date": "2020-09-25",
        "count": 831,
        "percentage": 0.007
      }, {
        "id": 10,
        "date": "2020-11-26",
        "count": 849,
        "percentage": 0.009
      }]


      // outputBox.removeChild(spinnerA);
      svgOutput.removeChild(spinnerB);

      data = dataSet.sort(function (x, y) {
        return d3.ascending(x.date, y.date);
      })

      // d3 version of results

      const w = 1000;
      const h = 400;
      const padding = 40;

      const svg = d3.select("#svgOutput")
        .append("svg");

      svg.attr("viewBox", [0, 0, w, h])
        .attr("preserveAspectRatio", "xMidYMid meet");

      // const yScale = d3.scaleLinear()
      //   .domain([0, d3.max(data, (d) => d.count)])
      //   .range([h - padding, padding]);

      const yScale = d3.scaleLinear()
        .domain([0, 900])
        .range([h - padding, padding]);

      const xScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([padding, w - (0.25 * padding)]);


      // yAxis - adding last so it appears above the bars

      const yAxis = d3.axisRight(yScale)
        .tickSize(w - (padding * 1.25));

      svg.append("g")
        .attr("transform", "translate(" + padding + ", 0)")
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick:not(:first-of-type) line")
          .attr("stroke-opacity", 1)
          .attr("stroke-width", 0.25)
          .attr("stroke", "#323232"))
        .call(g => g.selectAll(".tick text")
          .attr("x", -24)
          .attr("dy", -4)
          .attr('fill', '#323232'));


      svg.selectAll("rect.bar")
        .data(data)
        .join('rect')
        .attr('class', 'bar')
        .attr('x', (d, i) => {
          return i * ((w - (1.25 * padding)) / data.length) + 1 + padding;
        })
        .attr("y", (d) => {
          return yScale(d.count);
        })
        .attr("width", () => {
          return ((w - (1.25 * padding)) / data.length) - 4;
        })
        .attr("height", (d) => {
          return yScale(0) - yScale(d.count);
        })
        .attr("data-count", (d) => (d.count))
        .append('title')
        .text((d) => d.date);

      svg.selectAll("rect.percentage-bar")
        .data(data)
        .join('rect')
        .attr('class', 'percentage-bar')
        .attr('x', (d, i) => {
          return i * ((w - (1.25 * padding)) / data.length) + padding;
        })
        .attr("y", (d) => {
          return yScale(d.count);
        })
        .attr("width", () => {
          return ((w - (1.25 * padding)) / data.length) - 2;
        })
        .attr("height", (d) => {
          return (yScale(0) - yScale(d.count)) * d.percentage;
        })
        .append('title')
        .text((d) => d.percentage);

      svg.selectAll("text.count")
        .data(data)
        .join("text")
        .attr('class', 'count')
        .text((d) => (d.count))
        .attr('x', (d, i) => {
          return i * ((w - (1.25 * padding)) / data.length) - 4 + padding + 10;
        })
        .attr("y", (d) => {
          return yScale(d.count) - 10;
        })
        .style('font-size', '1rem')
        .style('font-weight', 'bold')
        .style('font-family', 'Courier New')
        .style('fill', 'navy');

      svg.selectAll("text.date")
        .data(data)
        .join("text")
        .attr('class', 'date')
        .text((d) => (d.date))
        .attr('x', (d, i) => {
          return i * ((w - (1.25 * padding)) / data.length) - 4 + padding + 10;
        })
        .attr("y", (d) => {
          return h - 20;
        })
        .style('font-size', '0.75rem')
        .style('font-weight', 'bold')
        .style('font-family', 'Courier New')
        .style('fill', 'navy');


      // xAxis

      const xAxis = d3.axisBottom(xScale);

      svg.append("g")
        .attr("transform", "translate(0, " + (h - padding) + ")")
        .call(xAxis)
        .call(g => {
          console.dir(g);
          g.selectAll(".tick text")
            .attr("dy", "10000");
        });



      // text version of results

      // data.forEach(function(item) {
      //   let template = document.querySelector('#result_box');
      //   let resultBox = document.importNode(template.content, true);
      //
      //   resultBox.querySelector('.date').innerHTML = item.date;
      //   resultBox.querySelector('.count').innerHTML = item.count;
      //
      //   outputBox.appendChild(resultBox);
      // })
    })
  });
})();
