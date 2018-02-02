<?php

/**
 * Created by PhpStorm.
 * User: Albert Lin
 * Date: 2018/2/1
 * Time: 下午 06:09
 */

namespace App\Services;

use App\Utils\CUrl;
use App\Utils\LoadFile;
class SolDataService
{
	public function getHTMLSourceCode ($url) {
		// 01. get expansion JavaScript code
		$expansionJs = (new LoadFile())->loadFileToStr('./public/SolData/expansion.js');
		
		// 02. get HTML source code with argument $url
		$htmlStr = (new CUrl())->exe($url);
		
		// 03. special replace process
		// 03_1. include expansion JS
		$htmlStr = str_replace("</body>", "<script>".$expansionJs."</script></body>", $htmlStr);
		
		// 03_2. replace <a> for redirect [disable now]
//		$aTagArray = [];
//		preg_match("/<a (?<=<a ).*(?=>)>/", $htmlStr, $aTagArray);
//		foreach ($aTagArray as $key => $value) {
//			$replaceValue = str_replace("<a ", "<s ", $value);
//			$replaceValue = str_replace("/a", "/s", $replaceValue);
//			$htmlStr = str_replace($value, $replaceValue, $htmlStr);
//		}
		
		return $htmlStr;
	}
}