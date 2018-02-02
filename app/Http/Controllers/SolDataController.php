<?php
/**
 * Created by PhpStorm.
 * User: Albert Lin
 * Date: 2018/2/1
 * Time: 上午 12:29
 */

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Service\SolDataService;
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
	
	function getHTMLSource (Request $request) {
		$url = $request['url'];
//		return $this->soldataService->getHTMLSourceCode($url);
		return "OK";
	}
	
	function getHTMLSourceInJSON (Request $request) {
		$url = $request['url'];
		return response()->json([
			'html' => $this->soldataService->getHTMLSourceCode($url)
		]);
	}
	
}