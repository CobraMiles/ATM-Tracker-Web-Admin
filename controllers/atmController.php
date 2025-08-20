<?php 
 
    require_once '../model/atmModel.php';

    function getAtmsList() {
      $atms = getAllATMs();
      echo json_encode([
        'success' => true,
        'data' => $atms,
      ]);
    }

    function addATM(){
      $reference = trim($_POST['reference'] ?? '');
      $name_and_location = trim($_POST['name_and_location'] ?? "");
      $address = trim($_POST['address'] ?? '');
      $latitude = floatval($_POST['latitude'] ?? 0);
      $longitude = floatval($_POST['longitude'] ?? 0);
      $is_online = intval($_POST['is_online'] ?? 1);
      $is_visible = intval($_POST['is_visible'] ?? 1);
      $services = $_POST['services'] ?? [];

      if($reference === '' || $name_and_location === '' || $address === '' || !$latitude || !$longitude){
        echo json_encode([
          'success' => false,
          'message' => 'Missing or invalid required fields.'
        ]);
        return;
      }

      $result = insertATM($reference, $name_and_location, $address, $latitude, $longitude, $is_online, $is_visible, $services);
      if($result){
        echo json_encode([
          'success' => true,
          'message' => 'ATM added successfully.'
        ]);
      }else{
        echo json_encode([
          'success' => false,
          'message' => 'Failed to add ATM.'
        ]);
      }
    }

    function getATM(){
      if (isset($_POST['atm_id']) && is_numeric($_POST['atm_id'])){
        $id = intval($_POST['atm_id']);
        $atm = selectATM($id);
        echo json_encode([
          'success' => true,
          'data' => $atm,
        ]);
      }else{
        echo json_encode([
          'success' => false,
          'message' => 'Missing or invalid required fields.'
        ]);
      }
    }

    function editATM(){
      $id = intval($_POST['atm_id']);
      $reference = trim($_POST['reference'] ?? '');
      $name_and_location = trim($_POST['name_and_location'] ?? "");
      $address = trim($_POST['address'] ?? '');
      $latitude = floatval($_POST['latitude'] ?? 0);
      $longitude = floatval($_POST['longitude'] ?? 0);
      $is_online = intval($_POST['is_online'] ?? 1);
      $is_visible = intval($_POST['is_visible'] ?? 1);
      $services = $_POST['services'] ?? [];

      if($reference === '' || $name_and_location === '' || $address === '' || !$latitude || !$longitude){
        echo json_encode([
          'success' => false,
          'message' => 'Missing or invalid required fields.'
        ]);
        return;
      }

      $result = updateATM($id, $reference, $name_and_location, $address, $latitude, $longitude, $is_online, $is_visible, $services);
      if($result){
        echo json_encode([
          'success' => true,
          'message' => 'ATM updated successfully.',
        ]);
      }else{
        echo json_encode([
          'success' => false,
          'message' => 'Failed to update ATM.'
        ]);
      }
    }

    function deleteATM() {
      $id = intval($_POST['atm_id']);
      $result = hideATM($id);
      if($result){
        echo json_encode([
          'success' => true,
          'message' => 'ATM deleted successfully.',
        ]);
      }else{
        echo json_encode([
          'success' => false,
          'message' => 'Failed to delete ATM.'
        ]);
      }
    }

    function toggleATMStatus() {
      $id = filter_input(INPUT_POST, 'atm_id', FILTER_VALIDATE_INT);
      if ($id === null || $id === false) {
        echo json_encode(["success" => false, "error" => "Invalid ID"]);
        exit;
      }
      $result = updateATMStatus($id);
      if($result === false) {
        echo json_encode([
          'success' => false,
          'message' => 'Failed to update ATM status.'
        ]);
      }else{
        echo json_encode([
          'success' => true,
          'message' => 'ATM status updated successfully.',
          'status' => $result
        ]);
      }
    }

    function toggleATMVisibility() {
      $id = filter_input(INPUT_POST, 'atm_id', FILTER_VALIDATE_INT);
      if ($id === null || $id === false) {
        echo json_encode(["success" => false, "error" => "Invalid ID"]);
        exit;
      }
      $result = updateATMVisibility($id);
      if($result === false) {
        echo json_encode([
          'success' => false,
          'message' => 'Failed to update ATM visibility.'
        ]);
      }else{
        echo json_encode([
          'success' => true,
          'message' => 'ATM visibility updated successfully.',
          'status' => $result
        ]);
      }
    }
?>