<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $books = DB::table('books')->get();
        return $books;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try{
            $request->validate([
                'name' => 'required',
                'book_owner' => 'required',
                'categories' => 'required',
                'status' => 'required',
                'created_by' => 'required',

            ]);
    
            $book = Book::create(['name'=> $request->name, 
                        'book_owner' => $request->book_owner,
                        'categories' => $request->categories,
                        'status' => $request->status,
                        'created_by' => $request->created_by,
                    ]);
    
            return response()->json("Successfully");
        }catch(Exception $e){
            return $e;
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book)
    {
       dd("book :",$book);

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Book $book)
    {
        dd("request edit :",$book);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Book $book)
    {
        dd("request update :",$request);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book)
    {
        $book->delete();
        return response()->json("book deleted");
    }
}
