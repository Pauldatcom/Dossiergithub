<?php
$host = "localhost";
$user = "root"; // Vérifie l'utilisateur WAMP
$password = ""; // Laisse vide si tu n'as pas défini de mot de passe
$dbname = "MARVELRUNNER"; // Assure-toi que la base existe bien

$conn = new mysqli($host, $user, $password, $dbname);

// ✅ Vérifie la connexion
if ($conn->connect_error) {
    die("Échec de connexion : " . $conn->connect_error);
}
?>
