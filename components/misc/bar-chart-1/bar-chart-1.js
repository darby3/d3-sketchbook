(function () {
  document.addEventListener('DOMContentLoaded', function () {
    console.log("bar-chart-1 active");

    // Let's get this party started.
    console.log("Hello from the main app file");

    const button = document.querySelector("#story_submit");

    button.addEventListener("click", function () {
      const textarea = document.querySelector("#story");
      const output = document.querySelector("#output");

      if (document.querySelector('svg')) {
        const svgToRemove = document.querySelector('svg');
        svgToRemove.parentNode.removeChild(svgToRemove);
      }

      let textToAnalyze = textarea.value;
      textToAnalyze = textToAnalyze.toLowerCase();
      textToAnalyze = textToAnalyze.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?!\."'“”’‘\[\]\n ]/g,"");
      textToAnalyze = textToAnalyze.replace(/\s{2,}/g," ");

      let results = {};

      for (let i = 0; i < textToAnalyze.length; i++) {
        let curChar = textToAnalyze.charAt(i);
        if (results.hasOwnProperty(curChar)) {
          results[curChar] += 1;
        } else {
          results[curChar] = 1;
        }
      }

      let html = '<ul>';

      for (var prop in results) {
        if (Object.prototype.hasOwnProperty.call(results, prop)) {
          html += '<li>'
          html += prop + ': ' + results[prop];
          html += '</li>'
        }
      }

      output.innerHTML = html;

      let resultsArray = [];
      for (var prop in results) {
        if (Object.prototype.hasOwnProperty.call(results, prop)) {
          resultsArray.push({
            'char': prop,
            'count': results[prop]
          })
        }
      }

      resultsArray.sort(function(x, y){
        return d3.ascending(x.count, y.count);
      })

      // the d3 part

      const w = 1000;
      const h = 500;
      const aspect = w / h
      const padding = 60;
      const viewbox = `0 0 ${w} ${h}`;

      const svg = d3.select("#svgOutput")
        .append("svg");

      svg.attr("viewBox", [0, 0, w, h])
        .attr("preserveAspectRatio", "xMidYMid meet");

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(resultsArray, (d) => d.count)])
        .range([25, h - padding]);

      svg.selectAll("rect.bar")
        .data(resultsArray)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (d, i) => {
          return i * (w / resultsArray.length) + 2;
        })
        .attr("y", (d) => {
          return h - yScale(d.count);
        })
        .attr("width", () => {
          return (w / resultsArray.length) - 4;
        })
        .attr("height", (d) => {
          return yScale(d.count);
        })
        .attr("data-count", (d) => (d.count))
        .on("click", barClickHandler);

      svg.selectAll("text.title")
        .data(resultsArray)
        .enter()
        .append("text")
        .attr('class', 'title')
        .text((d) => (d.char))
        .attr('x', (d, i) => {
          return i * (w / resultsArray.length) + 10;
        })
        .attr("y", (d) => {
          return h - 10;
        })
        .style('font-family', 'Courier New')
        .style('font-size', '0.75rem')
        .style('font-weight', 'bold')
        .style('fill', 'white');

      svg.selectAll("text.count")
        .data(resultsArray)
        .enter()
        .append("text")
        .attr('class', 'count')
        .text((d) => (d.count))
        .attr('x', (d, i) => {
          return i * (w / resultsArray.length) + 20;
        })
        .attr("y", (d) => {
          return h - yScale(d.count) - 10;
        })
        .style('font-size', '0.75rem')
        .style('font-weight', 'bold')
        .style('font-family', 'Courier New')
        .style('fill', 'navy')
        .attr('transform', (d, i) => {
          return `rotate(-90 ${i * (w / resultsArray.length) + 20} ${h - yScale(d.count) - 10}) `
        });

      function barClickHandler(d, i) {
        console.log("click handled");

        if (svg.select('.selected').size() > 0) {
          svg.select('.selected').classed('selected', false);
        }

        d3.select(this).classed('selected', true);

        svg.select('text.bigLabel').remove();

        svg.append('text')
          .attr("x", "25")
          .attr("y", "150")
          .attr('class', 'bigLabel')
          .style('font-family', 'Georgia, serif')
          .style('font-size', '10rem')
          .style('font-weight', 'bold')
          .style('fill', 'navy')
          .text(d.char + " ∙ " + d.count);
      }

    })

  });
})();
