
# Backend Dashboard - Laravel 10

## Setups

- create laravel project : composer create-project laravel/laravel:^10.0 projectName
-----------------
- install breeze
- did changes in env
- uncomment DatabaseSeeder.php
- refresh seeder : php artisan migrate:fresh --seed
- 

Laravel permission by Spatie in Vue

- install : composer require spatie/laravel-permission
- config file and migration
    php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
    php artisan config:clear
    php artisan migrate
- add the package's trait to User model
    ..  use HasRoles;

- update Kernel.php
- create a role controller : php artisan make:controller RoleController -- resource
- create a seeder : php artisan make:seeder PermissionTableSeeder 
    set permissions in there, and seed : php artisan db:seed --class=PermissionTableSeeder
- create a seeder : php artisan make:seeder RoleTableSeeder 
   set roles in there, and modify user migration (add "level" colum) and seed : php artisan db:seed --class=RoleTableSeeder   
- Update RoleController