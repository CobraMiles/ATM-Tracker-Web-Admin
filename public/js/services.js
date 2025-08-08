const serviceOverlay = document.getElementById('service-modal-overlay');
const serviceTitle = document.getElementById('service-modal-title');
const serviceForm = document.getElementById("service-form");
serviceForm.addEventListener('submit', (e) => handleServiceFormSubmit(e));
let isServiceFormChanged = false;
serviceForm.addEventListener('input', () => isServiceFormChanged = true)
const addOrUpdateServiceBtn = document.getElementById("add-or-update-service-btn")
const nameInput = document.getElementById('name');
const codeInput = document.getElementById('code');
const descriptionTextarea = document.getElementById('description');
const serviceCancelButton = document.getElementById("service-cancel-btn")
const serviceCloseButton = document.getElementById("service-close-btn")

let services;
let currentServiceId;

function loadServicesList() {
  fetch('routes/routes.php', {
    method: 'POST',
    body: new URLSearchParams({action: 'get_services'})
  })
  .then(res => res.json())
  .then(data => {
    if(data.success){
      services = data.data;
      const serviceHeader = document.getElementById('service-header');
      serviceHeader.innerHTML = '';
      
      const addServiceBtn = document.createElement('button');
      addServiceBtn.textContent = '+ Add Service';
      addServiceBtn.id = 'add-service-btn';
      addServiceBtn.classList.add('add-btn');
      addServiceBtn.addEventListener('click', () => {
        resetServiceForm(serviceForm);
        serviceOverlay.classList.toggle("hidden");
      });
      serviceHeader.appendChild(addServiceBtn);

      const servicesTableContainer = document.getElementById('services-table-container');
      servicesTableContainer.innerHTML = '';

      const servicesTable = document.createElement('table');
      servicesTable.classList.add('services-table');
      
      const tHead = document.createElement('thead');
      tHead.innerHTML = `<tr>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>`
      const tBody = document.createElement('tbody');

      services.forEach(service => {
        const tRow = document.createElement('tr');
        tRow.innerHTML = `<td>${service.service_name}</td>
                          <td>${service.service_code}</td>
                          <td>${service.service_description}</td>
                          <td class="actions">
                              <button data-id="${service.service_id}" class="edit-btn" onclick="editService(this)">
                                <i class="fas fa-edit"></i>
                              </button>
                              <button data-id="${service.service_id}" class="delete-btn" onclick="deleteService(this)">
                                <i class="fa-solid fa-trash"></i>
                              </button>
                          </td>`
        tBody.appendChild(tRow);
      });

      servicesTable.appendChild(tHead);
      servicesTable.appendChild(tBody);
      servicesTableContainer.appendChild(servicesTable);

    }else{
      document.getElementById('services-table-container').textContent = "Failed to Load Services.";
    }
  })
  .catch(err => {
    console.error("Fetch error:", err);
    document.getElementById('services-table-container').textContent = "Error Loading Services."
  })
}

function editService (buttonEl) {
  const serviceId = buttonEl.dataset.id;
  currentServiceId = serviceId;
  isServiceFormChanged = false;
  const payload = new URLSearchParams();
  payload.append('action', 'get_service');
  payload.append('service_id', serviceId); 

  fetch('routes/routes.php', {
      method: 'POST',
      body: payload
  })
  .then(res => res.json())
  .then(data => {
    if(data.success){
      const service = data.data
      serviceTitle.innerText = 'Update Service';
      addOrUpdateServiceBtn.innerText = 'Edit Service';
      nameInput.value = service.name;
      codeInput.value = service.code;
      descriptionTextarea.value = service.description;
      serviceOverlay.classList.remove('hidden');
    }else{
      alert(data.message || "Failed to get service.");
    }
  })
  .catch(err => {
    console.error("Fetch error:", err);
    alert("Error Loading Service details.");
  });
}

function deleteService(buttonEl){
  if(confirm("Are you sure you want to delete this service?")) {
    const serviceId = buttonEl.dataset.id;
    const payload = new URLSearchParams();
    payload.append('action', 'delete_service');
    payload.append('service_id', serviceId);
    fetch('routes/routes.php', {
      method: 'POST',
      body: payload
    })
    .then(res=>res.json())
    .then(data => {
      if(data.success){
        alert("Service deleted successfully");
        loadServicesList();
      }else{
        alert(data.message || 'Failed to delete service')
      }
    })
  }

}

function addOrUpdateService() {
  const formData = new FormData(serviceForm);
  const name = formData.get("name")?.trim();
  const code = formData.get("code")?.trim();
  const description = formData.get('description')?.trim();


  //Checks that all the fields have been filled
  if(!name || !code || !description){
    alert("Please fill in all required fields");
    return;
  }

  const payload = new URLSearchParams();
  payload.append('name', name);
  payload.append('code', code);
  payload.append('description', description);


  if(!currentServiceId){
    //Add Service
    payload.append('action', 'add_service');
    fetch('routes/routes.php', {
      method: 'POST',
      body: payload
     })
    .then(res => res.json())
    .then(data => {
      if(data.success){
        alert("Service added succesfully");
        resetServiceForm(serviceForm);
        loadServicesList();
      }else{
        alert(data.message || "Failed to add service.");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Error adding service");
    })
  }else{
    //Update Service
    payload.append('action', 'update_service');
    payload.append('service_id', currentServiceId);
    fetch('routes/routes.php', {
          method: 'POST',
          body: payload
        })
    .then(res => res.json())
    .then(data => {
      if(data.success){
        alert("Service updated successfully");
        resetServiceForm(serviceForm);
        loadServicesList();
      }else{
        alert(data.message || "Failed to update service.");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Error updating service");
    });

      }

}

function handleServiceFormSubmit(e){
  e.preventDefault();
  addOrUpdateService();
}

function resetServiceForm(form){
    form.reset();
    serviceTitle.innerText = 'Add a new Service';
    addOrUpdateServiceBtn.innerText = "Add Service"
    serviceOverlay.classList.add("hidden");
    currentServiceId = null;
    isServiceFormChanged = false;
  }

serviceCloseButton.addEventListener('click', () => {handleServiceFormClose(serviceForm)});
serviceCancelButton.addEventListener('click', () => {handleServiceFormClose(serviceForm)});


function handleServiceFormClose(form){
    if(isServiceFormChanged){
      const modeLabel = currentServiceId ? 'editing this service' : 'adding a new service';
      if(confirm(`You have unsaved changes while ${modeLabel} . Do you want to discard them?`)) {
        resetServiceForm(form);
      }
    }else{
      resetServiceForm(form);
    }
  }