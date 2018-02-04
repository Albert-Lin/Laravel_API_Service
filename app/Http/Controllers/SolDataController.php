<?php
/**
 * Created by PhpStorm.
 * User: Albert Lin
 * Date: 2018/2/1
 * Time: 上午 12:29
 */

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Services\SolDataService;
class SolDataController extends Controller
{
	/**
	 * @var SolDataService
	 */
	protected $soldataService;
	
	/**
	 * SolDataController constructor.
	 * @param SolDataService $soldataService
	 */
	public function __construct(SolDataService $soldataService)
	{
		$this->soldataService = new SolDataService();
	}
	
	public function getHTMLSource (Request $request) {
		$url = $request['url'];
		return $this->soldataService->getHTMLSourceCode($url);
	}
	
	public function getHTMLSourceInJSON (Request $request) {
		$url = $request['url'];
		return response()->json([
			'html' => $this->soldataService->getHTMLSourceCode($url)
		]);
	}
	
	public function listXPathIntegration () {
		return response()->json([
			"pattern" => "//html/body [1]/form [@id='aspnetForm']/div [@class='wrapper_box']/div [@class='left_wrapper_list']/div [@class='news_list']/div [@class='article_list']/ul [1]/li"
		]);
	}

	public function getDetailPageUrl (Request $request) {
		$result = "";
		$orderId = $request['orderId'];
		switch ($orderId) {
			case "0":
				$result = "http://www.cna.com.tw/news/ahel/201802030108-1.aspx";
				break;
			case "100":
				$result = "http://www.cna.com.tw/news/asoc/201802040058-1.aspx";
				break;
		}
		return response()->json([
			"detailPageUrl" => $result
		]);
	}
	
}