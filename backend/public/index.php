<?php
// require_once '../vendor/autoload.php';

$response = false;

$json = file_get_contents('php://input');

$data = json_decode($json);

if ($data) {
    $pathPrefix = 'quotes';
    $id = uniqid();
    $filePath = "$pathPrefix/$id.json";
    file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT));
    $response = $id;
}


header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
echo json_encode($response);
exit();
