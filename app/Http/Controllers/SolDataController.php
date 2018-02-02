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
use App\Http\Utils\LoadFile;

class SolDataController extends Controller
{
	function getHTMLResource (Request $request) {
		$url = $request['url'];
		$expansionJs = (new LoadFile())->loadFileToStr('./public/SolData/expansion.js');
		$htmlStr = (new CUrl())->exe($url);
		$htmlStr = str_replace("</body>", "<script>".$expansionJs."</script></body>", $htmlStr);

////		$li = [];
////		preg_match("/(?<=<li).*(?=li>)/", $htmlStr, $li);
//		$aTagArray = [];
//		preg_match("/<a (?<=<a ).*(?=>)>/", $htmlStr, $aTagArray);
//		foreach ($aTagArray as $key => $value) {
//			$replaceValue = str_replace("<a ", "<s ", $value);
//			$replaceValue = str_replace("/a", "/s", $replaceValue);
//			$htmlStr = str_replace($value, $replaceValue, $replaceValue);
//		}
		return $htmlStr;
	}
}