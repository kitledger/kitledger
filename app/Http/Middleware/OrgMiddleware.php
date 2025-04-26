<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class OrgMiddleware
{
    /**
     * Handle an incoming request.
     * This middleware checks if the user is part of the organization and if so, sets the organization in the session.
	 * If the user is not part of the organization, it returns a 404 error.
	 * This middleware should not be used globally, but rather on route groups that are scoped to a specific organization.
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        $organization = $user->organizations()->where('organization_id', $request->segment(2))->first();

        if (!$organization) {
            return abort(404);
        }

		$request->session()->put('organization', $organization);
		return $next($request);
    }
}