<?php

/**
 * Created by PhpStorm.
 * User: Albert Lin
 * Date: 2018/2/1
 * Time: 上午 01:10
 */

namespace App\Http\Utils;

class CUrl
{
	public function exe($url)
	{
		$curl = curl_init();

		curl_setopt_array($curl, array(
			CURLOPT_URL => $url,
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_SSL_VERIFYPEER => false,
			CURLOPT_ENCODING => "",
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 30,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => "GET",
			CURLOPT_HTTPHEADER => array(
				"Cache-Control: no-cache",
				"Accept-Language: zh-TW,zh,zh-Hant-TW",
				"Postman-Token: ff67721f-ed60-2ab8-37d2-e88c4c934af7"
			),
		));

		$response = curl_exec($curl);
		$err = curl_error($curl);

		curl_close($curl);

		if ($err) {
			return "cURL Error #:" . $err;
		} else {
			return $response;
		}
	}
}