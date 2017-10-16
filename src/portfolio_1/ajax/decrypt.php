<?php
/**
 * Created by PhpStorm.
 * User: wojoinc
 * Date: 10/12/17
 * Time: 1:16 PM
 */

include('funcs.php');

if (isset($_REQUEST['image'])) $image = $_REQUEST['image'];

$image = 'simple.jpg';
$src = '../images/' . $image;
$img = imagecreatefromjpeg($src);
if ($img == null) echo 'Could not load image';
list($img_h, $img_w, $attr, $info) = getimagesize($src);
$plaintext = '';
//grab the first byte to determine length to read
$msg_len = 0;
$x = $y = 0;
for ($i = 0x7; $i >= 0; $i--) {
    $index = imagecolorat($img, $x, $y);
    $colors = imagecolorsforindex($img, $index);
    echo "$i => " . bitAt($colors['blue'], 0) . "\n";
    setBitAt($msg_len, $i, bitAt($colors['blue'], 0));
    if ($x + 1 > $img_w) {
        $x = 0;
        $y++;
    } else {
        $x++;
    }
}
echo "\nMessage length: " . $msg_len;

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
//echo $plaintext;
die;