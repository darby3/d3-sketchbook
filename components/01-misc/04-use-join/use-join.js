(function () {
  document.addEventListener('DOMContentLoaded', function () {
    console.log("use-join active");

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

      fetch('https://my.api.mockaroo.com/chart-data.json?key=0b401b10&count=25')
        .then(response => response.json())
        .then(data => {
          outputBox.removeChild(spinnerA);
          svgOutput.removeChild(spinnerB);

          // d3 version of results

          const w = 1000;
          const h = 500;
          const padding = 60;

          const svg = d3.select("#svgOutput")
            .append("svg");

          svg.attr("viewBox", [0, 0, w, h])
            .attr("preserveAspectRatio", "xMidYMid meet");

          const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => d.count)])
            .range([25, h - padding]);

          svg.selectAll("rect.bar")
            .data(data)
            .join('rect')
              .attr('class', 'bar')
              .attr('x', (d, i) => {
                return i * (w / data.length) + 2;
              })
              .attr("y", (d) => {
                return h - yScale(d.count);
              })
              .attr("width", () => {
                return (w / data.length) - 4;
              })
              .attr("height", (d) => {
                return yScale(d.count);
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
                return i * (w / data.length) + 10;
              })
              .attr("y", (d) => {
                return h - yScale(d.count) - 10;
              })
              .style('font-size', '1rem')
              .style('font-weight', 'bold')
              .style('font-family', 'Courier New')
              .style('fill', 'navy');

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
