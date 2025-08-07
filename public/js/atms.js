let formEventsInitialized = false;  //Used to make sure that the event listeners on the add modal are added once only
let isChanged = false; //Used to check whether a change has been done on the add form

function loadATMList() { 

  fetch('routes/routes.php', {
    method: 'POST',
    body: new URLSearchParams({action: 'get_atms'})
  })
  .then(res => res.json())
  .then(data => {
    if(data.success){
      const atms = data.data;
      const atmList = document.getElementById('atm-list');
      const atmHeader = document.getElementById('atm-header');
      atmList.innerHTML = '';
      atmHeader.innerHTML = '';
      
      const addATMBtn = document.createElement('button');
      addATMBtn.textContent = '+ Add ATM';
      addATMBtn.id = 'add-atm-btn';
      addATMBtn.classList.add('add-atm-btn');
      addATMBtn.addEventListener('click', setUpAddATMModal);

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
            <button data-id="${atm.id}" class="edit-btn"><i class="fas fa-edit"></i></button>
            <button data-id="${atm.id}" class="delete-btn"><i class="fa-solid fa-trash"></i></i></button>
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

//This function displays the addATM Modal and sets up the event listeners and corresponding handlers
//Including the events for the close and cancel buttons
function setUpAddATMModal(){
  if(!formEventsInitialized){
    const form = document.getElementById("add-atm-form")
    form.addEventListener('input', () => isChanged = true);

    const closeButton = document.getElementById("close-btn")
    closeButton.addEventListener('click', () => {handleFormClose(form)});

    const cancelButton = document.getElementById("cancel-btn")
    cancelButton.addEventListener('click', () => {handleFormClose(form)});

    formEventsInitialized = true;
  }
  const overlay = document.getElementById("add-atm-overlay");
  const servicesContainer = document.getElementById("services-container");
  overlay.classList.remove("hidden");
  loadServices();
  

  function loadServices(){
    servicesContainer.innerHTML = `<p>Loading services...</p>`;

    fetch('routes/routes.php', {
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

  function handleFormClose(form){
    if(isChanged){
      if(confirm("You have unsaved changes. Do you want to discard them?")) {
        resetForm(form);
      }
    }else{
      resetForm(form);
    }
  }

  function resetForm(form){
    form.reset();
    overlay.classList.add("hidden");
    isChanged = false;
  }
}

function submitAddATMModal(){

}