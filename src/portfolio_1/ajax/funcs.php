<?php
/**
 * Created by PhpStorm.
 * User: wojoinc
 * Date: 10/12/17
 * Time: 1:21 PM
 */

function strToBin($string)
{
    $out = false;
    for ($a = 0; $a < strlen($string); $a++) {
        $dec = ord(substr($string, $a, 1)); //determine symbol ASCII-code
        $bin = sprintf('%08d', base_convert($dec, 10, 2)); //convert to binary representation and add leading zeros
        $out .= $bin;
    }
    return $out;
}

function toStringBin($bin)
{
    return pack('H*', base_convert($bin, 2, 16));
}

function bitAt($char, $n)
{
    return ($char >> $n) & 1;
}

function setBitAt($char, $loc, $bit)
{
    return ($char & ~(1 << $loc)) | ($bit << $loc);
}

function strToByteArr($str)
{
    return unpack('C*', $str);
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