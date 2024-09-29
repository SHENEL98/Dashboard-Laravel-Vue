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
        $books = DB::table('books')
                    ->join('users', 'users.id','=','books.created_by')
                    ->select('books.id','books.name','books.book_owner','books.status','books.categories',
                        'books.created_at','users.name as created_by')
                    ->get();
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
       //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Book $book)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try{
            $request->validate([
                'name' => 'required',
                'book_owner' => 'required',
                'categories' => 'required',
                'status' => 'required',
            ]);

            $book = Book::find($id);
            $book->name = $request->name;
            $book->book_owner = $request->book_owner;
            $book->categories = $request->categories;
            $book->status = $request->status;
            $book->save();

            return response()->json("book updated");

        }catch(Exception $e){
            return $e;
        }
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
