<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    /**
     * Display a listing of tags.
     */
    public function index()
    {
        return response()->json(Tag::all());
    }
}
