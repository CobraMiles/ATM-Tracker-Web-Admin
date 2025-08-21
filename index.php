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
  <script>
  (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
    key: "AIzaSyB4mfL6q0YHH3FlHzxmf8EQcy1NXyPjDWM",
    v: "weekly",
    // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
    // Add other bootstrap parameters as needed, using camel case.
  });
</script>
<script src="https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js"></script>
  <script src="public/js/atms.js"></script>
  <script src="public/js/services.js"></script>  
</body>
</html>