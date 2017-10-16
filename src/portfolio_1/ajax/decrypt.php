<?php
/**
 * Created by PhpStorm.
 * User: wojoinc
 * Date: 10/12/17
 * Time: 1:16 PM
 */

include('funcs.php');

if (isset($_REQUEST['image'])) $image = $_REQUEST['image'];

$image = 'simple.png';
$src = '../images/' . $image;
list($img_h, $img_w, $attr, $info) = getimagesize($src);
ini_set("memory_limit", '128M');
$img = imagecreatefrompng($src);
if ($img == null) echo 'Could not load image';

$plaintext = '';
//grab the first byte to determine length to read
$msg_len = 0;
$x = $y = 0;
for ($i = 0x7; $i >= 0; $i--) {
    $index = imagecolorat($img, $x, $y);
    $colors = imagecolorsforindex($img, $index);
    //echo "$i => " . bitAt($colors['blue'], 0) . "\n";
    setBitAt($msg_len, $i, bitAt($colors['blue'], 0));
    if ($x + 1 > $img_w) {
        $x = 0;
        $y++;
    } else {
        $x++;
    }
}
//echo "\nMessage length: " . $msg_len ."\n";

$plaintext = array_fill(0, $msg_len, 0);
$test = 0;
for ($i = 0; $i < $msg_len; $i++) {
    for ($j = 7; $j >= 0; $j--) {
        $index = imagecolorat($img, $x, $y);
        $colors = imagecolorsforindex($img, $index);
        //echo bitAt($colors['blue'],0);
        setBitAt($plaintext[$i], $j, bitAt($colors['blue'], 0));
        if ($x + 1 > $img_w) {
            $x = 0;
            $y++;
        } else {
            $x++;
        }
    }
}
//echo print_r($plaintext) . "\n";
$plaintext = charArrtoStr($plaintext);
imagedestroy($img);
echo $plaintext;
die;