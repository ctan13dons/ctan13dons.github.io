// Set up svg area
const svgWhite = d3
  .select('#whiteChart')
  .append('svg')
  .attr('width', window.innerWidth)
  .attr('height', window.innerHeight)
  .append('g') // group and move
  .attr(
    'transform',
    'translate(' + leftMargin + ',' + rightMargin + ')',
  );

// Put title at top
svgWhite
  .append('text')
  .attr('x', svgWidth / 2)
  .attr('y', -topMargin / 2)
  .attr('text-anchor', 'middle')
  .style('font-size', '20px')
  .text('CPI of Meats in 2015 (Base Year 1990)');

d3.csv(link).then((data) => {
  // Convert data from strings to numbers
  data.forEach((d) => {
    d.CPI = +d.CPI;
  });

  // Scales for x and y
  const x = d3
    .scaleLinear()
    .range([0, svgWidth])
    .domain([
      0,
      d3.max(data, function (d) {
        return d.CPI;
      }),
    ]);

  const y = d3
    .scaleBand()
    .range([svgHeight, 0])
    .padding(0.05)
    .domain(
      data.map(function (d) {
        return d.Meat;
      }),
    );

  // Draw bars
  svgWhite
    .selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('y', function (d) {
      return y(d.Meat);
    })
    .attr('height', y.bandwidth() - 20)
    .attr('x', 0)
    .attr('width', function (d) {
      return x(d.CPI);
    })
    .style('fill', '#c0c0c0')

    // Animations on hover
    .on('mouseover', function (event, d) {
      // Change color to orange
      d3.select(this).style('fill', 'orange');

      // Show text on hover
      svgWhite
        .append('text')
        .attr('class', 'tooltip')
        .attr('x', x(d.CPI) + 5) // Adjust the positioning as needed
        .attr('y', y(d.Meat) + y.bandwidth() / 2)
        .text(`CPI: ${d.CPI}`)
        .style('font-size', '14px')
        .style('fill', 'black');
    })

    .on('mouseout', function () {
      // Restore original color
      d3.select(this).style('fill', '#c0c0c0');

      // Remove the text
      svgWhite.select('.tooltip').remove();
    });

  // Draw the axis by appending to the svg
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  svgWhite
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0, ' + svgHeight + ')')
    .call(xAxis);

  svgWhite.append('g').call(yAxis);

  // Label x axis
  svgWhite
    .append('text')
    .attr('x', svgWidth / 2)
    .attr('y', 1.2 * svgHeight)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .style('font-weight', 'bold')
    .text('CPI');

  // Label y axis
  svgWhite
    .append('text')
    .attr('x', -svgHeight / 2)
    .attr('y', -leftMargin / 2)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .style('font-weight', 'bold')
    .attr('transform', 'rotate(-90)')
    .text('Meat');
});
