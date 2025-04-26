<?php

namespace App\Http\Controllers\Web;

use App\Core\OrganizationManager;
use App\Enums\FlashMessageTypes;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class OrganizationController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $name = $request->input('name');

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $manager = new OrganizationManager;

        $organization = $manager->create($request->user(), $name);

        return $organization
            ? redirect()->route('dashboard', ['organization_id' => $organization->id])->with(FlashMessageTypes::SUCCESS->value, 'Organization created successfully.')
            : redirect()->back()->withErrors(['error' => 'Failed to create organization.']);
    }
}
