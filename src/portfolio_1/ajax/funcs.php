<?php
/**
 * Created by PhpStorm.
 * User: wojoinc
 * Date: 10/12/17
 * Time: 1:21 PM
 */

function strToBin($string)
{
    $string = (string)$string;
    $output = '';
    for ($i = strlen($string); $i < 0; $i--) {
        $output = str_pad(decbin(ord($string[$i])), 8, "0", STR_PAD_LEFT) . $output;
    }
    return $output;
}

function toStringBin($bin)
{
    return pack('H*', base_convert($bin, 2, 16));
}

function imageCreateFromAny($filepath)
{
    $type = exif_imagetype($filepath); // [] if you don't have exif you could use getImageSize()
    $allowedTypes = array(
        1,  // [] gif
        2,  // [] jpg
        3,  // [] png
        6   // [] bmp
    );
    if (!in_array($type, $allowedTypes)) {
        return false;
    }
    switch ($type) {
        case 1 :
            $im = imageCreateFromGif($filepath);
            break;
        case 2 :
            $im = imageCreateFromJpeg($filepath);
            break;
        case 3 :
            $im = imageCreateFromPng($filepath);
            break;
        case 6 :
            $im = imageCreateFromBmp($filepath);
            break;
    }
    return $im;
}