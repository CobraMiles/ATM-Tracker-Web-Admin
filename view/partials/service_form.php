<div id="service-modal-overlay" class="overlay hidden">
  <div class="modal">
    <div class="modal-header">
      <h2 id="service-modal-title">Add a new Service</h2>
      <button id="service-close-btn" class="close-btn" type="button">X</button>
    </div>
    <form id="service-form" class="modal-form">
      <label for="name" class="title">Name</label>
      <input type="text" id="name" name="name" required>

      <label for="code" class="title">Code</label>
      <input type="text" id="code" name="code" required>

      <label for="address" class="title">Description</label>
      <textarea id="description" name="description"></textarea>
      
      <div class="form-buttons">
        <button type="button" id="service-cancel-btn" class="cancel-btn">Cancel</button>
        <button type="submit" id="add-or-update-service-btn" class="add-btn">Add Service</button>
      </div>
    </form>
  </div>
</div>