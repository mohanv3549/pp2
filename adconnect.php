<?php
if(isset($_POST['Name'], $_POST['email'], $_POST['password'], $_POST['mobile'])) {
    $Name = $_POST['Name'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $mobile = $_POST['mobile'];  
      // Check if all fields are non-empty
    if(empty($Name) || empty($email) || empty($password) || empty($mobile)) {
        echo "All fields are required";
        exit;
    }

    // Check if Name is a string
    if(!is_string($Name)) {
        echo "Name should be a string";
        exit;
    }

    // Check if email ends with @gmail.com
    if(substr($email, -10) !== "@gmail.com") {
        echo "Email should end with @gmail.com";
        exit;
    }

    // Check if mobile number is 10 digits and is numeric
    if(strlen($mobile) !== 10 || !is_numeric($mobile)) {
        echo "Mobile number should be 10 digits and should be a number";
        exit;
    }


    
    // Check if password meets the minimum length requirement
    if(strlen($password) < 8) {
        echo "Password must be at least 8 characters long";
        exit; // Exit the script if password is too short
    }

    // Database connection
    $conn = new mysqli('localhost', 'root', '', 'test');
    if ($conn->connect_error) {
        die("Connection Failed : " . $conn->connect_error);
    } else {
        // Check if the user already exists
        $stmt_check = $conn->prepare("SELECT * FROM adminlogin WHERE email = ?");
        $stmt_check->bind_param("s", $email);
        $stmt_check->execute();
        $result_check = $stmt_check->get_result();
        $count = $result_check->num_rows;
        $stmt_check->close();

        if ($count > 0) {
            echo "User already exists";
        } else {
            // Insert new user
            $stmt_insert = $conn->prepare("INSERT INTO adminlogin (Name, email, password, mobile) VALUES (?, ?, ?, ?)");
            $stmt_insert->bind_param("ssss", $Name, $email, $password, $mobile);
            
            if ($stmt_insert->execute()) {
                echo "Registration successful";
            } else {
                echo "Error: " . $stmt_insert->error;
            }

            $stmt_insert->close();
        }
        
        $conn->close();
    }
} else {
    echo "All fields are required";
}
?>
