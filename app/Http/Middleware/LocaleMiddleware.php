<?php

namespace App\Http\Middleware;

use App\Enums\Locales;
use Closure;
use Illuminate\Support\Facades\App;

class LocaleMiddleware
{
    /**
     * Handle an incoming request.
     * Set the locale based on the query parameter or session.
     * If no locale is set, use the default locale from the config.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $locale = $request->query('locale');
        $locale_array = array_column(Locales::cases(), 'value');

        if ($locale) {
            if (in_array($locale, $locale_array)) {
                App::setLocale($locale);
                $request->session()->put('locale', $locale);
            }
        } else {
            if (session()->has('locale')) {
                app()->setLocale(session('locale'));
            } else {
                app()->setLocale(config('app.locale'));
            }
        }

        return $next($request);
    }
}
