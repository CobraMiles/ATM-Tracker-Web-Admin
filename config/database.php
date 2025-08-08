<?php
function get_db_connection() {
    $dsn = 'mysql:host=localhost;dbname=atm-tracker-app';
    $username = 'root';
    $password = '';

    try {
      $connection = new PDO($dsn, $username, $password);
      $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      return $connection;
    }catch(PDOException $e) {
      $error = "Database Error: ";
      $error .= $e -> getMessage();
      include 'view/error.php';
      exit();
    }
}
?>