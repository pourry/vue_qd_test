<template>
    <div class="footer-control">
        <h2 class="page-title">底部内容控制</h2>

        <!-- 内容板块：简介、联系方式、备案（固定类型，行内编辑） -->
        <div class="section-card">
            <div class="card-header">
                <h3>内容板块</h3>
            </div>
            <div class="card-body">
                <!-- 简介 -->
                <div class="inline-form">
                    <div class="inline-form-header">
                        <el-tag type="primary" size="small">简介</el-tag>
                        <el-switch v-model="sectionForms.intro.enabled" />
                        <el-button type="primary" size="small" @click="saveSection('intro')">保存</el-button>
                    </div>
                    <el-form :model="sectionForms.intro" label-width="60px" size="small">
                        <el-form-item label="标题">
                            <el-input v-model="sectionForms.intro.title" placeholder="板块标题" />
                        </el-form-item>
                        <el-form-item label="内容">
                            <el-input v-model="sectionForms.intro.content" type="textarea" :rows="2" placeholder="简介内容" />
                        </el-form-item>
                    </el-form>
                </div>

                <!-- 联系方式 -->
                <div class="inline-form">
                    <div class="inline-form-header">
                        <el-tag type="warning" size="small">联系方式</el-tag>
                        <el-switch v-model="sectionForms.contact.enabled" />
                        <el-button type="primary" size="small" @click="saveSection('contact')">保存</el-button>
                    </div>
                    <el-form :model="sectionForms.contact" label-width="60px" size="small">
                        <el-form-item label="标题">
                            <el-input v-model="sectionForms.contact.title" placeholder="板块标题" />
                        </el-form-item>
                        <el-form-item label="内容">
                            <el-input v-model="sectionForms.contact.content" type="textarea" :rows="3" placeholder="邮箱、电话等，每行一条" />
                        </el-form-item>
                    </el-form>
                </div>

                <!-- 备案 -->
                <div class="inline-form">
                    <div class="inline-form-header">
                        <el-tag type="info" size="small">备案</el-tag>
                        <el-switch v-model="sectionForms.record.enabled" />
                        <el-button type="primary" size="small" @click="saveSection('record')">保存</el-button>
                    </div>
                    <el-form :model="sectionForms.record" label-width="60px" size="small">
                        <el-form-item label="内容">
                            <el-input v-model="sectionForms.record.content" placeholder="备案号等信息" />
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>

        <!-- 快速链接管理（可增减，保留表格+弹窗） -->
        <div class="section-card">
            <div class="card-header">
                <h3>快速链接</h3>
                <el-button type="primary" size="small" @click="openLinkDialog()">新增链接</el-button>
            </div>
            <div class="card-body">
                <el-table :data="linkList" border stripe v-loading="linkLoading" style="width: 100%">
                    <el-table-column prop="name" label="链接名称" width="150" />
                    <el-table-column prop="url" label="链接地址" show-overflow-tooltip />
                    <el-table-column prop="sort" label="排序" width="80" align="center" />
                    <el-table-column prop="enabled" label="状态" width="80" align="center">
                        <template #default="{ row }">
                            <el-tag :type="row.enabled ? 'success' : 'danger'" size="small">
                                {{ row.enabled ? '启用' : '禁用' }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180" align="center">
                        <template #default="{ row }">
                            <el-button type="primary" size="small" link @click="openLinkDialog(row)">编辑</el-button>
                            <el-button type="danger" size="small" link @click="handleDeleteLink(row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <!-- 链接编辑弹窗 -->
        <el-dialog v-model="linkDialogVisible" :title="isEditLink ? '编辑链接' : '新增链接'" width="500px">
            <el-form :model="linkForm" :rules="linkRules" ref="linkFormRef" label-width="100px">
                <el-form-item label="链接名称" prop="name">
                    <el-input v-model="linkForm.name" placeholder="请输入链接名称" />
                </el-form-item>
                <el-form-item label="链接地址" prop="url">
                    <el-input v-model="linkForm.url" placeholder="请输入链接地址" />
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="linkForm.sort" :min="0" controls-position="right" />
                </el-form-item>
                <el-form-item label="是否启用">
                    <el-switch v-model="linkForm.enabled" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="linkDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitLink">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import footerApi from '@/api/footer'

// ========== 内容板块（固定3种类型，行内编辑） ==========
// 每个类型对应一个表单对象，初始值为空，加载时填充
const sectionForms = reactive({
    intro:    { id: null, type: 'intro',    title: '次元收藏夹', content: '', sort: 0, enabled: true },
    contact:  { id: null, type: 'contact',  title: '联系方式',  content: '', sort: 1, enabled: true },
    record:   { id: null, type: 'record',   title: '备案信息',  content: '', sort: 2, enabled: true }
})

// 类型到中文名的映射
const typeLabels = { intro: '简介', contact: '联系方式', record: '备案' }

// 加载板块数据
const loadSections = async () => {
    try {
        const res = await footerApi.getSectionList()
        if (res.successful) {
            const list = res.resultValue || []
            // 将后端数据填入对应类型的表单
            for (const type of Object.keys(sectionForms)) {
                const found = list.find(s => s.type === type)
                if (found) {
                    Object.assign(sectionForms[type], found)
                }
            }
        }
    } catch (e) {
        ElMessage.error('加载板块数据失败')
    }
}

// 保存单个板块
const saveSection = async (type) => {
    const form = sectionForms[type]
    if (!form.title) {
        ElMessage.warning('标题不能为空')
        return
    }
    try {
        let res
        if (form.id) {
            // 已有记录 → 更新
            res = await footerApi.updateSection(form)
        } else {
            // 新记录 → 新增
            res = await footerApi.addSection(form)
        }
        if (res.successful) {
            ElMessage.success(`${typeLabels[type]}保存成功`)
            // 刷新获取最新id
            await loadSections()
        } else {
            ElMessage.error(res.resultValue || '保存失败')
        }
    } catch (e) {
        ElMessage.error('保存异常')
    }
}

// ========== 快速链接 ==========
const linkList = ref([])
const linkLoading = ref(false)

const linkDialogVisible = ref(false)
const isEditLink = ref(false)
const linkFormRef = ref(null)
const linkForm = reactive({
    id: null,
    name: '',
    url: '',
    sort: 0,
    enabled: true
})
const linkRules = {
    name: [{ required: true, message: '请输入链接名称', trigger: 'blur' }]
}

const loadLinks = async () => {
    linkLoading.value = true
    try {
        const res = await footerApi.getLinkList()
        if (res.successful) {
            linkList.value = res.resultValue || []
        } else {
            ElMessage.error(res.resultValue || '加载链接失败')
        }
    } catch (e) {
        ElMessage.error('加载链接异常')
    } finally {
        linkLoading.value = false
    }
}

const openLinkDialog = (row = null) => {
    isEditLink.value = !!row
    if (row) {
        Object.assign(linkForm, row)
    } else {
        Object.assign(linkForm, { id: null, name: '', url: '', sort: 0, enabled: true })
    }
    linkDialogVisible.value = true
}

const submitLink = async () => {
    try {
        await linkFormRef.value.validate()
        const res = isEditLink.value
            ? await footerApi.updateLink(linkForm)
            : await footerApi.addLink(linkForm)
        if (res.successful) {
            ElMessage.success(isEditLink.value ? '修改成功' : '新增成功')
            linkDialogVisible.value = false
            loadLinks()
        } else {
            ElMessage.error(res.resultValue || '操作失败')
        }
    } catch (e) {
        // 表单验证失败
    }
}

const handleDeleteLink = (row) => {
    ElMessageBox.confirm(`确定删除链接"${row.name}"吗？`, '删除确认', {
        type: 'warning'
    }).then(async () => {
        const res = await footerApi.deleteLink(row.id)
        if (res.successful) {
            ElMessage.success('删除成功')
            loadLinks()
        } else {
            ElMessage.error(res.resultValue || '删除失败')
        }
    }).catch(() => {})
}

// ========== 初始化 ==========
onMounted(() => {
    loadSections()
    loadLinks()
})
</script>

<style scoped>
.footer-control {
    padding: 0;
}

.page-title {
    margin: 0 0 16px 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--theme-text-primary);
}

.section-card {
    background: var(--theme-bg-card);
    border: 1px solid var(--theme-border);
    border-radius: 8px;
    margin-bottom: 16px;
    overflow: hidden;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--theme-border);
}

.card-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--theme-text-primary);
}

.card-body {
    padding: 16px;
}

/* 行内编辑表单 */
.inline-form {
    border: 1px solid var(--theme-border);
    border-radius: 6px;
    padding: 12px 16px;
    margin-bottom: 12px;
    background: var(--theme-bg-page);
}

.inline-form:last-child {
    margin-bottom: 0;
}

.inline-form-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px dashed var(--theme-border);
}

.inline-form-header .el-tag {
    flex-shrink: 0;
}

.inline-form-header .el-switch {
    margin-left: auto;
}
</style>
