<?php

require_once '../model/atmModel.php';
require_once '../model/serviceModel.php';

function getTotalATMCount()
{
  $total_count = getTotalNumberOfATMs();
  echo json_encode([
    'success' => true,
    'data' => $total_count,
  ]);
}

function getTotalServiceCount()
{
  $total_count = getTotalNumberOfServices();
  echo json_encode([
    'success' => true,
    'data' => $total_count,
  ]);
}

function getOnlineATMCount()
{
  $online_count = getNumberOfOnlineATMs();
  echo json_encode([
    'success' => true,
    'data' => $online_count,
  ]);
}

function getVisibleATMCount()
{
  $visible_count = getNumberOfVisibleATMs();
  echo json_encode([
    'success' => true,
    'data' => $visible_count,
  ]);
}

function getAllATMCountsPerService()
{
  $services = get_all_services();
  $atm_counts_per_service = [];
  if ($services) {
    foreach ($services as $service) {
      $atm_count = getNumberOfATMsPerService($service['service_id']);
      $atm_counts_per_service[$service['service_name']] = $atm_count;
    }
  }
  header('Content-Type: application/json');
  echo json_encode([
    'success' => true,
    'data' => $atm_counts_per_service,
  ]);
}
