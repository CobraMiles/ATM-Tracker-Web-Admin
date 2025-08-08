const atmOverlay = document.getElementById('atm-modal-overlay');
const atmTitle = document.getElementById('atm-modal-title');
const atmForm = document.getElementById("atm-form");
atmForm.addEventListener('submit', (e) => handleATMFormSubmit(e));
let isAtmFormChanged = false; //Used to check whether a change has been done on the add form
atmForm.addEventListener('input', () => isAtmFormChanged = true)
const addOrUpdateATMBtn = document.getElementById("add-or-update-atm-btn")
const referenceInput = document.getElementById('reference');
const nameAndLocationInput = document.getElementById('name-and-location');
const addressInput = document.getElementById('address');
const latitudeInput = document.getElementById('latitude');
const longitudeInput = document.getElementById('longitude');
const servicesContainer = document.getElementById("services-container");
const availabilityRadiobuttons = document.querySelectorAll('input[name="availability"]');
const visibilityRadiobuttons = document.querySelectorAll('input[name="visibility"]');
const atmCancelButton = document.getElementById("atm-cancel-btn")
const atmCloseButton = document.getElementById("atm-close-btn")

let currentAtmId;
let atms;
let atmServices;

function loadATMList() { 

  fetch('routes/routes.php', {
    method: 'POST',
    body: new URLSearchParams({action: 'get_atms'})
  })
  .then(res => res.json())
  .then(data => {
    if(data.success){
      atms = data.data;
      const atmList = document.getElementById('atm-list');
      const atmHeader = document.getElementById('atm-header');
      atmList.innerHTML = '';
      atmHeader.innerHTML = '';
      
      const addATMBtn = document.createElement('button');
      addATMBtn.textContent = '+ Add ATM';
      addATMBtn.id = 'add-atm-btn';
      addATMBtn.classList.add('add-btn');
      addATMBtn.addEventListener('click', () => {
        resetAtmForm(atmForm);
        loadServices();
        atmOverlay.classList.toggle("hidden");
      });

      atmHeader.appendChild(addATMBtn);


      atms.forEach(atm => {
        const atmCard = document.createElement('div');
        atmCard.id = `atm-${atm.id}`;
        atmCard.classList.add('atm-card');

        const atmCardHeader = document.createElement('div');
        atmCardHeader.classList.add('atm-card-header');
        atmCardHeader.innerHTML = `
          <div>Name and Location</div>
          <div>Address</div>
          <div>Services</div>
          <div>Status</div>
          <div class="action">Action</div>
        `;

        const atmCardContent = document.createElement('div');
        atmCardContent.classList.add('atm-card-content');
        atmCardContent.innerHTML = `
          <div>${atm.name_and_location}</div>
          <div>${atm.address}</div>
          <div>
          ${atm.services.length === 0
            ? "No services available"
            : `<ul class="services-list">            
                  ${atm.services.map(service => `<li>${service}</li>`).join('')}                
                </ul>`
          }
           
          </div>
          <div>
            <div>
              <div class="status-item">
                <span>Online</span>
                 ${atm.is_online == 1
                 ? '<i class="fa-solid fa-toggle-on"></i>'
                 : '<i class="fa-solid fa-toggle-off"></i>'
                }
              </div>
              <div class="status-item">
                <span>Visible</span>
                ${atm.is_visible == 1
                ? '<i class="fa-solid fa-toggle-on"></i>'
                : '<i class="fa-solid fa-toggle-off"></i>'
                }
              </div>
            </div>
          </div>
          <div class="action-buttons">
            <button data-id="${atm.id}" class="edit-btn" onclick="editAtm(this)"><i class="fas fa-edit"></i></button>
            <button data-id="${atm.id}" class="delete-btn" onclick="deleteATM(this)"><i class="fa-solid fa-trash"></i></i></button>
          </div>          
        `;
        atmCard.appendChild(atmCardHeader);
        atmCard.appendChild(atmCardContent);
        atmList.appendChild(atmCard);
      });
    }else{
      document.getElementById('atm-list').textContent = "Failed to Load ATMs.";
    }
  })
  .catch(err => {
    console.error("Fetch error:", err);
    document.getElementById('atm-list').textContent = "Error Loading ATMs."
  })
}

function loadServices(){
    servicesContainer.innerHTML = `<p>Loading services...</p>`;

      return fetch('routes/routes.php', {
      method: 'POST',
      body: new URLSearchParams({action: 'get_services'})
    })
    .then(res => res.json())
    .then(data => {
      if(data.success){
        const services = data.data;
        servicesContainer.innerHTML = '';
        console.log(services);

        if(!Array.isArray(services)){
          servicesContainer.innerHTML = `<p style="color: red;">Invalid response from server</p>`;
          return;
        }

        services.forEach(service => {
          const label = document.createElement('label');
          label.style.display = 'block';

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.name = 'services[]';
          checkbox.value = service.service_id;

          label.appendChild(checkbox);
          label.append(`${service.service_name}`);
          servicesContainer.appendChild(label);
        });
      }else{
        servicesContainer.innerHTML = `<p style="color:red;">Failed to load services</p>`
      }
    })
    .catch(error => {
      console.error("Failed to fetch services:", error);
      servicesContainer.innerHTML = `<p style="color:red;">Failed to load services</p>`
    })
  }


