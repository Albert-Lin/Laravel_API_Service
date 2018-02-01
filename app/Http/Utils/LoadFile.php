<?php
/**
 * Created by PhpStorm.
 * User: Albert Lin
 * Date: 2018/2/1
 * Time: 下午 06:10
 */

namespace App\Http\Utils;

use \Illuminate\Support\Facades\Storage;

class LoadFile
{
	public function loadFileToStr($filePath)
	{
		return Storage::get($filePath);
	}
}