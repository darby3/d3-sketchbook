(function () {
  document.addEventListener('DOMContentLoaded', function () {
    console.log("add-axes-3 active");

    const button = document.querySelector('#trigger');
    const outputBox = document.querySelector('#outputBox');
    const svgOutput = document.querySelector('#svgOutput');

    button.addEventListener('click', function() {
      const spinnerA = document.createElement('div');
      spinnerA.classList.add('spinner');
      outputBox.appendChild(spinnerA);

      const spinnerB = document.createElement('div');
      spinnerB.classList.add('spinner');
      svgOutput.appendChild(spinnerB);

      fetch('https://my.api.mockaroo.com/chart-data.json?key=0b401b10&count=10')
        .then(response => response.json())
        .then(data => {
          outputBox.removeChild(spinnerA);
          svgOutput.removeChild(spinnerB);

          // d3 version of results

          const w = 1000;
          const h = 500;
          const padding = 40;

          const svg = d3.select("#svgOutput")
            .append("svg");

          svg.attr("viewBox", [0, 0, w, h])
            .attr("preserveAspectRatio", "xMidYMid meet");

          const yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([h - padding, padding]);

          const xScale = d3.scaleLinear()
            .domain([0, data.length])
            .range([padding, w - (0.25 * padding)]);

          console.log(xScale(0));
          console.log(xScale(5));
          console.log(xScale(10));

          // yAxis - adding first so it appears below the bars?

          const yAxis = d3.axisRight(yScale)
            .tickSize(w - (padding * 1.25));

          svg.append("g")
            .attr("transform", "translate(" + padding + ", 0)")
            .call(yAxis)
            .call(g => g.selectAll(".tick:not(:first-of-type) line")
              .attr("stroke-opacity", 0.5)
              .attr("stroke-dasharray", "4,8"))
              .attr("stroke", "navy")
            .call(g => g.selectAll(".tick text")
              .attr("x", -24)
              .attr("dy", -4));

          svg.selectAll("rect.bar")
            .data(data)
            .join('rect')
              .attr('class', 'bar')
              .attr('x', (d, i) => {
                return i * ((w - (1.25 * padding)) / data.length) + padding;
              })
              .attr("y", (d) => {
                return yScale(d.count);
              })
              .attr("width", () => {
                return ((w - (1.25 * padding)) / data.length) - 1;
              })
              .attr("height", (d) => {
                return yScale(0) - yScale(d.count);
              })
              .attr("data-count", (d) => (d.count))
              .append('title')
              .text((d) => d.property);

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


          // xAxis

          const xAxis = d3.axisBottom(xScale);

          svg.append("g")
            .attr("transform", "translate(0, " + (h - padding) + ")")
            .call(xAxis);

          // text version of results

          data.forEach(function(item) {
            let template = document.querySelector('#result_box');
            let resultBox = document.importNode(template.content, true);

            resultBox.querySelector('.property').innerHTML = item.property;
            resultBox.querySelector('.count').innerHTML = item.count;

            outputBox.appendChild(resultBox);
          })
        })
    })
  });
})();
