// from data.js
var tableData = data;

// format the location data
tableData.forEach(row => {
  row.city = row.city.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  row.state = row.state.toUpperCase()
  row.country = row.country.toUpperCase()
  row.shape = row.shape.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  return row
})

// html table to display sightings
var table = d3.select('#ufo-table')

// bind data to table rows
var rows = table.select('tbody')
  .selectAll('tr')
  .data(tableData)
  .enter()
  .append('tr')

// enter table cells
var cells = rows.selectAll('td')
  .data(row => Object.keys(row).map(key => ({ column: key, value: row[key] })))
  .enter()
  .append('td')
  .attr("style", "font-family: Arial;")
  .html(column => column.value);

// create an array of unique dates only
var dates = [...new Set(tableData.map(d => d.datetime))]

// create a dropdown using a select element
var filter = d3.select('li.filter')
  .append('select')
  .classed('form-control', true)
  .on('change', filterTable)

// Add the initial option
filter.append('option')
  .text('Select a Date:')

// Add all dates as options to dropdown
var options = filter.selectAll(null)
  .data(dates)
  .enter()
  .append('option')
  .text(function (date) { return date; });

d3.select('.results-count').text(tableData.length)

function filterTable() {
  console.log(this.value)
  let searchData = this.value;
  let viewData = []
  if (searchData === 'Select a Date:') {
    viewData = tableData;
  } else {
    viewData = tableData.filter(row => row['datetime'] === searchData)
  }

  d3.select('.results-count').text(viewData.length)

  //console.log('rows to display ', viewData)

  tbody = d3.select('#ufo-table').select('tbody')

  // Update and Merge 
  rows = tbody.selectAll('tr').data(viewData)

  columns = rows.enter()
    .append('tr')
    .merge(rows)
    .selectAll('td')
    .data(row => Object.keys(row).map(key => ({ column: key, value: row[key] })))

  columns
    .enter()
    .append('td')
    .attr("style", "font-family: Arial;")
    .merge(columns)
    .html(column => column.value)

  rows.exit().remove()

  // Update existing rows
  /* rows = tbody.selectAll('tr')
    .data(viewData)
    .each(function (d) {
      d3.select(this)
        .selectAll('td')
        .data(function (row) { return Object.keys(row).map(key => ({ column: key, value: row[key] })) })
        .text(function (column) { return column.value })
    })
  rows.exit().remove() */

  /*
columns = rows.enter()
  .append('tr')
  .selectAll('tr')
  .selectAll('td')
  .data(row => Object.keys(row).map(key => ({ column: key, value: row[key] })))

columns
  .enter()
  .append('td')
  .attr("style", "font-family: Arial;")
  .merge(columns)
  .html(column => column.value)

columns.exit().remove()
rows.exit().remove() */

}
