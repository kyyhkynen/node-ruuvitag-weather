// debounce function for window resizes
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// charts
google.charts.load('current', {'packages':['corechart']});

function drawChart(elementId, chartData) {
    var data = google.visualization.arrayToDataTable(chartData);

    var options = {
    theme: 'maximized',
    legend: { position: 'none' },
    hAxis: {
        format: 'HH:mm',
        gridlines: {
        color: '#666'
        },
        textStyle: {
        color: '#999'
        }
    },
    vAxis: {
        format: '#°C',
        gridlines: {
        color: '#666'
        },
        textStyle: {
        color: '#999'
        }
    },
    series: [{ color: '#66a' }],
    backgroundColor: 'transparent'
    };

    var chart = new google.visualization.AreaChart(document.getElementById(elementId));
    chart.draw(data, options);
}

// handle tabs
var tabs = document.getElementById('tabs');
if (tabs) {
    var tabLinks = tabs.getElementsByTagName('a'),
        i, j;

    for (i = 0; i < tabLinks.length; i++) {
        if (tabLinks[i].href === location.href) {
            tabLinks[i].className = 'active';
        }
        tabLinks[i].addEventListener('click', function(evt) {
            for (j = 0; j < tabLinks.length; j++) {
                tabLinks[j].className = '';
            }
            evt.target.className = 'active';
            window.dispatchEvent(new Event('resize'));
        });
    }
    // show first tab on page load
    if (!location.hash) {
        tabLinks[0].click();
    }
}

