<?php
// db.php - Kết nối với cơ sở dữ liệu MySQL
$servername = "feenix-mariadb.swin.edu.au";
$username = "s104188405";
$password = "110802"; // Replace with your MySQL password
$dbname = "s104188405_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>