/**
 * charts.js - Production Version x manual editing x back to normal???
 */

// Load data from data.json and render interactive charts using Chart.js
/**
 * Advanced name normalization for reliable data matching.
 * Handles accents, special characters (apostrophes/hyphens), 
 * case sensitivity, and unexpected whitespace.
 */
function normalizeName(name) {
  if (!name) return "";
  return name
    .normalize("NFD")                         // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "")          // Remove diacritical marks
    .replace(/[^a-zA-Z0-9]/g, "")             // Remove all non-alphanumeric characters (e.g., ' or -)
    .toLowerCase()                            // Standardize to lowercase
    .trim();                                  // Remove leading/trailing whitespace
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
            alert(`${player.player}\n\n📊 Full Stats:\nPoints: ${player.points}\nRebounds: ${player.rebounds}\nAssists: ${player.assists}\nGames: ${player.games}\nMinutes: ${player.minutes}\nSteals: ${player.steals}\nBlocks: ${player.blocks}`);
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
                return [`Rebounds: ${player.rebounds}`, `Assists: ${player.assists}`, `Games: ${player.games}`];
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
            alert(`${player.player}\n\n📊 Contribution to Total Points\n\nPoints: ${player.points}\nRebounds: ${player.rebounds}\nAssists: ${player.assists}`);
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
            alert(`${player.player}\n\n📊 Full Stats:\nRebounds: ${player.rebounds}\nPoints: ${player.points}\nAssists: ${player.assists}\nGames: ${player.games}`);
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
            alert(`${player.player}\n\n📊 Full Stats:\nAssists: ${player.assists}\nPoints: ${player.points}\nRebounds: ${player.rebounds}\nGames: ${player.games}`);
          }
        },
        plugins: {
          ...interactiveOptions.plugins,
          legend: { display: false }
        }
      }
    });

    // Scatter/Bubble Chart: Scoring vs Playmaking
    const scatterData = players.map((p, i) => ({
      x: p.pts || 0,
      y: p.asts || 0,
      r: Math.max((p.rebs || 0) * 0.8, 5),
      player: p.player,
      rebounds: p.rebs || 0
    }));

    new Chart(document.getElementById('scatterChart'), {
      type: 'bubble',
      data: {
        datasets: [{
          label: 'Players',
          data: scatterData,
          backgroundColor: scatterData.map((_, i) => `hsla(${260 + i * 12}, 70%, 55%, 0.7)`),
          borderColor: scatterData.map((_, i) => `hsl(${260 + i * 12}, 70%, 40%)`),
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                const d = context.raw;
                return [
                  d.player,
                  `Points: ${d.x.toFixed(1)}`,
                  `Assists: ${d.y.toFixed(1)}`,
                  `Rebounds: ${d.rebounds.toFixed(1)}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Points Per Game →', font: { size: 14, weight: 'bold' } },
            grid: { color: 'rgba(0, 0, 0, 0.05)' }
          },
          y: {
            title: { display: true, text: 'Assists Per Game →', font: { size: 14, weight: 'bold' } },
            grid: { color: 'rgba(0, 0, 0, 0.05)' }
          }
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const d = scatterData[elements[0].index];
            alert(`${d.player}\n\nScoring: ${d.x.toFixed(1)} PPG\n🏀 Playmaking: ${d.y.toFixed(1)} APG\n💪 Rebounds: ${d.rebounds.toFixed(1)} RPG`);
          }
        }
      }
    });

    // Line Chart: Top 5 Player Stat Profiles
    const top5 = [...players].sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 5);
    const profileColors = ['#667eea', '#ff8c00', '#2ecc71', '#e74c3c', '#9b59b6'];

    new Chart(document.getElementById('statProfileChart'), {
      type: 'line',
      data: {
        labels: ['PTS', 'REB', 'AST', 'STL', 'BLK'],
        datasets: top5.map((p, i) => ({
          label: p.player,
          data: [p.pts || 0, p.rebs || 0, p.asts || 0, p.stls || 0, p.blks || 0],
          borderColor: profileColors[i],
          backgroundColor: profileColors[i] + '33',
          fill: true,
          tension: 0.3,
          borderWidth: 3,
          pointRadius: 6,
          pointBackgroundColor: profileColors[i],
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }))
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: { usePointStyle: true, padding: 15, font: { size: 11, weight: 'bold' } }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}`;
              }
            }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 13, weight: 'bold' } } },
          y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.05)' } }
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const p = top5[elements[0].datasetIndex];
            alert(`${p.player}\n\n📊 Full Profile:\nPoints: ${p.pts}\nRebounds: ${p.rebs}\nAssists: ${p.asts}\nSteals: ${p.stls}\nBlocks: ${p.blks}`);
          }
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

                // Unrivaled Table with search and pagination functionality
                const unrivaledTable = document.getElementById('unrivaledTable');
                const unrivaledSearch = document.getElementById('unrivaledSearch');
                const ITEMS_PER_PAGE = 10;
                let unrivaledPage = 0;
                
                function renderUnrivaledTable(filter = '', page = 0) {
                  const filtered = players.filter(p => p.player.toLowerCase().includes(filter.toLowerCase()));
                  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
                  const paginated = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
                  
                  let html = '<table class="stats-table"><thead><tr><th>Player</th><th>Points</th><th>Rebounds</th><th>Assists</th></tr></thead><tbody>';
                  paginated.forEach(p => {
                    html += `<tr><td>${p.player}</td><td>${p.pts}</td><td>${p.rebs}</td><td>${p.asts}</td></tr>`;
                  });
                  html += '</tbody></table>';
                  
                  // Pagination controls
                  html += `<div class="pagination-controls" style="display: flex; justify-content: center; align-items: center; gap: 1em; margin-top: 1em;">`;
                  html += `<button class="pagination-btn" id="unrivaledPrev" ${page === 0 ? 'disabled' : ''} style="padding: 0.5em 1em; border: 2px solid #667eea; background: ${page === 0 ? '#e2e8f0' : 'white'}; border-radius: 8px; cursor: ${page === 0 ? 'not-allowed' : 'pointer'}; font-weight: bold;">← Prev</button>`;
                  html += `<span style="font-weight: 600; color: #4a5568;">Page ${page + 1} of ${totalPages || 1}</span>`;
                  html += `<button class="pagination-btn" id="unrivaledNext" ${page >= totalPages - 1 ? 'disabled' : ''} style="padding: 0.5em 1em; border: 2px solid #667eea; background: ${page >= totalPages - 1 ? '#e2e8f0' : 'white'}; border-radius: 8px; cursor: ${page >= totalPages - 1 ? 'not-allowed' : 'pointer'}; font-weight: bold;">Next →</button>`;
                  html += `</div>`;
                  
                  unrivaledTable.innerHTML = html;
                  
                  // Add event listeners for pagination
                  document.getElementById('unrivaledPrev')?.addEventListener('click', () => {
                    if (unrivaledPage > 0) {
                      unrivaledPage--;
                      renderUnrivaledTable(unrivaledSearch.value, unrivaledPage);
                    }
                  });
                  document.getElementById('unrivaledNext')?.addEventListener('click', () => {
                    if (unrivaledPage < totalPages - 1) {
                      unrivaledPage++;
                      renderUnrivaledTable(unrivaledSearch.value, unrivaledPage);
                    }
                  });
                }
                renderUnrivaledTable();
                unrivaledSearch.addEventListener('input', e => {
                  unrivaledPage = 0; // Reset to first page on search
                  renderUnrivaledTable(e.target.value, 0);
                });

                // WNBA Table with search and pagination
                const wnbaTable = document.getElementById('wnbaTable');
                const wnbaSearch = document.getElementById('wnbaSearch');
                let wnbaPage = 0;
                
                function renderWNBATable(filter = '', page = 0) {
                  const filtered = wnbaData.filter(p => p.player.toLowerCase().includes(filter.toLowerCase()));
                  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
                  const paginated = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
                  
                  let wnbaHtml = '<table class="stats-table"><thead><tr><th>Player</th><th>Points</th><th>Rebounds</th><th>Assists</th></tr></thead><tbody>';
                  paginated.forEach(p => {
                    wnbaHtml += `<tr><td>${p.player}</td><td>${p.points}</td><td>${p.rebounds}</td><td>${p.assists}</td></tr>`;
                  });
                  wnbaHtml += '</tbody></table>';
                  
                  // Pagination controls
                  wnbaHtml += `<div class="pagination-controls" style="display: flex; justify-content: center; align-items: center; gap: 1em; margin-top: 1em;">`;
                  wnbaHtml += `<button class="pagination-btn" id="wnbaPrev" ${page === 0 ? 'disabled' : ''} style="padding: 0.5em 1em; border: 2px solid #ff8c00; background: ${page === 0 ? '#e2e8f0' : 'white'}; border-radius: 8px; cursor: ${page === 0 ? 'not-allowed' : 'pointer'}; font-weight: bold;">← Prev</button>`;
                  wnbaHtml += `<span style="font-weight: 600; color: #4a5568;">Page ${page + 1} of ${totalPages || 1}</span>`;
                  wnbaHtml += `<button class="pagination-btn" id="wnbaNext" ${page >= totalPages - 1 ? 'disabled' : ''} style="padding: 0.5em 1em; border: 2px solid #ff8c00; background: ${page >= totalPages - 1 ? '#e2e8f0' : 'white'}; border-radius: 8px; cursor: ${page >= totalPages - 1 ? 'not-allowed' : 'pointer'}; font-weight: bold;">Next →</button>`;
                  wnbaHtml += `</div>`;
                  
                  wnbaTable.innerHTML = wnbaHtml;
                  
                  // Add event listeners for pagination
                  document.getElementById('wnbaPrev')?.addEventListener('click', () => {
                    if (wnbaPage > 0) {
                      wnbaPage--;
                      renderWNBATable(wnbaSearch.value, wnbaPage);
                    }
                  });
                  document.getElementById('wnbaNext')?.addEventListener('click', () => {
                    if (wnbaPage < totalPages - 1) {
                      wnbaPage++;
                      renderWNBATable(wnbaSearch.value, wnbaPage);
                    }
                  });
                }
                renderWNBATable();
                wnbaSearch.addEventListener('input', e => {
                  wnbaPage = 0; // Reset to first page on search
                  renderWNBATable(e.target.value, 0);
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

        // PPG Improvement Chart - Floating Bars with Gradient
        const improvementData = commonNames.map(name => {
            const unrivaledIdx = names.indexOf(name);
            const unrivaledStats = players[unrivaledIdx];
            const wnbaStats = wnbaMap[normalizeName(name)];
            
            const wnbaPPG = wnbaStats.points;
            const unrivaledPPG = unrivaledStats.pts;
            const improvementPct = ((unrivaledPPG - wnbaPPG) / wnbaPPG) * 100;

            return {
                name,
                ppgRange: [Math.min(wnbaPPG, unrivaledPPG), Math.max(wnbaPPG, unrivaledPPG)],
                unrivaledPPG,
                wnbaPPG,
                improvementPct
            };
        }).sort((a, b) => b.improvementPct - a.improvementPct).slice(0, 10);

        const improvementCanvas = document.getElementById('improvementChart');
        
        new Chart(improvementCanvas, {
          type: 'bar',
          data: {
              labels: improvementData.map(d => d.name),
              datasets: [{
                  label: 'PPG Range (WNBA to Unrivaled)',
                  data: improvementData.map(d => d.ppgRange),
                  backgroundColor: function(context) {
                      const chart = context.chart;
                      const {ctx, chartArea} = chart;
                      if (!chartArea) return '#888';
                      const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
                      gradient.addColorStop(0, '#ff8c00');
                      gradient.addColorStop(1, '#663399');
                      return gradient;
                  },
                  borderRadius: 50,
                  borderSkipped: false,
                  barPercentage: 0.6,
              }]
          },
          options: {
              indexAxis: 'y',
              responsive: true,
              plugins: {
                  legend: { display: false },
                  tooltip: {
                      callbacks: {
                          label: function(context) {
                              const d = improvementData[context.dataIndex];
                              const sign = d.improvementPct >= 0 ? '+' : '';
                              return ` ${sign}${d.improvementPct.toFixed(1)}% ${d.improvementPct >= 0 ? 'Improvement' : 'Decline'}`;
                          },
                          afterLabel: function(context) {
                              const d = improvementData[context.dataIndex];
                              return [
                                  `WNBA: ${d.wnbaPPG.toFixed(1)} PPG`,
                                  `Unrivaled: ${d.unrivaledPPG.toFixed(1)} PPG`
                              ];
                          }
                      }
                  }
              },
              scales: {
                  x: {
                      beginAtZero: false,
                      grid: {
                          color: 'rgba(0, 0, 0, 0.1)',
                          borderDash: [2, 2]
                      },
                      title: {
                          display: true,
                          text: 'Points Per Game (Orange: WNBA | Purple: Unrivaled)',
                          color: '#888'
                      }
                  },
                  y: {
                      grid: { display: false },
                      ticks: {
                          font: { weight: 'bold' }
                      }
                  }
              }
          }
        });
      });
  });