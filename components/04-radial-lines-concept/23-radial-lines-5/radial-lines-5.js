(function () {
  document.addEventListener('DOMContentLoaded', function () {
    console.log("radial-lines-5 active");

    // line coordinate helper functions

    const pi = Math.PI;

    function getXcoord(angle, length) {
      return length * Math.cos(angle * (pi / 180));
    }

    function getYcoord(angle, length) {
      return length * Math.sin(angle * (pi / 180));
    }

    // config

    const width = 800;
    const height = 800;
    const margin = {
      "top": 10,
      "bottom": 10,
      "left": 10,
      "right": 10
    }

    const clearer = document.querySelector("#clearer");
    clearer.addEventListener('click', () => {
      document.querySelector("#svgOutput").removeChild(document.querySelector('svg'));
    });

    const maxAngle = document.querySelector('#maxAngle');

    const dataFetcher = document.querySelector('#dataCountFetcher');
    const dataCount = document.querySelector('#dataCount');

    dataFetcher.addEventListener('click', function () {
      console.log(dataCount.value);

      // data input and massaging

      let datasetArray = [];

      datasetArray.push({
        id: 1,
        count: 600 + dataset[0].number,
        change: dataset[0].number
      })

      for (let i = 1; i < dataCount.value; i++) {
        datasetArray.push({
          id: dataset[i].id,
          count: datasetArray[i - 1].count + dataset[i].number,
          change: dataset[i].number
        })
      }


      // main svg output

      let svg = d3.select("#svgOutput")
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("preserveAspectRatio", "xMidYMid meet");

      console.dir(svg);

      // colorable background rectangle

      svg.append('rect')
        .attr('class', 'bg')
        .attr('x', margin.left)
        .attr('y', margin.top)
        .attr('height', height - margin.bottom - margin.top)
        .attr('width', width - margin.right - margin.left)
        .attr('stroke', 'darkslategray')
        .attr('stroke-width', '0.25')
        .attr('fill', '#ffffff');


      // scales

      const lengthScale = d3.scaleLinear()
        .domain([0, d3.max(datasetArray, (d) => d.count)])
        .range([0, (height - margin.top - margin.bottom) / 2]);

      console.log(document.querySelector('#maxAngle').value);

      const startingAngleValue = document.querySelector('#startingAngle').value;
      const maxAngleValue = document.querySelector('#maxAngle').value;

      const angleScale = d3.scaleLinear()
        .domain([0, d3.max(datasetArray, (d) => d.id)])
        .range([(startingAngleValue ? startingAngleValue - 180 : -180), (maxAngleValue ? maxAngleValue - 180 : 180)]);


      // establish the center of the chart

      const centerX = (width - margin.left - margin.right) / 2 + margin.left;
      const centerY = (height - margin.top - margin.bottom) / 2 + margin.top;

      const t = d3.transition()
        .duration(5000)
        .ease(d3.easeCircleInOut);


      // draw some lines, yeah!

      svg.selectAll('line.datapt')
        .data(datasetArray)
        .enter()
        .append('line')
        .attr('class', (d) => (d.change > 0) ? 'datapt datapt--positive' : 'datapt datapt--negative')
        .attr('x1', centerX)
        .attr('y1', centerY)
        .attr('x2', centerX)
        .attr('y2', centerY)
        .attr('data-count', (d) => d.count)
        .attr('data-id', (d) => d.id)
        .on('click', lineClickHandler)
        .transition(t)
        .delay((d, i) => i * 20)
        .attr('x2', (d, i) => {
          return getXcoord(angleScale(d.id), lengthScale(d.count)) + centerX;
        })
        .attr('y2', (d, i) => {
          return getYcoord(angleScale(d.id), lengthScale(d.count)) + centerY;
        });

      function lineClickHandler(d, i) {
        console.log("click handled");

        if (svg.select('.selected').size() > 0) {
          svg.selectAll('.selected').classed('selected', false);
        }

        if (svg.select('.activated').size() > 0) {
          svg.selectAll('.activated').classed('activated', false);
        }

        d3.select(this).classed('activated', true);

        svg.select('text.bigLabel').remove();

        svg.append('text')
          .attr("x", margin.left + 8)
          .attr("y", margin.top + 24)
          .attr('class', 'bigLabel')
          .style('font-family', 'Verdana, sans-serif')
          .style('font-size', '1rem')
          .style("fill", 'darkslategray')
          .text(`id: ${d.id} / count: ${d.count}`);

        svg.select('rect.bg')
          .style('fill', d.property)
      }

      // console.log(getXcoord(180, 1));
      // console.log(getYcoord(180, 1));

      console.log(getXcoord(180, 500));
      console.log(getYcoord(180, 500));

      // the center will not hold

      svg.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', '25')
        .attr('stroke', 'darkslategray')
        .attr('stroke-width', '0.25')
        .attr('stroke-opacity', '0.25')
        .attr('fill', 'white');


      // let us make it do tricks

      const negButton = document.querySelector('#showNeg');
      const posButton = document.querySelector('#showPos');
      const reset = document.querySelector('#reset');

      negButton.addEventListener('click', function () {
        console.log("negatives");

        if (svg.select('.selected').size() > 0) {
          svg.selectAll('.selected').classed('selected', false);
        }

        svg.selectAll('line.datapt--negative')
          .classed('selected', true);
      })

      posButton.addEventListener('click', function () {
        console.log("positives");

        if (svg.select('.selected').size() > 0) {
          svg.selectAll('.selected').classed('selected', false);
        }

        svg.selectAll('line.datapt--positive')
          .classed('selected', true);
      })

      reset.addEventListener('click', function () {
        if (svg.select('.selected').size() > 0) {
          svg.selectAll('.selected').classed('selected', false);
        }
      })


    })


  });
})();
