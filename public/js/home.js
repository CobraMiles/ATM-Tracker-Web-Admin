async function getATMTotalCount() {
  const payload = new URLSearchParams();
  payload.append('action', 'get_total_atm_count');

  try {
    const res = await fetch('routes/routes.php', { method: 'POST', body: payload });
    const data = await res.json();
    return data.success ? data.data : 'Error';
  } catch (err) {
    console.error("Fetch error:", err);
    return 'Error';
  }
}

async function getServiceTotalCount() {
  const payload = new URLSearchParams();
  payload.append('action', 'get_total_service_count');

  try {
    const res = await fetch('routes/routes.php', { method: 'POST', body: payload });
    const data = await res.json();
    return data.success ? data.data : 'Error';
  } catch (err) {
    console.error("Fetch error:", err);
    return 'Error';
  }
}

async function getOnlineCount() {
  const payload = new URLSearchParams();
  payload.append('action', 'get_online_atm_count');

  try {
    const res = await fetch('routes/routes.php', { method: 'POST', body: payload });
    const data = await res.json();
    return data.success ? data.data : 'Error';
  } catch (err) {
    console.error("Fetch error:", err);
    return 'Error';
  }
}

async function getVisibleCount() {
  const payload = new URLSearchParams();
  payload.append('action', 'get_visible_atm_count');

  try {
    const res = await fetch('routes/routes.php', { method: 'POST', body: payload });
    const data = await res.json();
    return data.success ? data.data : 'Error';
  } catch (err) {
    console.error("Fetch error:", err);
    return 'Error';
  }
}

async function getAllAtmCountsPerService() {
  const payload = new URLSearchParams();
  payload.append('action', 'get_all_atm_counts_per_service');

  try {
    const res = await fetch('routes/routes.php', { method: 'POST', body: payload });
    const data = await res.json();
    return data.success
     ? Object.entries(data.data).map(([name, count]) => ({name: name,count: count}))
     : 'Error';
  } catch (err) {
    console.error("Fetch error:", err);
    return 'Error';
  }
}

const serviceColors = [
  '#6366F1', // Indigo
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#8B5CF6', // Purple
  '#EF4444', // Red
  '#10B981', // Green
  '#3B82F6', // Blue
  '#D946EF', // Fuchsia
  '#F97316'  // Orange
];

// Function to assign colors based on number of services
function getServiceColors(count) {
  return Array.from({ length: count }, (_, i) => serviceColors[i % serviceColors.length]);
}
  




async function loadCharts(){
  const onlineCanvas = document.getElementById('online-doughnut');
  const visibleCanvas = document.getElementById('visible-doughnut');
  const servicesBarChart = document.getElementById('services-bar-chart');
  const atmTotalCount = document.getElementById('atm-total-count');
  const serviceTotalCount = document.getElementById('service-total-count');
  const onlineCount = document.getElementById('online-count');
  const visibleCount = document.getElementById('visible-count');
  
  const totalAtms = await getATMTotalCount();
  const totalServices = await getServiceTotalCount();
  const onlineAtms = await getOnlineCount();
  const visibleAtms = await getVisibleCount();
  const atmCountsPerService = await getAllAtmCountsPerService();

  atmTotalCount.innerText = totalAtms;
  serviceTotalCount.innerText = totalServices;
  onlineCount.innerText = onlineAtms;
  visibleCount.innerText = visibleAtms;

  const onlineData = {
    labels: [
      'Online',
      'Offline',
    ],
    datasets: [{
      label: 'ATM Count',
      data: [onlineAtms, totalAtms - onlineAtms],
      hoverOffset: 0,
      backgroundColor: [
        '#34D399',
        '#D1D5DB'
        ],
    }]
  }; 

  const visibleData = {
    labels: [
      'Visible',
      'Hidden',
    ],
    datasets: [{
      label: 'ATM Count',
      data: [visibleAtms, totalAtms - visibleAtms],
      hoverOffset: 0,
      backgroundColor: [
        '#3B82F6',
        '#D1D5DB'
        ],
    }]
  }; 

  const serviceData = {
    labels: atmCountsPerService.map(service => service.name),
    datasets: [{
      label: 'ATM count for this service',
      barPercentage: 0.5,
      data: atmCountsPerService.map(service => service.count),
      backgroundColor: getServiceColors(atmCountsPerService.length)
    }]
  };  

  new Chart(onlineCanvas,
    {
      type: 'doughnut',
      data: onlineData,
      options: {
        cutout: '60%',
        radius: '90%',
        animation: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            position: 'top',
            text: "Online ATMs",
            font: {
              size: 16
            }
          }
        },
      }
    }
  );
  new Chart(visibleCanvas, 
    {
      type: 'doughnut',
      data: visibleData,
      options: {
        cutout: '60%',
        radius: '90%',
        animation: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            position: 'top',
            text: "Visible ATMs",
            font: {
              size: 16
            }
          }
        },
      }
    }
  );
  new Chart(servicesBarChart, 
    {
      type: 'bar',
      data: serviceData,
      options: {
        aspectRatio: 1,
        animation: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: "Number of ATMs per service",
            font: {
              size: 16
            }
          }
        }
      }
    }
  );

}