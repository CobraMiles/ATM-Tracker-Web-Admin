<?php 

  require_once '../../config/database.php';
  header("Access-Control-Allow-Origin: *");
  header('Content-Type: application/json');

  try{
    $conn = get_db_connection();

    $query = "SELECT atm_id AS id, name_and_location AS name_and_loc, address AS addr, latitude AS lat, longitude AS lng, is_online AS online
              FROM atms
              WHERE is_deleted = 0 AND is_visible = 1";

    $stmt = $conn->prepare($query);
    $stmt->execute();
    $atms = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
      'success' => true,
      'data' => $atms
    ]);
  }catch(PDOException $e){
    echo json_encode([
      'success' => false,
      'message' => 'Database error',
      'error' => $e->getMessage()
    ]);
  }
?>


