<?php
require_once __DIR__ . "/connexion_bdd.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;

if (!$user_id) {
    echo json_encode(["error" => "❌ user_id manquant"]);
    exit();
}

try {
    // Vérifier si le personnage existe déjà dans character_selection
    $stmt = $pdo->prepare("SELECT character_name FROM character_selection WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        echo json_encode(["character_name" => $result['character_name']]); // ✅ Retourne le personnage existant
        exit();
    }

    // Aucun personnage trouvé, on attribue "the_thing" par défaut
    $defaultCharacter = "the_thing";
    $stmt = $pdo->prepare("INSERT INTO character_selection (user_id, character_name) VALUES (?, ?)");
    $stmt->execute([$user_id, $defaultCharacter]);

    echo json_encode(["character_name" => $defaultCharacter]); // ✅ Retourne le personnage par défaut
    exit();
} catch (PDOException $e) {
    echo json_encode(["error" => "❌ Erreur SQL : " . $e->getMessage()]);
}
