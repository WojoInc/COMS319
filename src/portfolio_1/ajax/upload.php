<?php
/**
 * Created by PhpStorm.
 * User: wojoinc
 * Date: 10/11/17
 * Time: 3:32 PM
 */

if (isset($_FILES["file"]["type"])) {
    $extensions = array("png");
    $temp = explode(".", $_FILES["file"]["name"]);
    $file_extension = end($temp);
    if (($_FILES["file"]["type"] == "image/png") && ($_FILES["file"]["size"] < 500000)//Approx. 500kb
        && in_array($file_extension, $extensions)) {
        if ($_FILES["file"]["error"] > 0) {
            echo "Return Code: " . $_FILES["file"]["error"] . "<br/><br/>";
        } else {
            if (file_exists("../uploads/" . $_FILES["file"]["name"])) {
                echo $_FILES["file"]["name"] . " <span id='invalid'><b>already exists.</b></span> ";
            } else {
                $sourcePath = $_FILES['file']['tmp_name'];
                $targetPath = "../images/" . $_FILES['file']['name'];
                move_uploaded_file($sourcePath, $targetPath);
            }
        }
    }
}