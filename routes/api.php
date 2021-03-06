<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});


Route::prefix('soldata')->group(function () {
	Route::get('html', 'SolDataController@getHTMLSource');
	Route::get('html_json', 'SolDataController@getHTMLSourceInJSON');
	Route::post('list_xpath_integration', 'SolDataController@listXPathIntegration');
	Route::post('detail_page_url', 'SolDataController@getDetailPageUrl');
});