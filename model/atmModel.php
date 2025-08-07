<?php
  require_once '../config/database.php';

  function get_all_atms() {
    $db = get_db_connection();

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
                LEFT JOIN atms_services ON atms.atm_id = atms_services.atm_id
                LEFT JOIN services ON atms_services.service_id = services.service_id
                WHERE atms.is_deleted = 0
                ORDER BY atms.atm_id;";

    $statement = $db->prepare($query);
    $statement->execute();
    $results = $statement -> fetchAll(PDO::FETCH_ASSOC);

    // Group results by ATM
    $grouped = [];

    foreach($results as $row) {
      $id = $row['atm_id'];
      if(!isset($grouped[$id])){
        $grouped[$id] = [
          'id' => $id,
          'name_and_location' => $row['name_and_location'],
          'address' => $row['address'],
          'latitude' => $row['latitude'],
          'longitude' => $row['longitude'],
          'services' => [],
          'is_online' => $row['is_online'],
          'is_visible' => $row['is_visible'],
        ];
      }
      $service = $row['service_name'];
      if($service !== null && $service !== "null"){
        $grouped[$id]['services'][] = $row['service_name'];
      }
    }
    return array_values($grouped);
  }
?>