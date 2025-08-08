<?php 
 
    require_once '../model/serviceModel.php';

    function getServicesList() {
      $services = get_all_services();
      echo json_encode([
        'success' => true,
        'data' => $services,
      ]);
    }

    function getService() {
      if (isset($_POST['service_id']) && is_numeric($_POST['service_id'])){
        $id = intval($_POST['service_id']);
        $service = get_service($id);
        echo json_encode([
          'success' => true,
          'data' => $service,
        ]);
      }else{
        echo json_encode([
          'success' => false,
          'message' => 'Missing or invalid required fields.'
        ]);
        return;
      }  
    }

    function addService(){
      $name = trim($_POST['name'] ?? '');
      $code = trim($_POST['code'] ?? "");
      $description = trim($_POST['description'] ?? '');

      if($name === '' || $code === '' || $description === '' ){
        echo json_encode([
          'success' => false,
          'message' => 'Missing or invalid required fields.'
        ]);
        return;
      }

      $result = insert_service($name, $code, $description);
      if($result){
        echo json_encode([
          'success' => true,
          'message' => 'Service added successfully.',
        ]);
      }else{
        echo json_encode([
          'success' => false,
          'message' => 'Failed to add service.'
        ]);
      }
    }

    function updateService() {
      $id = intval($_POST['service_id']);
      $name = trim($_POST['name'] ?? '');
      $code = trim($_POST['code'] ?? "");
      $description = trim($_POST['description'] ?? '');

      if($name === '' || $code === '' || $description === '' ){
        echo json_encode([
          'success' => false,
          'message' => 'Missing or invalid required fields.'
        ]);
        return;
      }

      $result = update_service($id, $name, $code, $description);
      if($result){
        echo json_encode([
          'success' => true,
          'message' => 'Service updated successfully.',
        ]);
      }else{
        echo json_encode([
          'success' => false,
          'message' => 'Failed to update service.'
        ]);
      }
    }

    function deleteService() {
      $id = intval($_POST['service_id']);
      $result = delete_service($id);
      if($result){
        echo json_encode([
          'success' => true,
          'message' => 'Service deleted successfully.',
        ]);
      }else{
        echo json_encode([
          'success' => false,
          'message' => 'Failed to delete service.'
        ]);
      }
    }
?>