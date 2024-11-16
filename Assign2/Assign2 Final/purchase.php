<?php
session_start();
include('db_config.php');

// Kiểm tra nếu người dùng chưa đăng nhập
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

$user_id = $_SESSION['user_id'];
$item_name = $_POST['item_name'];
$item_price = $_POST['item_price'];

// Kiểm tra số dư của người dùng
$query = "SELECT balance FROM users WHERE id = '$user_id'";
$result = mysqli_query($conn, $query);
$user = mysqli_fetch_assoc($result);

if ($user['balance'] >= $item_price) {
    // Cập nhật số dư người dùng
    $new_balance = $user['balance'] - $item_price;
    $update_balance_query = "UPDATE users SET balance = '$new_balance' WHERE id = '$user_id'";
    mysqli_query($conn, $update_balance_query);
    
    // Lưu giao dịch vào bảng purchases
    $purchase_query = "INSERT INTO purchases (user_id, item_name, item_price) VALUES ('$user_id', '$item_name', '$item_price')";
    mysqli_query($conn, $purchase_query);
    
    echo "Purchase successful! Your new balance is $".$new_balance;
} else {
    echo "Insufficient balance.";
}

