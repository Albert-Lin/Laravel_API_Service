<?php
/**
 * Created by PhpStorm.
 * User: Albert Lin
 * Date: 2018/2/1
 * Time: 上午 12:29
 */

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Http\Utils\CUrl;

class SolDataController extends Controller
{
	function getHTMLResource(Request $request)
	{
		$url = $request['url'];
		$htmlStr = (new CUrl())->exe($url);

		return response()->json([
			'html' => $htmlStr
		]);
	}
}