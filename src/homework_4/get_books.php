<?php
/**
 * Created by PhpStorm.
 * User: wojoinc
 * Date: 10/28/2017
 * Time: 9:46 AM
 */

$command = $_REQUEST['command'] ?? null;
$books = $_REQUEST['books'] ?? null;

switch ($command) {
    case 0:
        echo file_get_contents("books.txt");
        break;
    case 1:
        file_put_contents("books.txt", $books);
        break;
    default:
        break;
}