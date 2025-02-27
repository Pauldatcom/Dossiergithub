<?php
$env = parse_ini_file(__DIR__ . '/.env');

$host = $env['DB_HOST'];
$dbname = $env['DB_NAME'];
$user = $env['DB_USER'];
$pass = $env['DB_PASS'];

$conn = new mysqli($host, $user, $password, $dbname);

// ✅ Vérifie la connexion
if ($conn->connect_error) {
    die("Échec de connexion : " . $conn->connect_error);
}
?>
