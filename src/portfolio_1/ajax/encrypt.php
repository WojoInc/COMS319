<?php
/**
 * Created by PhpStorm.
 * User: wojoinc
 * Date: 10/12/17
 * Time: 1:16 PM
 */
include('funcs.php');

if (isset($_REQUEST['image'])) $image = $_REQUEST['image'];
if (isset($_REQUEST['message'])) $message = $_REQUEST['message'];

if (isset($image) && isset($message)) {
    $bin_message = strToBin($message);
    $src = 'images/' . $image;
    $img = imageCreateFromAny($src);
    for ($x = 0; $x < strlen($bin_message); $x++) {
        $y = $x;
        $rgb = imagecolorat($img, $x, $y);
        $r = ($rgb >> 16) & 0xFF;
        $g = ($rgb >> 8) & 0xFF;
        $b = $rgb & 0xFF;

        $newB = strToBin($b);
        $newB[strlen($newB) - 1] = $bin_message[$x];
        $newB = toStringBin($newB);

        $new_color = imagecolorallocate($img, $r, $g, $newB);
        imagesetpixel($img, $x, $y, $new_color);
    }
    echo $x;
    imagepng($img, 'simple.png');
    imagedestroy($img);
}