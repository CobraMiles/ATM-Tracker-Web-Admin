<div class="dashboard">
  <!-- Top metrics -->
  <div class="metrics-row">
    <div class="metric-card total-atms">
      <h4><i class="fas fa-building-columns"></i>Total number of ATMs</h4>
      <p class="value" id="atm-total-count"></p>
    </div>
    <div class="metric-card total-services">
      <h4><i class="fas fa-cogs"></i>Total number of services</h4>
      <p class="value" id="service-total-count"></p>
    </div>
    <div class="metric-card online">
      <h4><i class="fa-solid fa-signal"></i>Online ATMs</h4>
      <p class="value" id="online-count"></p>
    </div>
    <div class="metric-card visible">
      <h4><i class="fa-solid fa-eye"></i>Visible ATMs</h4>
      <p class="value" id="visible-count"></p>
    </div>
  </div>

  <!-- Map -->
  <div class="map-container">
    <div id="map-placeholder">Map will go here</div>
  </div>

  <!-- Bottom charts -->
  <div class="charts-row">
    <div class="chart-card">
      <canvas id="online-doughnut"></canvas>
    </div>
    <div class="chart-card">
      <canvas id="visible-doughnut"></canvas>
    </div>
    <div class="chart-card wide">
      <canvas id="services-bar-chart"></canvas>
    </div>
  </div>
</div>
