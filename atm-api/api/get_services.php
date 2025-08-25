<?php

    require_once '../../config/database.php';
    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json');

    try {
      $conn = get_db_connection();
      $query = "SELECT service_id AS id, service_code AS code, service_name AS name, service_description AS description
                FROM services
                WHERE is_deleted = 0;";
      $stmt = $conn -> prepare($query);
      $stmt -> execute();
      $services = $stmt ->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode([
      'success' => true,
      'data' => $services
      ]);

    }catch(PDOException $e){
    echo json_encode([
      'success' => false,
      'message' => 'Database error',
      'error' => $e->getMessage()
    ]);
  }

?>