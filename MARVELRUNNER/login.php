<?php
require_once __DIR__ . "/connexion_bdd.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email'], $data['password'])) {
    echo json_encode(["error" => "Champs manquants"]);
    exit();
}

$email = $data['email'];
$password = $data['password'];

try {
    $stmt = $pdo->prepare("SELECT id, password FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        echo json_encode([
            "success" => "Connexion réussie",
            "user_id" => $user['id']
        ]);
    } else {
        echo json_encode(["error" => "Email ou mot de passe incorrect"]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "Erreur SQL : " . $e->getMessage()]);
}
?>
