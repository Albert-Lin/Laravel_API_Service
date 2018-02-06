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
		
		
		// 03_3. add base url
//		$htmlStr = str_replace("<head>", "<head> <base href='http://www.cna.com.tw'>", $htmlStr);
		
		
		return $this->toUTF8($htmlStr);
	}
	
	public function toUTF8 ($htmlStr) {
		$output = [];
		preg_match("/(?<=charset=).*?(?=>)/", $htmlStr, $output);
		$encode = $output[0];
		$encode = preg_replace("/\"/", "", $encode);
		$encode = preg_replace("/\//", "", $encode);
		return mb_convert_encoding($htmlStr, "UTF-8", $encode);
	}
}