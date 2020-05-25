// from data.js
var tableData = data;

var columnNames = Object.keys(tableData[0])

// format the location data
tableData.forEach(row => {
  row.city = row.city.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase().concat(word.slice(1))).join(' ')
  row.state = row.state.toUpperCase()
  row.country = row.country.toUpperCase()
  row.shape = row.shape.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase().concat(word.slice(1))).join(' ')
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

// create an array of the filterable columns
var filterColumns = Object.keys(tableData[0]).slice(0, 5);

// generate an object containing the filter objects
var filterOptions = {};
filterColumns.forEach(filter => {
  filterOptions[filter] = [...new Set(tableData.map(d => d[filter]))].sort();
});

var filterList = d3.select('ul#filters');

Object.keys(filterOptions).forEach(option => {

  // create a dropdown using a select element for each filter
  let select = filterList.append('li')
    .classed('filter list-item-group', true)
    .append('select')
    .classed('form-control', true)
    .attr('name', option)
    .on('change', updateFilter)

  if (option.endsWith('y')) {
    label = option.replace('y', 'ies');
  } else {
    label = option;
    if (option === 'datetime') label = 'date';
    label = label.concat('s');
  }

  label = label.charAt(0).toUpperCase().concat(label.slice(1))
  select.attr('id', label)

  // Add the initial option
  select.append('option').text('All ' + label)

  // Add all values as options to dropdown
  select.selectAll(null)
    .data(filterOptions[option])
    .enter()
    .append('option')
    .text(function (d) { return d; })
})

// update the sightings found count
d3.select('.results-count').text(tableData.length)

var filters = {}

function updateFilter() {
  if (this.value.includes('All ' + this.id)) {
    delete filters[this.name]
  } else {
    filters[this.name] = this.value
  }
  filterTable()
}

function filterTable() {

  // prevent reloading of webpage
  d3.event.preventDefault()

  // array to store rows retrieved
  let viewData = [];

  // generate new filtered dataset or use original dataset
  if (Object.keys(filters).length) {
    viewData = tableData.filter(row => {
      for (let filter in filters) {
        return row[filter] === filters[filter]
      }
    });
  } else {
    viewData = tableData;
  }

  // update sightings found count
  d3.select('.results-count').text(viewData.length);

  // select table
  tbody = d3.select('#ufo-table').select('tbody');

  // update table
  rows = tbody.selectAll('tr').data(viewData);

  columns = rows.enter()
    .append('tr')
    .merge(rows)
    .selectAll('td')
    .data(row => Object.keys(row).map(key => ({ column: key, value: row[key] })));

  columns
    .enter()
    .append('td')
    .attr("style", "font-family: Arial;")
    .merge(columns)
    .html(column => column.value);

  // remove unnecessary table rows
  rows.exit().remove()

}
