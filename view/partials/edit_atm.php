<div id="edit-atm-overlay" class="overlay hidden">
  <div class="edit-atm-modal">
    <div class="edit-atm-header">
      <h2>Update ATM</h2>
      <button id="close-btn" class="close-btn">X</button>
    </div>
    <form id="edit-atm-form" class="edit-atm-form">
      <label for="reference" class="title">Reference</label>
      <input type="text" id="reference" name="reference" required>

      <label for="name-and-location" class="title">Name and Location</label>
      <input type="text" id="name-and-location" name="name-and-location" required>

      <label for="address" class="title">Address</label>
      <input type="text" id="address" name="address" required>

      <div class="lat-long">
        <div>
          <label for="latitude">Latitude</label>
          <input type="number" step="any" id="latitude" name="latitude" required>
        </div>
        <div>
          <label for="longitude">Latitude</label>
          <input type="number" step="any" id="longitude" name="longitude" required>
        </div>
      </div>

      <fieldset id="services-container">
        <legend class="title">Services</legend>
      </fieldset>

      <div class="radio-groups">
        <div>
          <label class="title">Availability</label>
          <label><input type="radio" name="availability" value="1" checked>Online</label>
          <label><input type="radio" name="availability" value="0">Offline</label>
        </div>
        <div>
          <label class="title">Visibility</label>
          <label><input type="radio" name="visibility" value="1" checked>Enabled</label>
          <label><input type="radio" name="visibility" value="0">Disabled</label>
        </div>
      </div>
      
      <div class="form-buttons">
        <button type="button" id="cancel-btn" class="cancel-btn">Cancel</button>
        <button type="submit" id="edit-btn" class="edit-btn">Update ATM</button>
      </div>
    </form>
  </div>
</div>