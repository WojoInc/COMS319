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
    $bin_message = strToByteArr($message);
    $len = sizeof($bin_message);
    echo $len . "\n";
    $src = '../images/' . $image;
    $img = imagecreatefromjpeg($src);
    if ($img == null) echo 'Could not load image';
    list($img_h, $img_w, $attr, $info) = getimagesize($src);
    $x = $y = 0;
    //encode message length into the first 8 bits
    for ($i = 0x8; $i >= 0; $i--) {
        $index = imagecolorat($img, $x, $y);
        $colors = imagecolorsforindex($img, $index);
        echo "$i => " . bitAt($len, $i) . "\n";
        setBitAt($colors['blue'], 0, bitAt($len, $i));
        //$colors['blue'] += bitAt($len,$i);
        $new_color = imagecolorallocate($img, $colors['red'], $colors['green'], $colors['blue']);
        imagesetpixel($img, $x, $y, $new_color);
        if ($x + 1 > $img_w) $x = 0;
    }
    foreach ($bin_message as $char) {

        for ($i = 7; $i >= 0; $i--) {
            $index = imagecolorat($img, $x, $y);
            $colors = imagecolorsforindex($img, $index);
            /*$r = ($index >> 16) & 0xFF;
            $g = ($index >> 8) & 0xFF;
            $b = $index & 0xFF;*/
            //echo $colors['blue'] . "=> ";
            setBitAt($colors['blue'], 0, bitAt($len, $i));
            //$colors['blue'] += bitAt($char,$i);
            //echo $colors['blue'] . "\n";
            $new_color = imagecolorallocate($img, $colors['red'], $colors['green'], $colors['blue']);
            imagesetpixel($img, $x, $y, $new_color);
            if ($x + 1 > $img_w) $x = 0;
        }
    }
    if (imagejpeg($img, '../images/simple.jpg', 100)) {
        echo "Image created";
    }
    imagedestroy($img);
}