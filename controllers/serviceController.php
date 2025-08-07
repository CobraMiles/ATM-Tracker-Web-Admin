<?php 
 
    require_once '../model/serviceModel.php';

    function getServicesList() {
      $services = get_all_services();
      echo json_encode([
        'success' => true,
        'data' => $services,
      ]);
    }

?>