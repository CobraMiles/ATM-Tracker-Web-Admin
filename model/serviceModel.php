<?php
  require_once '../config/database.php';

  function getTotalNumberOfServices(){
    $connection = get_db_connection();

    $query ="SELECT COUNT(*) AS total_services
             FROM services
             WHERE is_deleted = 0;";
    $statement = $connection -> prepare($query);
    $statement -> execute();
    return $statement->fetch(PDO::FETCH_ASSOC)['total_services'];
  }

  function get_all_services(){
    $db = get_db_connection();

    $query = "SELECT * FROM services WHERE services.is_deleted = 0";
    $statement = $db->prepare($query);
    $statement -> execute();
    $services = $statement -> fetchAll(PDO::FETCH_ASSOC);
    return $services;
    
  }
  
  function get_service($service_id){
    $connection = get_db_connection();

    $query = "SELECT 
                  service_id, service_name, service_code, service_description
                FROM services
                WHERE service_id = :id";

    $statement = $connection->prepare($query);
    $statement->execute([':id' => $service_id]);
    $row = $statement -> fetch(PDO::FETCH_ASSOC);


    $service = [
      'id' => $row['service_id'],
      'name' => $row['service_name'],
      'code' => $row['service_code'],
      'description' => $row['service_description']
    ];


    return $service;
  }

  function insert_service($name, $code, $description) {
    
    $connection = get_db_connection();

    try {
      $connection->beginTransaction();
      
      $query = "INSERT INTO 
                  services(
                      service_name,
                      service_code,
                      service_description
                      )
                VALUES (:name, :code, :description)";
      
      $statement = $connection -> prepare($query);
      $statement -> execute([
        ':name' => $name,
        ':code' => $code,
        ':description' => $description
      ]);

      $connection -> commit();
      return true;
      
    }catch(PDOException $e){
      $connection ->rollBack();
      error_log("Insert service error:".$e->getMessage());
      return false;
    }
  }

  function update_service($id, $name, $code, $description) {
    $connection = get_db_connection();

    try {
      $connection->beginTransaction();
      
      $query = "UPDATE services
                SET service_name =:name,
                    service_code =:code,
                    service_description =:description
                WHERE service_id =:id
              ";
      
      $statement = $connection -> prepare($query);
      $statement -> execute([
        ':name' => $name,
        ':code' => $code,
        ':description' => $description,
        ':id' => $id
      ]);

      $connection -> commit();
      return true;
      
    }catch(PDOException $e){
      $connection ->rollBack();
      error_log("Update service error:".$e->getMessage());
      return false;
    }
  }

  function delete_service($id){
    $connection = get_db_connection();

    try {
      $connection->beginTransaction();
      
      $query = "UPDATE services SET is_deleted = 1 WHERE service_id =:id";      
      $statement = $connection -> prepare($query);
      $statement -> execute([':id' => $id]);

      $deleteQuery = "UPDATE atms_services SET is_deleted = 1 WHERE atms_services.service_id = :id";
      $deleteStmt = $connection->prepare($deleteQuery);
      $deleteStmt->execute([":id" => $id]);
            
      $connection -> commit();
      return true;
      
    }catch(PDOException $e){
      $connection ->rollBack();
      error_log("Delete service error:".$e->getMessage());
      return false;
    }
  }