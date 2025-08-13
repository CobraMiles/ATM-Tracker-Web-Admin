<?php 

  require_once '../../config/database.php';
  header("Access-Control-Allow-Origin: *");
  header('Content-Type: application/json');

  try{
    $conn = get_db_connection();

    $query = "SELECT
                  atms.atm_id,
                  atms.name_and_location,
                  atms.reference,
                  atms.address,
                  atms.latitude,
                  atms.longitude,
                  atms.is_online,
                  atms.is_visible,
                  services.service_name
                FROM atms
                LEFT JOIN atms_services
                  ON atms.atm_id = atms_services.atm_id AND atms_services.is_deleted = 0
                LEFT JOIN services 
                  ON atms_services.service_id = services.service_id
                WHERE atms.is_deleted = 0 AND is_visible = 1
                ORDER BY atms.atm_id;";

    // $query = "SELECT atm_id AS id, name_and_location AS name_and_loc, address AS address, latitude AS lat, longitude AS lng, is_online AS online
    //           FROM atms
    //           WHERE is_deleted = 0 AND is_visible = 1";

    $stmt = $conn->prepare($query);
    $stmt->execute();
    $atms = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // echo json_encode([
    //   'success' => true,
    //   'data' => $atms
    // ]);
     
    $grouped = [];

    foreach($atms as $row) {
      $id = $row['atm_id'];
      if(!isset($grouped[$id])){
        $grouped[$id] = [
          'id' => $id,
          'name_and_loc' => $row['name_and_location'],
          'address' => $row['address'],
          'lat' => $row['latitude'],
          'lng' => $row['longitude'],
          'services' => [],
          'online' => $row['is_online'],
        ];
      }
      $service = $row['service_name'];
      if($service !== null && $service !== "null"){
        $grouped[$id]['services'][] = $row['service_name'];
      }
    }

    echo json_encode([
      'success' => true,
      'data' => array_values($grouped)
    ]);
  }catch(PDOException $e){
    echo json_encode([
      'success' => false,
      'message' => 'Database error',
      'error' => $e->getMessage()
    ]);
  }
?>


