/**
 * 角色权限管理 API 接口
 * 包含角色管理、权限管理、用户角色分配相关接口
 */
import { axiosget, axiosdelete, axiospost, axiospostJson } from '@/utils/axiosUtils/axiosMethods'

const rolePermissionApi = Object.assign({})

// ==================== 角色接口 ====================

// 分页查询角色列表（带搜索）
rolePermissionApi.getRoles = function (params = {}) {
    return axiosget('/role/list', params)
}

// 查询所有角色及每个角色的权限ID列表（用于前端勾选）
rolePermissionApi.getRolesWithPermissions = function () {
    return axiosget('/role/listWithPermissions', null)
}

// 查询角色详情及其拥有的权限
rolePermissionApi.getRoleDetail = function (id) {
    return axiosget('/role/detail', { id })
}

// 新增角色
rolePermissionApi.createRole = function (role) {
    return axiospostJson('/role/create', role)
}

// 更新角色
rolePermissionApi.updateRole = function (role) {
    return axiospostJson('/role/update', role)
}

// 删除角色
rolePermissionApi.deleteRole = function (id) {
    return axiospost('/role/delete', { id })
}

// 为角色分配权限
rolePermissionApi.assignPermissions = function (roleId, permissionIds) {
    return axiospostJson('/role/assignPermissions', { roleId, permissionIds })
}

// ==================== 权限接口 ====================

// 分页查询权限列表（带搜索）
rolePermissionApi.getPermissions = function (params = {}) {
    return axiosget('/permission/list', params)
}

// 查询权限详情
rolePermissionApi.getPermissionDetail = function (id) {
    return axiosget('/permission/detail', { id })
}

// 新增权限
rolePermissionApi.createPermission = function (permission) {
    return axiospostJson('/permission/create', permission)
}

// 更新权限
rolePermissionApi.updatePermission = function (permission) {
    return axiospostJson('/permission/update', permission)
}

// 删除权限
rolePermissionApi.deletePermission = function (id) {
    return axiospost('/permission/delete', { id })
}

// ==================== 用户角色接口 ====================

// 分页查询用户及其角色信息（带搜索）
rolePermissionApi.listUsers = function (params = {}) {
    return axiosget('/userRole/listUsers', params)
}

// 为用户分配角色
rolePermissionApi.assignUserRole = function (userId, roleId) {
    return axiospostJson('/userRole/assignRole', { userId, roleId })
}

// 获取当前登录用户的角色信息和权限列表
rolePermissionApi.getMyPermissions = function () {
    return axiosget('/userRole/myPermissions', null)
}

export default rolePermissionApi
