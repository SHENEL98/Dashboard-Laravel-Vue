<?php
namespace Database\Seeders;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
class PermissionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /* permission lists */
        $permissions = [
            'user-edit',
            'user-create',
            'user-delete',
            'user-list',
            'book-list',
            'book-create',
            'book-edit',
            'book-delete'
        ];
        foreach($permissions as $permission){
            Permission::create(['name' => $permission]);
        }
    }
}