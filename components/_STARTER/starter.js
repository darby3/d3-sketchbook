(function () {
  document.addEventListener('DOMContentLoaded', function () {
    console.log("starterID active");

    // Debug mode?

    const debug = false;

    // Config

    const width = 600;
    const height = 300;
    const margin = {
      "top": 20,
      "bottom": 30,
      "left": 40,
      "right": 40
    }

    // Useful functions

    function getPercentage(part, total) {
      return Math.round(part / total * 1000) / 10;
    }

    // Create the svg container

    const svg = d3.select("#svgOutput")
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("preserveAspectRatio", "xMidYMid meet");

    //
    // Do stuff
    //

  });
})();
