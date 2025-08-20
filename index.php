<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ATM Admin</title>
  <link rel="stylesheet" href="public/css/style.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <div class="app-container">
    <?php include 'view/partials/sidebar.php'; ?>

    <div class="main-panel">
      <?php include 'view/partials/header.php'; ?>

      <div id="main-view" class="main-view">
        <?php include 'view/pages/home.php' ?>
      </div>
    </div>

  </div>

  <?php include_once 'view/partials/atm_form.php'; ?>
  <?php include_once 'view/partials/service_form.php'; ?>

  <!-- <script type="module">
  import { auth } from "/atm-tracker-web/public/js/firebase-config.js";
  import { onAuthStateChanged, signOut } 
    from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

  onAuthStateChanged(auth, user => {
    if (!user) {
      window.location.href = "/atm-tracker-web/view/pages/login.php";
    } else {
      document.body.style.display = "block"; // show only if logged in
    }
  });

  // Optional logout button handling
  document.getElementById("logout-btn")?.addEventListener("click", () => {
    signOut(auth).then(() => {
      window.location.href = "/atm-tracker-web/view/pages/login.php";
    });
  });
  </script> -->
  <script src="public/js/main.js"></script>
  <script src="public/js/home.js"></script>
  <script src="public/js/atms.js"></script>
  <script src="public/js/services.js"></script>  
</body>
</html>