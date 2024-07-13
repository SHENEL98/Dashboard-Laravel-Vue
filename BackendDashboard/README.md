
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
