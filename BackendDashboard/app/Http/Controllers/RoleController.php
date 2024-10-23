<?php
namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $roles = Role::orderBy('id','DESC')->get();

        $rolePermissions = Permission::join("role_has_permissions","role_has_permissions.permission_id","=","permissions.id")->join("roles","roles.id","=","role_has_permissions.role_id")
            ->select("roles.id as role_id", "permissions.name as permission_name")
            ->get();

        return response()->json(array(
            'roles' => $roles,
            'rolePermissions' => $rolePermissions, 
        ));
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $permission = Permission::get();
        return $permission;
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try{
            $request->validate([
                'name' => 'required',
                'permission' => 'required'
            ]);
            
            $role = Role::create(['name'=> $request->name, 'guard_name' => 'web']);
    
            $role->syncPermissions($request->permission);
    
            return $this->sendResponse(null,'Successfully',200);
        }catch(Exception $e){
            return $this->sendResponse(null, $e, 500);

        }
    }
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    /*public function show($id)
    {
        $role = Role::find($id);
        $rolePermissions = Permission::join("role_has_permissions","role_has_permissions.permission_id","=","permissions.id")
            ->where("role_has_permissions.role_id",$id)
            ->get();
        $data['roles'] = $role;
        $data['permissions'] = $rolePermissions;
        return $data;
       // return $this->sendResponse($data, 'Success', 200);
    }*/
    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $role = Role::find($id);
        $permission = Permission::get();
        $rolePermissions = DB::table("role_has_permissions")->where("role_has_permissions.role_id",$id)
            ->pluck("role_has_permissions.permission_id","role_has_permissions.permission_id")
            ->all();
        $data['roles'] = $role;
        $data['permission'] = $permission;
        $data['rolePermissions'] = $rolePermissions;
    
        return $this->sendResponse($data, 'Success', 200);
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required',
            'permission' => 'required'
        ]);
        $role = Role::find($id);
        $role->name = $request->name;
        $role->save();
        $role->syncPermissions($request->permission);
        return $this->sendResponse(null,'Successfully',200);
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $role = Role::find($id);
        
        if($role){
            $role->delete();
            return $this->sendResponse(null,'Successfully deleted',200);
        }
        return $this->sendError(null,'Error',404);
    }

    public function sendResponse($result, $message, $code)
    {
        return response()->json([
            'success' => true,
            'data'    => $result,
            'message' => $message,
        ], $code);
    }

    public function getUserWithRoles($roleId){
       // Find the role by ID
       $role = Role::find($roleId);

       if (!$role) {
           return response()->json(['message' => 'Role not found'], 404);
       }

       // Get users associated with the role using the relationship
       $users = $role->users;  // This works because Spatie sets up a many-to-many relationship

       return response()->json($users);
    }
}