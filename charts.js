// charts.js
// Load data from data.json and render interactive charts using Chart.js
function normalizeName(name) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

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
          backgroundColor: 'skyblue'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { x: { ticks: { autoSkip: false } } }
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
          backgroundColor: names.map((_, i) => `hsl(${i * 360 / names.length}, 70%, 60%)`)
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } }
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
          backgroundColor: 'lightgreen'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { x: { ticks: { autoSkip: false } } }
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
          backgroundColor: 'salmon'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { x: { ticks: { autoSkip: false } } }
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
                      borderColor: 'orange',
                      backgroundColor: 'rgba(255,140,0,0.2)',
                      fill: true,
                      tension: 0.4
                    }]
                  },
                  options: {
                    responsive: true,
                    plugins: { legend: { display: true } }
                  }
                });

                // Unrivaled Table with search
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
                  backgroundColor: 'skyblue'
                },
                {
                  label: 'WNBA',
                  data: [wnbaStats.points, wnbaStats.rebounds, wnbaStats.assists],
                  backgroundColor: 'orange'
                }
              ]
            },
            options: {
              responsive: true,
              plugins: { legend: { display: true } },
              scales: { x: { ticks: { autoSkip: false } } }
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
                backgroundColor: 'skyblue'
              },
              {
                label: 'WNBA Avg',
                data: [wnbaAvg.points, wnbaAvg.rebounds, wnbaAvg.assists],
                backgroundColor: 'orange'
              }
            ]
          },
          options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: { x: { ticks: { autoSkip: false } } }
          }
        });
      });
  });
