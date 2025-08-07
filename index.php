<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ATM Admin</title>
  <link rel="stylesheet" href="public/css/style.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
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

  <?php include 'view/partials/add_atm.php'; ?>

  <script src="public/js/main.js"></script>
  <script src="public/js/atms.js"></script>
</body>
</html>