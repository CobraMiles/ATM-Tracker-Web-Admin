<?php 
 
    require_once '../model/atmModel.php';

    function getAtmsList() {
      $atms = get_all_atms();
      echo json_encode([
        'success' => true,
        'data' => $atms,
      ]);
    }

?>