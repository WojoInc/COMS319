<?php
/**
 * Created by PhpStorm.
 * User: wojoinc
 * Date: 10/12/17
 * Time: 1:16 PM
 */

include('funcs.php');

if (isset($_REQUEST['image'])) $image = $_REQUEST['image'];

$src = 'simple.png';
$img = imageCreateFromAny($src);
$plaintext = '';

for ($x = 0; $x < 40; $x++) {
    $y = $x;
    $rgb = imagecolorat($img, $x, $y);
    $r = ($rgb >> 16) & 0xFF;
    $g = ($rgb >> 8) & 0xFF;
    $b = $rgb & 0xFF;

    $blue = strToBin($b);
    $plaintext .= $blue[strlen($blue) - 1];
}

$plaintext = toStringBin($plaintext);
echo $plaintext;
die;