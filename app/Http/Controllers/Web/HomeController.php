<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
		$user = Auth::user();

		$organizations = $user->organizations;

        return view('pages.home', [
			'organizations' => $organizations,
		]);
    }
}
