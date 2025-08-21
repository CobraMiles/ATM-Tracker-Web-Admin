
async function getATMTotalCount() {
  const payload = new URLSearchParams();
  payload.append('action', 'get_total_atm_count');

  try {
    const res = await fetch('routes/routes.php', { method: 'POST', body: payload });
    const data = await res.json();
    return data.success ? data.data : null;
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
    return data.success ? data.data : null;
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
    return data.success ? data.data : null;
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
    return data.success ? data.data : null;
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
      ? Object.entries(data.data).map(([name, count]) => ({ name: name, count: count }))
      : null;
  } catch (err) {
    console.error("Fetch error:", err);
    return 'Error';
  }
}

async function getAtms() {
  try {
    const res = await fetch('routes/routes.php', {
      method: 'POST',
      body: new URLSearchParams({ action: 'get_atms' })
    });

    const data = await res.json();
    return data.success ? data.data : null; // return real data
  } catch (err) {
    console.error("Fetch error:", err);
    document.getElementById('map-placeholder').textContent = "Error Loading ATMs.";
    return null; // explicit return
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

let map;
let center = { lat: 4.0511, lng: 9.7679 };
let markers;

async function initMap() {
  const atms = await getAtms();
  console.log(atms);
  await google.maps.importLibrary("marker");
  const { Map, RenderingType } = await google.maps.importLibrary("maps");

  if (atms && atms.length > 0) {
    const infoWindow = new google.maps.InfoWindow({
    content: "",
    disableAutoPan: true,
  });

    markers = await Promise.all(atms.map(async (atm, index) => {
      if (index === 0) {
        center = { lat: parseFloat(atm.latitude), lng: parseFloat(atm.longitude) };
      }
      return await addMarker(atm, infoWindow);
    }));
  }

  const mapOptions = {
    center,
    zoom: 15,
    mapId: "DEMO_MAP_ID",
    renderingType: RenderingType.VECTOR,
  }

  map = new Map(document.getElementById("map-placeholder"), mapOptions);
  map.setTiltInteractionEnabled(true);
  map.setHeadingInteractionEnabled(true);
  new markerClusterer.MarkerClusterer({ markers, map });
}

async function addMarker(atm, infoWindow) {
  const { PinElement, AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const commonPinOptions = {
    glyph: 'A',
    glyphColor: 'white',
    scale: 1.5,
  }
  const onlineBackground = new PinElement({
    background: 'green',
    borderColor: 'green',
    ...commonPinOptions
  });
  const offlineBackground = new PinElement({
    background: 'red',
    borderColor: 'red',
    ...commonPinOptions
  });
  const contentString = `
  <p><b>${atm.name_and_location}</b></p>
  <p style="{margin: 0px;}">${atm.is_online === 1 ? "Online" : "Offline"}</p>`
  const marker = new AdvancedMarkerElement({
    map,
    position: { lat: parseFloat(atm.latitude), lng: parseFloat(atm.longitude) },
    title: atm.name_and_location,
    content: atm.is_online === 1 ? onlineBackground.element : offlineBackground.element,
  });

  marker.addListener("click", () => {
      infoWindow.setContent(contentString);
      infoWindow.open(map, marker);
    });

  return marker;
}





async function loadCharts() {
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

  atmTotalCount.innerText = totalAtms || 'Error';
  serviceTotalCount.innerText = totalServices || 'Error';
  onlineCount.innerText = onlineAtms || 'Error';
  visibleCount.innerText = visibleAtms || 'Error';

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

  await initMap();

  if (totalAtms && onlineAtms) {
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
  } else {
    onlineCanvas.style.display = "none";
  }

  if (totalAtms && visibleAtms) {
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
  } else {
    visibleCanvas.style.display = "none";
  }

  if (atmCountsPerService) {
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
  } else {
    servicesBarChart.style.display = "none";
  }

}