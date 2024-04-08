// Set up margins
const topMargin = 130;
const botMargin = 130;
const leftMargin = 130;
const rightMargin = 130;

const svgWidth =
  window.innerWidth - (leftMargin + rightMargin);
const svgHeight =
  window.innerHeight - (topMargin + botMargin);

// Set up svg area
const svgBlackBody = d3
  .select('#blackChart')
  .append('svg')
  .attr('width', window.innerWidth)
  .attr('height', window.innerHeight)
  .append('g')
  .attr(
    'transform',
    'translate(' + leftMargin + ',' + topMargin + ')',
  );

// Put title at top
svgBlackBody
  .append('text')
  .attr('x', svgWidth / 2)
  .attr('y', -topMargin / 2)
  .attr('text-anchor', 'middle')
  .style('font-size', '20px')
  .text('Vehicle Power vs. MPG');

const dataLink =
  'https://gist.githubusercontent.com/ctan13dons/0ea119512ef0de8bb75c66e4eaa1a7b7/raw/8e737bdc0fcae2889e70dca32004144edef5f48d/a5cars.csv';

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
  svgBlackBody
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
    .on('mouseover', function (event, d) {
      d3.select(this).style('fill', 'orange');
      svgBlackBody
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
      svgBlackBody.select('.tooltip').remove();
    });

  // Draw axes
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  svgBlackBody
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0, ' + svgHeight + ')')
    .call(xAxis);

  svgBlackBody.append('g').call(yAxis);

  // Label x axis
  svgBlackBody
    .append('text')
    .attr('x', svgWidth / 2)
    .attr('y', 1.12 * svgHeight)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .style('font-weight', 'bold')
    .text('Torque');

  // Label y axis
  svgBlackBody
    .append('text')
    .attr('x', -svgHeight / 2)
    .attr('y', -leftMargin / 2 - 10)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .style('font-weight', 'bold')
    .attr('transform', 'rotate(-90)')
    .text('Horsepower');
});
