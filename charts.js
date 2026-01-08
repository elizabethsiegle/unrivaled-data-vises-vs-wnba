// charts.js
// Load data from data.json and render interactive charts using Chart.js
function normalizeName(name) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

// Common chart options for interactivity
const interactiveOptions = {
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: true,
      onClick: (e, legendItem, legend) => {
        const index = legendItem.datasetIndex;
        const chart = legend.chart;
        const meta = chart.getDatasetMeta(index);
        meta.hidden = meta.hidden === null ? !chart.data.datasets[index].hidden : null;
        chart.update();
      },
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          size: 12,
          weight: 'bold'
        }
      }
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      cornerRadius: 8,
      titleFont: {
        size: 14,
        weight: 'bold'
      },
      bodyFont: {
        size: 13
      },
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          label += context.parsed.y.toFixed(1);
          return label;
        }
      }
    },
    zoom: {
      pan: {
        enabled: true,
        mode: 'xy',
        modifierKey: null,
      },
      zoom: {
        wheel: {
          enabled: true,
          speed: 0.1,
        },
        pinch: {
          enabled: true
        },
        mode: 'xy',
      },
      limits: {
        x: {min: 'original', max: 'original'},
        y: {min: 0, max: 'original'}
      }
    }
  },
  scales: {
    x: {
      ticks: {
        autoSkip: false,
        maxRotation: 45,
        minRotation: 45
      },
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    }
  },
  animation: {
    duration: 1000,
    easing: 'easeInOutQuart'
  }
};

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const players = data.players;
    console.log('Loaded players:', players);
    const names = players.map(p => p.player);
    const points = players.map(p => p.pts);
    const rebounds = players.map(p => p.rebs);
    const assists = players.map(p => p.asts);
    console.log('Names:', names);
    console.log('Points:', points);

    // Points chart
    new Chart(document.getElementById('pointsChart'), {
      type: 'bar',
      data: {
        labels: names,
        datasets: [{
          label: 'Points',
          data: points,
          backgroundColor: names.map((_, i) => `hsl(${260 + i * 5}, 70%, 60%)`),
          borderColor: names.map((_, i) => `hsl(${260 + i * 5}, 70%, 45%)`),
          borderWidth: 2,
          hoverBackgroundColor: names.map((_, i) => `hsl(${260 + i * 5}, 80%, 70%)`),
        }]
      },
      options: {
        ...interactiveOptions,
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const player = players[index];
            alert(`${player.player}\n\n📊 Full Stats:\nPoints: ${player.pts}\nRebounds: ${player.rebs}\nAssists: ${player.asts}\nGames: ${player.games}\nMinutes: ${player.mins}\nSteals: ${player.stls}\nBlocks: ${player.blk}`);
          }
        },
        plugins: {
          ...interactiveOptions.plugins,
          legend: { display: false },
          tooltip: {
            ...interactiveOptions.plugins.tooltip,
            callbacks: {
              afterLabel: (context) => {
                const player = players[context.dataIndex];
                return [`Rebounds: ${player.rebs}`, `Assists: ${player.asts}`, `Games: ${player.games}`];
              }
            }
          }
        }
      }
    });

    // Unrivaled points distribution pie chart
    new Chart(document.getElementById('unrivaledPieChart'), {
      type: 'pie',
      data: {
        labels: names,
        datasets: [{
          label: 'Points',
          data: points,
          backgroundColor: names.map((_, i) => `hsl(${i * 360 / names.length}, 70%, 60%)`),
          borderColor: '#fff',
          borderWidth: 2,
          hoverOffset: 15
        }]
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'point'
        },
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              usePointStyle: true,
              padding: 15,
              font: {
                size: 11
              }
            }
          },
          tooltip: {
            ...interactiveOptions.plugins.tooltip,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} pts (${percentage}%)`;
              }
            }
          }
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const player = players[index];
            alert(`${player.player}\n\n📊 Contribution to Total Points\n\nPoints: ${player.pts}\nRebounds: ${player.rebs}\nAssists: ${player.asts}`);
          }
        }
      }
    });

    // Rebounds chart
    new Chart(document.getElementById('reboundsChart'), {
      type: 'bar',
      data: {
        labels: names,
        datasets: [{
          label: 'Rebounds',
          data: rebounds,
          backgroundColor: names.map((_, i) => `hsl(${140 + i * 3}, 70%, 60%)`),
          borderColor: names.map((_, i) => `hsl(${140 + i * 3}, 70%, 45%)`),
          borderWidth: 2,
          hoverBackgroundColor: names.map((_, i) => `hsl(${140 + i * 3}, 80%, 70%)`),
        }]
      },
      options: {
        ...interactiveOptions,
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const player = players[index];
            alert(`${player.player}\n\n📊 Full Stats:\nRebounds: ${player.rebs}\nPoints: ${player.pts}\nAssists: ${player.asts}\nGames: ${player.games}`);
          }
        },
        plugins: {
          ...interactiveOptions.plugins,
          legend: { display: false }
        }
      }
    });

    // Assists chart
    new Chart(document.getElementById('assistsChart'), {
      type: 'bar',
      data: {
        labels: names,
        datasets: [{
          label: 'Assists',
          data: assists,
          backgroundColor: names.map((_, i) => `hsl(${10 + i * 4}, 80%, 65%)`),
          borderColor: names.map((_, i) => `hsl(${10 + i * 4}, 80%, 50%)`),
          borderWidth: 2,
          hoverBackgroundColor: names.map((_, i) => `hsl(${10 + i * 4}, 90%, 75%)`),
        }]
      },
      options: {
        ...interactiveOptions,
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const player = players[index];
            alert(`${player.player}\n\n📊 Full Stats:\nAssists: ${player.asts}\nPoints: ${player.pts}\nRebounds: ${player.rebs}\nGames: ${player.games}`);
          }
        },
        plugins: {
          ...interactiveOptions.plugins,
          legend: { display: false }
        }
      }
    });

    // Load WNBA data and render comparison charts with player selection and new charts/tables
    fetch('wnba.json')
      .then(response => response.json())
      .then(wnbaData => {
                // WNBA Top 10 Points Line Chart
                const wnbaSorted = [...wnbaData].sort((a, b) => b.points - a.points).slice(0, 10);
                new Chart(document.getElementById('wnbaLineChart'), {
                  type: 'line',
                  data: {
                    labels: wnbaSorted.map(p => p.player),
                    datasets: [{
                      label: 'WNBA Points (Top 10)',
                      data: wnbaSorted.map(p => p.points),
                      borderColor: '#FF8C00',
                      backgroundColor: 'rgba(255,140,0,0.2)',
                      fill: true,
                      tension: 0.4,
                      borderWidth: 3,
                      pointRadius: 6,
                      pointHoverRadius: 10,
                      pointBackgroundColor: '#FF8C00',
                      pointBorderColor: '#fff',
                      pointBorderWidth: 2,
                      pointHoverBackgroundColor: '#FF6600',
                      pointHoverBorderColor: '#fff',
                      pointHoverBorderWidth: 3
                    }]
                  },
                  options: {
                    ...interactiveOptions,
                    onClick: (event, elements) => {
                      if (elements.length > 0) {
                        const index = elements[0].index;
                        const player = wnbaSorted[index];
                        alert(`${player.player}\n\n📊 WNBA Stats:\nPoints: ${player.points}\nRebounds: ${player.rebounds}\nAssists: ${player.assists}`);
                      }
                    },
                    plugins: {
                      ...interactiveOptions.plugins,
                      tooltip: {
                        ...interactiveOptions.plugins.tooltip,
                        callbacks: {
                          afterLabel: (context) => {
                            const player = wnbaSorted[context.dataIndex];
                            return [`Rebounds: ${player.rebounds}`, `Assists: ${player.assists}`];
                          }
                        }
                      }
                    }
                  }
                });

                // Unrivaled Table with search functionality
                const unrivaledTable = document.getElementById('unrivaledTable');
                const unrivaledSearch = document.getElementById('unrivaledSearch');
                function renderUnrivaledTable(filter = '') {
                  let html = '<table class="stats-table"><thead><tr><th>Player</th><th>Points</th><th>Rebounds</th><th>Assists</th></tr></thead><tbody>';
                  players.filter(p => p.player.toLowerCase().includes(filter.toLowerCase())).forEach(p => {
                    html += `<tr><td>${p.player}</td><td>${p.pts}</td><td>${p.rebs}</td><td>${p.asts}</td></tr>`;
                  });
                  html += '</tbody></table>';
                  unrivaledTable.innerHTML = html;
                }
                renderUnrivaledTable();
                unrivaledSearch.addEventListener('input', e => {
                  renderUnrivaledTable(e.target.value);
                });

                // WNBA Table with search
                const wnbaTable = document.getElementById('wnbaTable');
                const wnbaSearch = document.getElementById('wnbaSearch');
                function renderWNBATable(filter = '') {
                  let wnbaHtml = '<table class="stats-table"><thead><tr><th>Player</th><th>Points</th><th>Rebounds</th><th>Assists</th></tr></thead><tbody>';
                  wnbaData.filter(p => p.player.toLowerCase().includes(filter.toLowerCase())).forEach(p => {
                    wnbaHtml += `<tr><td>${p.player}</td><td>${p.points}</td><td>${p.rebounds}</td><td>${p.assists}</td></tr>`;
                  });
                  wnbaHtml += '</tbody></table>';
                  wnbaTable.innerHTML = wnbaHtml;
                }
                renderWNBATable();
                wnbaSearch.addEventListener('input', e => {
                  renderWNBATable(e.target.value);
                });
        // Normalize names for matching
        const wnbaMap = {};
        wnbaData.forEach(p => {
          wnbaMap[normalizeName(p.player)] = p;
        });
        // player matching across WNBA vs Unrivaled
        const commonNames = names.filter(n => wnbaMap[normalizeName(n)] !== undefined);
        console.log('Common names:', commonNames);

        // Create dropdown for player selection
        const dropdown = document.getElementById('playerDropdown');
        dropdown.innerHTML = '';
        commonNames.forEach(name => {
          const option = document.createElement('option');
          option.value = name;
          option.textContent = name;
          dropdown.appendChild(option);
        });

        let compareChartInstance = null;
        function renderPlayerComparison(selectedName) {
          const unrivaledIdx = names.indexOf(selectedName);
          const unrivaledStats = players[unrivaledIdx];
          const wnbaStats = wnbaMap[normalizeName(selectedName)];
          const ctx = document.getElementById('compareChart').getContext('2d');
          if (compareChartInstance) compareChartInstance.destroy();
          if (!wnbaStats || !unrivaledStats) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.font = '20px sans-serif';
            ctx.fillText('No data for selected player.', 10, 50);
            return;
          }
          compareChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['Points', 'Rebounds', 'Assists'],
              datasets: [
                {
                  label: 'Unrivaled',
                  data: [unrivaledStats.pts, unrivaledStats.rebs, unrivaledStats.asts],
                  backgroundColor: 'rgba(102, 126, 234, 0.8)',
                  borderColor: 'rgba(102, 126, 234, 1)',
                  borderWidth: 2,
                  hoverBackgroundColor: 'rgba(102, 126, 234, 1)'
                },
                {
                  label: 'WNBA',
                  data: [wnbaStats.points, wnbaStats.rebounds, wnbaStats.assists],
                  backgroundColor: 'rgba(255, 140, 0, 0.8)',
                  borderColor: 'rgba(255, 140, 0, 1)',
                  borderWidth: 2,
                  hoverBackgroundColor: 'rgba(255, 140, 0, 1)'
                }
              ]
            },
            options: {
              ...interactiveOptions,
              onClick: (event, elements) => {
                if (elements.length > 0) {
                  const stat = ['Points', 'Rebounds', 'Assists'][elements[0].index];
                  const league = elements[0].datasetIndex === 0 ? 'Unrivaled' : 'WNBA';
                  const value = elements[0].element.$context.parsed.y;
                  alert(`${selectedName}\n\n${league} ${stat}: ${value}`);
                }
              },
              plugins: {
                ...interactiveOptions.plugins,
                tooltip: {
                  ...interactiveOptions.plugins.tooltip,
                  callbacks: {
                    afterLabel: (context) => {
                      const diff = context.datasetIndex === 0 
                        ? context.parsed.y - context.chart.data.datasets[1].data[context.dataIndex]
                        : context.parsed.y - context.chart.data.datasets[0].data[context.dataIndex];
                      const sign = diff > 0 ? '+' : '';
                      return `Difference: ${sign}${diff.toFixed(1)}`;
                    }
                  }
                }
              }
            }
          });
        }

        // Initial render for first player
        if (commonNames.length > 0) {
          renderPlayerComparison(commonNames[0]);
        }

        // Update chart on dropdown change
        dropdown.addEventListener('change', (e) => {
          renderPlayerComparison(e.target.value);
        });

        // League-level comparison chart (unchanged)
        function avg(arr) {
          return arr.reduce((a, b) => a + b, 0) / arr.length;
        }
        const unrivaledAvg = {
          points: avg(points),
          rebounds: avg(rebounds),
          assists: avg(assists)
        };
        const wnbaPointsArr = wnbaData.map(p => p.points);
        const wnbaReboundsArr = wnbaData.map(p => p.rebounds);
        const wnbaAssistsArr = wnbaData.map(p => p.assists);
        const wnbaAvg = {
          points: avg(wnbaPointsArr),
          rebounds: avg(wnbaReboundsArr),
          assists: avg(wnbaAssistsArr)
        };

        new Chart(document.getElementById('leagueCompareChart'), {
          type: 'bar',
          data: {
            labels: ['Points', 'Rebounds', 'Assists'],
            datasets: [
              {
                label: 'Unrivaled Avg',
                data: [unrivaledAvg.points, unrivaledAvg.rebounds, unrivaledAvg.assists],
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2,
                hoverBackgroundColor: 'rgba(102, 126, 234, 1)'
              },
              {
                label: 'WNBA Avg',
                data: [wnbaAvg.points, wnbaAvg.rebounds, wnbaAvg.assists],
                backgroundColor: 'rgba(255, 140, 0, 0.8)',
                borderColor: 'rgba(255, 140, 0, 1)',
                borderWidth: 2,
                hoverBackgroundColor: 'rgba(255, 140, 0, 1)'
              }
            ]
          },
          options: {
            ...interactiveOptions,
            onClick: (event, elements) => {
              if (elements.length > 0) {
                const stat = ['Points', 'Rebounds', 'Assists'][elements[0].index];
                const league = elements[0].datasetIndex === 0 ? 'Unrivaled' : 'WNBA';
                const value = elements[0].element.$context.parsed.y;
                alert(`League Average ${stat}\n\n${league}: ${value.toFixed(2)}`);
              }
            },
            plugins: {
              ...interactiveOptions.plugins,
              tooltip: {
                ...interactiveOptions.plugins.tooltip,
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`;
                  },
                  afterLabel: (context) => {
                    const diff = context.datasetIndex === 0 
                      ? context.parsed.y - context.chart.data.datasets[1].data[context.dataIndex]
                      : context.parsed.y - context.chart.data.datasets[0].data[context.dataIndex];
                    const sign = diff > 0 ? '+' : '';
                    const percentage = ((Math.abs(diff) / context.chart.data.datasets[1 - context.datasetIndex].data[context.dataIndex]) * 100).toFixed(1);
                    return [`Difference: ${sign}${diff.toFixed(2)}`, `(${sign}${percentage}%)`];
                  }
                }
              }
            }
          }
        });
      });
  });
