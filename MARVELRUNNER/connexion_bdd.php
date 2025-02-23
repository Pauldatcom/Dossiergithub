<?php
$host = "localhost"; // Adresse du serveur MySQL (ne change pas en local)
$dbname = "marvelrunner"; // Mets ici le nom correct de ta base de données
$username = "root"; // En local, l'utilisateur par défaut est souvent "root"
$password = ""; // En local avec WAMP, souvent le mot de passe est vide

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erreur de connexion à la base de données : " . $e->getMessage());
}
?>