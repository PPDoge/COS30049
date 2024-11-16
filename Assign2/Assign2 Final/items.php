<?php
session_start();
include('db_config.php');

// Kiểm tra nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

$user_id = $_SESSION['user_id'];
$query = "SELECT * FROM users WHERE id = '$user_id'";
$result = mysqli_query($conn, $query);
$user = mysqli_fetch_assoc($result);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Available Game Items</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="container">
        <h1>Welcome, <?php echo $user['username']; ?>!</h1>
        <p>Here are the available game items you can purchase:</p>
        
        <input type="text" id="search-input" placeholder="Search for items..." oninput="filterItems()">
        
        <ul class="item-list" id="item-list">
            <?php
            // Lấy các items từ cơ sở dữ liệu
            $item_query = "SELECT * FROM items";
            $item_result = mysqli_query($conn, $item_query);
            
            while ($item = mysqli_fetch_assoc($item_result)) {
            ?>
            <li>
                <h3><?php echo $item['name']; ?></h3>
                <p>Type: <?php echo $item['type']; ?></p>
                <p>Price: $<?php echo number_format($item['price'], 2); ?></p>
                <form action="purchase.php" method="POST">
                    <input type="hidden" name="item_name" value="<?php echo $item['name']; ?>">
                    <input type="hidden" name="item_price" value="<?php echo $item['price']; ?>">
                    <button type="submit" class="btn">Buy Item</button>
                </form>
            </li>
            <?php } ?>
        </ul>
    </div>
    <script src="script.js"></script>
</body>
</html>
