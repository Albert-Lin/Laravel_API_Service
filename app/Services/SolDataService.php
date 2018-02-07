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
		
		$this->absoluteURI($htmlStr, $url);
		
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
	
	public function absoluteURI ($htmlStr, $url) {
		// 01. change $url to an stdClass
		$schemeSplit = preg_split("/:\/\//", $url);
		$allPathSplit = preg_split("/\//", $schemeSplit[1]);
		$authoritySplit = preg_split("/@/", $allPathSplit[0]);
		$pageSplit = preg_split("/\?/", $allPathSplit[count($allPathSplit)-1]);
		$uri = new \stdClass();
		$uri->scheme = $schemeSplit[0];
		$uri->userInfo = (count($authoritySplit) > 1) ? $authoritySplit[0] : null;
		$uri->hostname = (count($authoritySplit) > 1) ? $authoritySplit[1] : $authoritySplit[0];
		$uri->path = array_slice($allPathSplit, 1, count($allPathSplit)-1);
		$uri->page = (count($pageSplit) > 1) ? $pageSplit[0] : null;
		$uri->query = (count($pageSplit) > 1) ? $pageSplit[1] : $pageSplit[0];
		
		var_dump($uri) & die;
	}
}