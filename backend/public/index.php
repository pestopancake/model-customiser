<?php
// require_once '../vendor/autoload.php';

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: GET, POST, DELETE, PUT');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, content-type, Accept, Authorization');
header('Access-Control-Allow-Credentials: true');

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

header('Content-Type: application/json');
echo json_encode($response);
exit();
