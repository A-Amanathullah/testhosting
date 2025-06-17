<?php

namespace App\Http\Controllers;

use App\Models\SmsTemplate;
use Illuminate\Http\Request;

class SmsTemplateController extends Controller
{
    public function index()
    {
        return SmsTemplate::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'required|string',
        ]);
        $template = SmsTemplate::create($validated);
        return response()->json($template, 201);
    }

    public function update(Request $request, $id)
    {
        $template = SmsTemplate::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'required|string',
        ]);
        $template->update($validated);
        return response()->json($template);
    }

    public function destroy($id)
    {
        $template = SmsTemplate::findOrFail($id);
        $template->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
