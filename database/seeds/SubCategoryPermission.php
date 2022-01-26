<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubCategoryPermission extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        try {
            DB::table('permissions')->insert(array(

                array(
                    'id' => 195,
                    'name' => 'sub_categories.index',
                    'guard_name' => 'web',
                    'created_at' => '2020-08-23 14:58:02',
                    'updated_at' => '2020-08-23 14:58:02',
                    'deleted_at' => NULL,
                ),

                array(
                    'id' => 196,
                    'name' => 'sub_categories.create',
                    'guard_name' => 'web',
                    'created_at' => '2020-08-23 14:58:02',
                    'updated_at' => '2020-08-23 14:58:02',
                    'deleted_at' => NULL,
                ),

                array(
                    'id' => 197,
                    'name' => 'sub_categories.store',
                    'guard_name' => 'web',
                    'created_at' => '2020-08-23 14:58:02',
                    'updated_at' => '2020-08-23 14:58:02',
                    'deleted_at' => NULL,
                ),

                array(
                    'id' => 198,
                    'name' => 'sub_categories.edit',
                    'guard_name' => 'web',
                    'created_at' => '2020-08-23 14:58:02',
                    'updated_at' => '2020-08-23 14:58:02',
                    'deleted_at' => NULL,
                ),

                array(
                    'id' => 199,
                    'name' => 'sub_categories.update',
                    'guard_name' => 'web',
                    'created_at' => '2020-08-23 14:58:02',
                    'updated_at' => '2020-08-23 14:58:02',
                    'deleted_at' => NULL,
                ),

                array(
                    'id' => 200,
                    'name' => 'sub_categories.destroy',
                    'guard_name' => 'web',
                    'created_at' => '2020-08-23 14:58:02',
                    'updated_at' => '2020-08-23 14:58:02',
                    'deleted_at' => NULL,
                ),
            ));

            DB::table('role_has_permissions')->insert(array(
                array(
                    'permission_id' => 195,
                    'role_id' => 2,
                ),
                array(
                    'permission_id' => 196,
                    'role_id' => 2,
                ),
                array(
                    'permission_id' => 197,
                    'role_id' => 2,
                ),
                array(
                    'permission_id' => 198,
                    'role_id' => 2,
                ),
                array(
                    'permission_id' => 199,
                    'role_id' => 2,
                ),
                array(
                    'permission_id' => 200,
                    'role_id' => 2,
                ),


                array(
                    'permission_id' => 195,
                    'role_id' => 3,
                ),
                array(
                    'permission_id' => 196,
                    'role_id' => 3,
                ),
                array(
                    'permission_id' => 197,
                    'role_id' => 3,
                ),


                array(
                    'permission_id' => 198,
                    'role_id' => 4,
                ),

                array(
                    'permission_id' => 199,
                    'role_id' => 5,
                ),

            ));
        } catch (Exception $exception) {
        }
    }
}
