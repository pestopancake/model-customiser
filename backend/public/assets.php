<?php
// require_once '../vendor/autoload.php';

$pathPrefix = 'assets';
$response = false;

if (!empty($_FILES['file'])) {
    $path_parts = pathinfo($_FILES["file"]["name"]);
    $extension = $path_parts['extension'];
    $id = uniqid();
    $filename = $id . '.' . $extension;
    $path = $pathPrefix . '/' . $filename;

    if (move_uploaded_file($_FILES['file']['tmp_name'], $path)) {
        $response = ['filename' => $filename];
    }
}

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
echo json_encode($response);
exit();
