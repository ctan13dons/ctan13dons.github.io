// Set up svg area
const svgBody = d3
  .select('#whiteChart')
  .append('svg')
  .attr('width', window.innerWidth)
  .attr('height', window.innerHeight)
  .append('g')
  .attr(
    'transform',
    'translate(' + leftMargin + ',' + topMargin + ')',
  );

// Put title at top
svgBody
  .append('text')
  .attr('x', svgWidth / 2)
  .attr('y', -topMargin / 2)
  .attr('text-anchor', 'middle')
  .style('font-size', '20px')
  .text('Vehicle Power vs. MPG');

d3.csv(dataLink).then((data) => {
  // Convert data from strings to numbers
  data.forEach((d) => {
    d.Mpg = +d.Mpg;
    d.Horsepower = +d.Horsepower;
    d.Torque = +d.Torque;
  });

  // Scales for x and y
  const x = d3
    .scaleLinear()
    .range([0, svgWidth])
    .domain([100, d3.max(data, (d) => d.Torque)]);

  const y = d3
    .scaleLinear()
    .range([svgHeight, 0])
    .domain([100, d3.max(data, (d) => d.Horsepower)]);

  // Scale for circle size
  const circleSize = d3
    .scaleLinear()
    .range([5, 25]) // Adjust the range based on your preference for minimum and maximum circle sizes
    .domain([
      d3.min(data, (d) => d.Mpg),
      d3.max(data, (d) => d.Mpg),
    ]);

  // Draw circles
  svgBody
    .selectAll('.circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'circle')
    .attr('cx', (d) => x(d.Torque))
    .attr('cy', (d) => y(d.Horsepower))
    .attr('r', (d) => circleSize(d.Mpg))
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .style('fill', (d) => {
      if (d.Make === 'Audi') return 'blue';
      else if (d.Make === 'Chevrolet') return 'red';
      else if (d.Make === 'Volvo') return 'green';
    })
    .style('opacity', 0.25)
    .on('mouseover', function (event, d) {
      d3.select(this).style('fill', 'orange');
      svgBody
        .append('text')
        .attr('class', 'tooltip')
        .attr('x', x(d.Torque) + 5)
        .attr('y', y(d.Horsepower) - 5)
        .text(
          `Torque: ${d.Torque}, HP: ${d.Horsepower}, MPG: ${d.Mpg}, Make: ${d.Make}`,
        )
        .style('font-size', '16px')
        .style('fill', 'black');
    })
    .on('mouseout', function () {
      d3.select(this).style('fill', (d) => {
        if (d.Make === 'Audi') return 'blue';
        else if (d.Make === 'Chevrolet') return 'red';
        else if (d.Make === 'Volvo') return 'green';
      });
      svgBody.select('.tooltip').remove();
    });

  // Draw axes
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  svgBody
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0, ' + svgHeight + ')')
    .call(xAxis);

  svgBody.append('g').call(yAxis);

  // Label x axis
  svgBody
    .append('text')
    .attr('x', svgWidth / 2)
    .attr('y', 1.12 * svgHeight)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .style('font-weight', 'bold')
    .text('Torque');

  // Label y axis
  svgBody
    .append('text')
    .attr('x', -svgHeight / 2)
    .attr('y', -leftMargin / 2 - 10)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .style('font-weight', 'bold')
    .attr('transform', 'rotate(-90)')
    .text('Horsepower');

  // Add a size legend
  const legendWidth = 200;
  const legendHeight = 100;

  const legend = svgBody
    .append('g')
    .attr('class', 'legend')
    .attr(
      'transform',
      `translate(${svgWidth - legendWidth / 2}, -120)`,
    );

  // Range of circle sizes for the legend
  const legendCircleSizes = [5, 12.5, 20];

  // Add circles to the legend
  legend
    .selectAll('legendCircle')
    .data(legendCircleSizes)
    .enter()
    .append('circle')
    .attr('cx', (d, i) => 15)
    .attr('cy', (d, i) => legendHeight - d)
    .attr('r', (d) => d)
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('fill', 'none');

  // Add text labels to the legend
  legend
    .selectAll('legendText')
    .data(legendCircleSizes)
    .enter()
    .append('text')
    .attr('x', 45)
    .attr('y', (d, i) => legendHeight - d - 5 * i)
    .text((d) => `${d} MPG`)
    .style('font-size', '12px')
    .attr('alignment-baseline', 'middle');
});
