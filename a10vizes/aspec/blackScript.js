// Set up margins
const topMargin = 100;
const botMargin = 100;
const leftMargin = 100;
const rightMargin = 100;

const svgWidth = 1000 - (leftMargin + rightMargin);
const svgHeight = 400 - (topMargin + botMargin);

// Set up svg area
const svgBlack = d3
  .select('#blackChart')
  .append('svg')
  .attr('width', window.innerWidth)
  .attr('height', window.innerHeight)
  .append('g') // group and move
  .attr(
    'transform',
    'translate(' + leftMargin + ',' + rightMargin + ')',
  );

// Put title at top
svgBlack
  .append('text')
  .attr('x', svgWidth / 2)
  .attr('y', -topMargin / 2)
  .attr('text-anchor', 'middle')
  .style('font-size', '20px')
  .text('PORK IS BAD NO ONE BUY');

const link =
  'https://gist.githubusercontent.com/ctan13dons/7a8595df14f28132f20aea32ad2acd2b/raw/4410f110bea9c6eaa4a9d641bd7b7ef81ce81375/a4MeatCPI.csv';

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
  svgBlack
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
    .style('fill', function (d) {
      // Set pork to red, else default color
      return d.Meat === 'Pork' ? 'red' : '#c0c0c0';
    })

    .on('mouseout', function () {
      // Restore original color
      d3.select(this).style('fill', function (d) {
        // Set pork to red, else default color
        return d.Meat === 'Pork' ? 'red' : '#c0c0c0';
      });

      // Remove the text
      svgBlack.select('.tooltip').remove();
    });

  // Draw the axis by appending to the svg
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  svgBlack
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0, ' + svgHeight + ')')
    .call(xAxis);

  svgBlack.append('g').call(yAxis);
});
