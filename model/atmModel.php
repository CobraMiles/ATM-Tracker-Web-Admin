<?php
  require_once '../config/database.php';

  function get_all_atms() {
    $connection = get_db_connection();

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
                WHERE atms.is_deleted = 0
                ORDER BY atms.atm_id;";

    $statement = $connection->prepare($query);
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


  function insert_atm ($ref, $name_and_loc, $address, $lat, $lng, $online, $visible, $services){
    $connection = get_db_connection();

    try {
      $connection->beginTransaction();
      
      $query = "INSERT INTO 
                  atms(
                      atms.reference,
                      atms.name_and_location,
                      atms.address,
                      atms.latitude,
                      atms.longitude,
                      atms.is_online,
                      atms.is_visible
                      )
                VALUES (:ref, :name_and_loc, :address, :lat, :lng, :online, :visible)";
      
      $statement = $connection -> prepare($query);
      $statement -> execute([
        ':ref' => $ref,
        ':name_and_loc' => $name_and_loc,
        ':address' => $address,
        ':lat' => $lat,
        ':lng' => $lng,
        ':online' => $online,
        ':visible' => $visible
      ]);

      $atm_id = $connection->lastInsertId();

      if(!empty($services)){
        $query = "INSERT INTO 
                    atms_services(
                    atms_services.atm_id,
                    atms_services.service_id
                    )
                  VALUES (:atm_id, :service_id)";
        $statement = $connection->prepare($query);

        foreach($services as $service_id){
          $statement->execute([
            ':atm_id' => $atm_id,
            ':service_id' => $service_id
          ]);
        }
      }

      $connection -> commit();
      return true;
      
    }catch(PDOException $e){
      $connection ->rollBack();
      error_log("Insert ATM error:".$e->getMessage());
      return false;
    }
  }

  function get_atm($atm_id){
    $connection = get_db_connection();

    $query = "SELECT 
                  atms.atm_id,
                  atms.name_and_location,
                  atms.reference,
                  atms.address,
                  atms.latitude,
                  atms.longitude,
                  atms.is_online,
                  atms.is_visible,
                  services.service_id
                FROM atms
                LEFT JOIN atms_services
                  ON atms.atm_id = atms_services.atm_id AND atms_services.is_deleted = 0
                LEFT JOIN services 
                  ON atms_services.service_id = services.service_id
                WHERE atms.is_deleted = 0 AND atms.atm_id = :atm_id
                ORDER BY atms.atm_id;";

    $statement = $connection->prepare($query);
    $statement->execute([':atm_id' => $atm_id]);
    $results = $statement -> fetchAll(PDO::FETCH_ASSOC);


    $atm = null;

    foreach($results as $row) {
      if($atm === null){
        $atm = [
          'id' => $row['atm_id'],
          'reference' => $row['reference'],
          'name_and_location' => $row['name_and_location'],
          'address' => $row['address'],
          'latitude' => $row['latitude'],
          'longitude' => $row['longitude'],
          'services' => [],
          'is_online' => $row['is_online'],
          'is_visible' => $row['is_visible'],
        ];
      }
      $service_id = $row['service_id'];
      if($service_id !== null && $service_id !== "null"){
        $atm['services'][] = $service_id;
      }
    }

    return $atm;
}
    

  function update_atm ($id, $ref, $name_and_loc, $address, $lat, $lng, $online, $visible, $services){
    $connection = get_db_connection();

    try {
      $connection->beginTransaction();
      
      $query = "UPDATE atms
                SET reference = :ref,
                    name_and_location =:name_and_loc,
                    address =:address,
                    latitude =:lat,
                    longitude =:lng,
                    is_online =:online,
                    is_visible =:visible
                WHERE atm_id =:id
              ";
      
      $statement = $connection -> prepare($query);
      $statement -> execute([
        ':ref' => $ref,
        ':name_and_loc' => $name_and_loc,
        ':address' => $address,
        ':lat' => $lat,
        ':lng' => $lng,
        ':online' => $online,
        ':visible' => $visible,
        ':id' => $id
      ]);

      //Delete all existing assignment of this atm to services
      $deleteQuery = "UPDATE atms_services 
                        SET is_deleted = 1 
                        WHERE atms_services.atm_id = :atm_id";
      $deleteStmt = $connection->prepare($deleteQuery);
      $deleteStmt->execute([":atm_id" => $id]);

      //Reinsert services only if they are selected
      if(!empty($services)){

        $insertQuery = "INSERT INTO 
                    atms_services(
                    atms_services.atm_id,
                    atms_services.service_id
                    )
                  VALUES (:atm_id, :service_id)";
        $statement = $connection->prepare($insertQuery);

        foreach($services as $service_id){
          $statement->execute([
            ':atm_id' => $id,
            ':service_id' => $service_id
          ]);
        }
      }

      $connection -> commit();
      return true;
      
    }catch(PDOException $e){
      $connection ->rollBack();
      error_log("Update ATM error:".$e->getMessage());
      return false;
    }
  }
  
  function delete_atm ($id){
    $connection = get_db_connection();

    try {
      $connection->beginTransaction();
      
      $query = "UPDATE atms
                SET is_deleted = 1
                WHERE atm_id =:id
              ";
      
      $statement = $connection -> prepare($query);
      $statement -> execute([':id' => $id]);
      
      //Delete the services assignment to this ATM from the atms services table
      $deleteQuery = "UPDATE atms_services 
                      SET is_deleted = 1 
                      WHERE atms_services.atm_id = :atm_id";
      $deleteStmt = $connection->prepare($deleteQuery);
      $deleteStmt->execute([":atm_id" => $id]);

      
      $connection -> commit();
      return true;
      
    }catch(PDOException $e){
      $connection ->rollBack();
      error_log("Delete ATM error:".$e->getMessage());
      return false;
    }
  }
?>