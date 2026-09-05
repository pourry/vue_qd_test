import { axiosget, axiospost, axiospostJson, axiosupload } from '../utils/axiosUtils/axiosMethods'

const ocapi = Object.assign({})

// ===== 类型 =====
ocapi.listTypes = () => axiosget('/otherCollection/type/list')
ocapi.addType = (data) => axiospostJson('/otherCollection/type/add', data)
ocapi.editType = (data) => axiospostJson('/otherCollection/type/edit', data)
ocapi.deleteType = (id) => axiospost('/otherCollection/type/delete/' + id)

// ===== 收藏 =====
ocapi.list = () => axiosget('/otherCollection/list')
ocapi.add = (formData) => axiosupload('/otherCollection/add', formData) // 带文件
ocapi.edit = (formData) => axiosupload('/otherCollection/edit', formData)
ocapi.delete = (id) => axiospost('/otherCollection/delete/' + id)
ocapi.toggleShare = (id, share) => axiospost('/otherCollection/toggleShare/' + id, { share })

// ===== 公开 =====
ocapi.publicShow = (limit = 10) => axiosget('/otherCollection/public/show', { limit })

export default ocapi
