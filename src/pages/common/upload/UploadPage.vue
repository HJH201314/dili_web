<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'

const upload = ref<UploadInstance>()

const handleExceed: UploadProps['onExceed'] = (files) => {
    upload.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    upload.value!.handleStart(file)
}

const submitUpload = () => {
    upload.value!.submit()
}



interface RuleForm {
    imageUrl: string
    title: string,
    partition: string,
    description: string
}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
    imageUrl: '',
    title: '',
    partition: '',
    description: ''
})

const rules = reactive<FormRules<RuleForm>>({
    imageUrl: [
        {
            required: false,
            message: '请上传封面'
        }
    ],
    title: [
        { required: true, message: '请输入标题', trigger: 'blur' }
    ],
    partition: [
        {
            required: true,
            message: '请选择分区'
        },
    ],
    description: [
        {
            required: true,
            message: '请选择简介'
        }
    ]
})

const submitForm = async (formEl: FormInstance | undefined, ruleForm: RuleForm) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
            console.log(ruleForm)
        } else {
            console.log('error submit!', fields)
        }
    })
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}


const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
    ruleForm.imageUrl = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('Avatar picture must be JPG format!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('Avatar picture size can not exceed 2MB!')
        return false
    }
    return true
}


const value = ref('')

const options = [
    {
        value: '动画',
        label: '动画',
    },
    {
        value: '番剧',
        label: '番剧',
    },
    {
        value: '国创',
        label: '国创',
    },
    {
        value: '音乐',
        label: '音乐',
    },
    {
        value: '舞蹈',
        label: '舞蹈',
    },
    {
        value: '游戏',
        label: '游戏',
    }
]

</script>

<template>
    <el-card class="topBox">
        <el-upload ref="upload" class="upload-demo" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :limit="1" :on-exceed="handleExceed" :auto-upload="false">

            <el-button class="btn-addVideo" type="primary">+添加视频</el-button>

        </el-upload>
    </el-card>

    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <span>基本设置</span>
                <!-- <el-button class="button">一键填写</el-button> -->
            </div>
        </template>
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm"
            :size="formSize" status-icon>

            <el-form-item label="封面" prop="imageUrl">
                <el-upload class="avatar-uploader" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                    :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar" />
                    <div v-else style="position: relative;width: 150px;height: 150px;">
                        <el-icon class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                        <el-text class="mx-1 uploadImgText">上传封面</el-text>
                    </div>

                </el-upload>
            </el-form-item>
            <el-form-item label="标题" prop="title">
                <el-input v-model="ruleForm.title" show-word-limit type="text" maxlength="10" />
            </el-form-item>
            <el-form-item label="分区" prop="partition">
                <el-select v-model="ruleForm.partition" placeholder="请选择分区">
                    <el-option v-for=" item  in  options " :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="简介" prop="description">
                <el-input v-model="ruleForm.description" :rows="3" type="textarea" placeholder="填写更全面的相关信息，让更多人找到你的视频吧！"
                    show-word-limit maxlength="250" />
            </el-form-item>
            <el-form-item style="margin-top: 30px;">
                <el-button style="background-color: #3ac0b4;" type="primary" @click="submitForm(ruleFormRef, ruleForm)">
                    立即投稿
                </el-button>
                <el-button @click="resetForm(ruleFormRef)">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<style>
.topBox {
    width: 70%;
    text-align: left;
    background-color: #ffffff;
    margin: 0 auto;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.box-card {
    width: 70%;
    height: 530px;
    margin: 0 auto;
    margin-top: 20px;
}

.btn-addVideo {
    width: 150px;
    height: 50px;
    font-size: 24px;
    background-color: #3ac0b4;
}

.avatar-uploader {
    background-color: #f2f2f2dc;
}

.avatar-uploader .avatar {
    width: 150px;
    height: 150px;
    display: block;
}

.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 130px;
    text-align: center;
}

.uploadImgText {
    position: absolute;
    top: 80px;
    left: 30px;
    font-size: 22px;
}
</style>