<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import axios from 'axios'

const upload = ref()

const handleExceed: UploadProps['onExceed'] = (files) => {
    upload.value = files[0];
    console.log(upload.value)
    submitUpload();
}


const headers = {
    'Content-Type': 'multipart/form-data',
    'Authorization': localStorage.getItem('token'),  // 请求头
};

const videoHeaders = {
    'Authorization': localStorage.getItem('token'),  // 请求头
}

const handleSuccess = (response: any, file: any, fileList: any) => {
    console.log('上传成功', response, file, fileList);
    // 在这里可以处理上传成功后的逻辑

}
const submitUpload = () => {
    const formData = new FormData();
    formData.append('video', upload.value);
    console.log("发送请求")
    axios.post('/api/admin/updates/uploadMedia', formData, { headers: headers }).then(res => {
        console.log(res.data)
        if (res.data.code == 200) {
            //请求成功
            imageUrl.value = res.data.data;
        } else {
            alert(res.data.msg)
        }
    })
        .catch(err => {
            alert("失败" + err)
        })


};




interface RuleForm {
    title: string,
    pid: string,
    content: string
}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
    title: '',
    pid: '',
    content: ''
})

const rules = reactive<FormRules<RuleForm>>({
    title: [
        { required: true, message: '请输入标题', trigger: 'blur' }
    ],
    pid: [
        {
            required: true,
            message: '请选择分区'
        },
    ],
    content: [
        {
            required: true,
            message: '请选择简介'
        }
    ]
})

//提交表单
const submitForm = async (formEl: FormInstance | undefined, ruleForm: RuleForm) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
            console.log(ruleForm)
            console.log("发送请求")
            axios.post('/api/admin/updates/video', ruleForm, { headers: headers }).then(res => {
                console.log(res.data)
                if (res.data.code == 200) {
                    //请求成功
                    imageUrl.value = res.data.data;

                } else {
                    alert(res.data.msg)
                }
            })
                .catch(err => {
                    alert("失败" + err)
                })

        } else {
            console.log('error submit!', fields)
        }
    })
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}


const imageUrl = ref('');
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
    console.log("!!!!!" + imageUrl.value);
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


class Partition {
    value: number;
    label: string;
    constructor(id: number, name: string) {
        this.value = id;
        this.label = name;
    }
};

const partitions = ref<Partition[]>([]);

onMounted(() => {

    //初始化获取所有分区
    axios.get('/api/admin/updates/partition', { headers: headers }).then(res => {
        // console.log(res.data)
        if (res.data.code == 200) {
            //请求成功
            for (let i = 0; i < res.data.data.length; i++) {
                partitions.value.push(new Partition(res.data.data[i].id, res.data.data[i].name));
            }
        } else {
            alert(res.data.msg)
        }
    })
        .catch(err => {
            alert("失败" + err)
        })

});

const options = partitions;

</script>

<template>
    <el-card class="topBox">
        <el-upload ref="upload" class="upload-demo" action="/api/admin/updates/uploadMedia" :headers="videoHeaders"
            :show-file-list="false" name="video" method="post" :limit="1" :on-success="handleSuccess"
            :on-exceed="handleExceed" :auto-upload="true">
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
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
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
            <el-form-item label="分区" prop="pid">
                <el-select v-model="ruleForm.pid" placeholder="请选择分区">
                    <el-option v-for=" item  in  options " :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="简介" prop="content">
                <el-input v-model="ruleForm.content" :rows="3" type="textarea" placeholder="填写更全面的相关信息，让更多人找到你的视频吧！"
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