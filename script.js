console.clear();
var activeSubcategory;
var taxonomy_display = [];
function filterTaxonomy(subcategory) {
  activeSubcategory = subcategory;
  taxonomy_display.length = 0;
  taxonomy_display = taxonomy.filter((t) => {
    return t.subcategory == subcategory;
  });
  taxonomy_display = taxonomy_display.sort((a, b) => {
    return b.i_mean > a.i_mean ? 1 : -1;
  });
  fillTable(taxonomy_display);
  graphData(taxonomy_display);
}

var tbody = $('#tbody');
var summaryTextEl = $('#summaryText');
function fillTable(rows) {
  tbody.html('');
  rows.forEach((row) => {
    tbody.append(
      `<tr><td>${row.name}</td><td>${(parseFloat(row.i_mean).toFixed(4)+"%")}</td></tr>`
    );
  });
  summaryTextEl.html(
    `There were ${rows.length} additions to ${activeSubcategory} `
  );
}

function csvJSON(csv) {
  var lines = csv.split('\n');
  var result = [];
  var headers = lines[0].split(',');
  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(',');
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    if (obj.cde) delete obj.cde;
    result.push(obj);
  }
  return result;
}

function findUniqueSubCategories() {
  let uniqueSubcategories = [
    ...new Set(taxonomy.map((item) => item.subcategory)),
  ];
  uniqueSubcategories = uniqueSubcategories.sort((a, b) => {
    return (a.toLowerCase() < b.toLowerCase()) ? -1 : 1;
  });
  return uniqueSubcategories;
}

var taxonomy = csvJSON(csv_data);
var uniqueSubcategories = findUniqueSubCategories();

var dropdown = $('#subcategorySelect');
dropdown.append(
  '<option selected="true" disabled>Choose a Subcategory</option>'
);

uniqueSubcategories.forEach(function (value) {
  if (value && value.length > 1)
    dropdown.append(`<option value="${value}">${value}</option>`);
});

$(dropdown).change(function (e) {
  filterTaxonomy($(this).val());
});

const maxBars = 20;
function graphData(taxonomy_display) {
  console.log(taxonomy_display)
  graphRows = taxonomy_display.splice(0, maxBars);

  let xArray = graphRows.map((a) => a.name);
  let yArray = graphRows.map((a) => a.i_mean);
  var data = [
    {
      x: xArray,
      y: yArray,
      type: 'bar',
    },
  ];

  Plotly.newPlot('barChart', data);
}
