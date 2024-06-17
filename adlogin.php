<?php
if (isset($_POST['email']) && isset($_POST['pass'])) {
    $email = $_POST['email'];
    $password = $_POST['pass'];
    
	// Database connection
	$conn = new mysqli('localhost', 'root', '', 'test');
	if ($conn->connect_error) {
		echo "$conn->connect_error";
		die("Connection Failed : " . $conn->connect_error);
	} else {
		// Use prepared statement to prevent SQL injection
		$stmt = $conn->prepare("SELECT * FROM adminlogin WHERE email = ?");
		$stmt->bind_param("s", $email);
		$stmt->execute();
		$result = $stmt->get_result(); // Get the result set
		if ($result->num_rows > 0) {
			$data = $result->fetch_assoc();
			if ($data['password'] === $password) {
				header("Location: upload.html");
				exit; // Stop executing further code after redirection
			} else {
				echo "<h2>Invalid Email or password</h2>";
			}
		} else {
			echo "<h2>Invalid Email or password</h2>";
		}
	}
} else {
    echo "Form fields are missing.";
}
?>
