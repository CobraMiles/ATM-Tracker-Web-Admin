<?php
  require_once '../config/database.php';

  function get_all_services(){
    $db = get_db_connection();

    $query = "SELECT * FROM services WHERE services.is_deleted = 0";
    $statement = $db->prepare($query);
    $statement -> execute();
    $services = $statement -> fetchAll(PDO::FETCH_ASSOC);
    return $services;
    
  }