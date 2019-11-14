window.chartColors = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(231,233,237)"
};

function transparentize(color, opacity) {
  var alpha = opacity === undefined ? 0.5 : 1 - opacity;
  return Color(color)
    .alpha(alpha)
    .rgbString();
}

var chart;

function updateData(labels, data1, data2) {
  chart.data.labels = labels;
  chart.data.datasets[0].data = data1;
  chart.data.datasets[1].data = data2;
  chart.update();
}

function generateChart(labels, data1, data2) {
  if (chart != undefined) {
    updateData(labels, data1, data2);
    return;
  }

  var presets = window.chartColors;

  var data = {
    labels: labels,
    datasets: [
      {
        backgroundColor: transparentize(presets.grey),
        borderColor: presets.grey,
        data: data1,
        label: "Temp",
        fill: "-1"
      },
      {
        backgroundColor: transparentize(presets.grey),
        borderColor: presets.grey,
        data: data2,
        label: "Temp",
        fill: "-1"
      }
    ]
  };

  var options = {
    maintainAspectRatio: true,
    spanGaps: false,
    legend: {
      display: false
    },
    elements: {
      line: {
        tension: 0.000001
      }
    },
    layout: {
      padding: {
        left: 50,
        right: 50,
        top: 50,
        bottom: 50
      }
    },
    scales: {
      xAxes: [
        {
          display: false,
          gridLines: {
            display: false
          }
        }
      ],
      yAxes: [
        {
          display: false,
          stacked: true,
          gridLines: {
            display: false
          }
        }
      ]
    },
    plugins: {
      filler: {
        propagate: false
      },
      "samples-filler-analyser": {
        target: "chart-analyser"
      }
    }
  };

  chart = new Chart("myChart", {
    type: "line",
    data: data,
    options: options
  });
  chart.options.elements.line.tension = 0.4;
  chart.update();
}
