<?php
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    require_once '../controllers/atmController.php';
    require_once '../controllers/serviceController.php';


    $action = $_POST['action'] ?? '';

    switch ($action) {
      case 'get_atms':
        getAtmsList();
        break;
      case 'get_services':
        getServicesList();
        break;
      case 'add_atm':
        addATM();
        break;
      case 'get_atm':
        getATM();
        break;
      case 'update_atm':
        updateATM();
        break;
      case 'delete_atm':
        deleteATM();
        break;
      case 'toggle_atm_status':
        toggleATMStatus();
        break;
      case 'toggle_atm_visibility':
        toggleATMVisibility();
        break;
      case 'get_service':
        getService();
        break;
      case 'add_service':
        addService();
        break;
      case 'update_service':
        updateService();
        break;
      case 'delete_service':
        deleteService();
        break;
    }
?>