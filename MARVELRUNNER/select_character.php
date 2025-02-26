<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json"); // ✅ Indique que la réponse est du JSON

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Vérifier si `user_id` est présent
if (!isset($_GET['user_id']) || empty($_GET['user_id'])) {
    echo json_encode(["error" => "user_id manquant"]);
    exit();
}

$user_id = $_GET['user_id']; // Récupérer l'ID

// Simule une réponse JSON correcte
echo json_encode(["message" => "Personnage récupéré avec succès", "user_id" => $user_id]);
exit();