function editAtm(buttonEl) {
  const atmId = buttonEl.dataset.id;
  currentAtmId = atmId;
  isAtmFormChanged = false;
  const payload = new URLSearchParams();
  payload.append('action', 'get_atm');
  payload.append('atm_id', atmId);
  
  fetch('routes/routes.php', {
      method: 'POST',
      body: payload
    })
    .then(res => res.json())
    .then(data => {
      if(data.success){
        const atm = data.data;
        serviceTitle.innerText = 'Update ATM';
        addOrUpdateATMBtn.innerText = 'Edit ATM';
        referenceInput.value = atm['reference'];
        nameAndLocationInput.value = atm['name_and_location'];
        addressInput.value = atm['address'];
        latitudeInput.value = atm['latitude'];
        longitudeInput.value = atm['longitude'];
        availabilityRadiobuttons.forEach(radio => {
          radio.checked = (radio.value === String(atm["is_online"]));
        });
        visibilityRadiobuttons.forEach(radio => {
          radio.checked = (radio.value === String(atm["is_visible"]));
        })
        loadServices().then(()=>{
          let servicesCheckboxes = document.querySelectorAll('input[name="services[]"]');
        servicesCheckboxes.forEach(checkbox =>
          checkbox.checked = atm['services'].includes(parseInt(checkbox.value))
          )   
       
        });    
        atmOverlay.classList.remove("hidden");
      }else{
        alert(data.message || "Failed to get ATM.");
      }
    })
    .catch(err => {
    console.error("Fetch error:", err);
    alert("Error Loading ATM details.");
  })
}

function addOrUpdateATM() {
  const formData = new FormData(atmForm);
  const reference = formData.get("reference")?.trim();
  const nameAndLocation = formData.get("name-and-location")?.trim();
  const address = formData.get('address')?.trim();
  const latitude = formData.get('latitude');
  const longitude = formData.get('longitude');
  const selectedServices = formData.getAll('services[]');
  const availability = formData.get('availability');
  const visibility = formData.get('visibility');
  console.log(selectedServices);

  //Checks that all the fields have been filled
  if(!nameAndLocation || !address || !latitude || !longitude){
    alert("Please fill in all required fields");
    return;
  }

  const payload = new URLSearchParams();
  payload.append('reference', reference);
  payload.append('name_and_location', nameAndLocation);
  payload.append('address', address);
  payload.append('latitude', latitude);
  payload.append('longitude', longitude);
  payload.append('is_online', availability);
  payload.append('is_visible', visibility);

  selectedServices.forEach(serviceId => {
    payload.append('services[]', serviceId);
  })
  

  if(!currentAtmId){
    //Add ATM
    payload.append('action', 'add_atm');
    fetch('routes/routes.php', {
      method: 'POST',
      body: payload
     })
    .then(res => res.json())
    .then(data => {
      if(data.success){
        alert("ATM added succesfully");
        resetAtmForm(atmForm);
        loadATMList();
      }else{
        alert(data.message || "Failed to add ATM.");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Error adding ATM");
    })
  }else{
    //Update ATM
    payload.append('action', 'update_atm');
    payload.append('atm_id', currentAtmId);
    fetch('routes/routes.php', {
          method: 'POST',
          body: payload
        })
    .then(res => res.json())
    .then(data => {
      if(data.success){
        alert("ATM updated successfully");
        resetAtmForm(atmForm);
        loadATMList();
      }else{
        alert(data.message || "Failed to update ATM.");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Error updating ATM");
    });

      }

    }

function handleATMFormSubmit(e){
    e.preventDefault();
    addOrUpdateATM();
    
}

function resetAtmForm(form){
    form.reset();
    serviceTitle.innerText = 'Add a new ATM';
    addOrUpdateATMBtn.innerText = "Add ATM"
    atmOverlay.classList.add("hidden");
    currentAtmId = null;
    isAtmFormChanged = false;
  }

atmCloseButton.addEventListener('click', () => {handleAtmFormClose(atmForm)});
atmCancelButton.addEventListener('click', () => {handleAtmFormClose(atmForm)});


function handleAtmFormClose(form){
    if(isAtmFormChanged){
      const modeLabel = currentAtmId ? 'editing this ATM' : 'adding a new ATM';
      if(confirm(`You have unsaved changes while ${modeLabel} . Do you want to discard them?`)) {
        resetAtmForm(form);
      }
    }else{
      resetAtmForm(form);
    }
  }

function deleteATM(buttonEl){
  if(confirm('Are you sure you want to DELETE this ATM?')){
      const atmId = buttonEl.dataset.id;
      currentAtmId = atmId;
      const payload = new URLSearchParams();
      payload.append('action', 'delete_atm');
      payload.append('atm_id', atmId);
      
      fetch('routes/routes.php', {
          method: 'POST',
          body: payload
        })
        .then(res => res.json())
        .then(data => {
          if(data.success){
          alert("ATM deleted successfully");
          loadATMList();
          }else{
            alert(data.message || "Failed to delete ATM.");
          }
        })
        .catch(err => {
        console.error("Fetch error:", err);
        alert("Error deleting ATM details.");
      })
  }
}

//This function displays the addATM Modal and sets up the event listeners and corresponding handlers
//Including the events for the close and cancel buttons

let atmFormEventsInitialized = false;  //Used to make sure that the event listeners on the add modal are added once only
// //Used to check whether a change has been done on the add form

function setUpATMModal(){

  if(!atmFormEventsInitialized){
    atmForm.addEventListener('input', () => isAtmFormChanged = true);
    atmForm.addEventListener('submit', handleATMFormSubmit);

    

    atmFormEventsInitialized = true;
  }
  const overlay = document.getElementById("atm-modal-overlay");
  const servicesContainer = document.getElementById("services-container");
  overlay.classList.remove("hidden");
  loadServices();
  

  
 

  
  
}

function setUpEditATMModal(){
}