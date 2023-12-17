<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import type { FormInstance, FormRules, UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import axios from 'axios'
import variables from "@/assets/variables.module.scss";
import useUserStore from "@/stores/useUserStore";
import usePartitionStore from "@/stores/usePartitionStore";
import DiliButton from "@/components/button/DiliButton.vue";
import showToast from "@/components/toast/toast";
import DiliProgress from "@/components/progress/DiliProgress.vue";
import Spinning from "@/components/spinning/Spinning.vue";

const uploadRef = ref<UploadInstance>()

const userStore = useUserStore();
const partitionStore = usePartitionStore();

const headers = computed(() => {
  return {
    'Content-Type': 'multipart/form-data',
    'Authorization': userStore.token,  // 请求头
  }
});

const videoHeaders = computed(() => {
  return {
    'Authorization': userStore.token,  // 请求头
  }
});

const handleExceed: UploadProps['onExceed'] = (files) => {
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadRef.value!.handleStart(file)
  uploadRef.value!.submit()
}

const handleSuccess = (response: any, file: any, fileList: any) => {
  if (response.code == 200) {
    // 后台返回上传并处理成功
    console.log('上传成功', response, file, fileList);
    // 处理上传成功后的逻辑
    uploadPercent.value = 200; // 显示上传成功
    submitted.value = false; // 清除表单的锁定
    imageUrl.value = 'http://' + window.location.host + '/api/admin/updates/previewVideoCover';
    basicForm.title = file.name;
    showToast({
      text: `上传成功！`,
    });
  } else {
    uploadPercent.value = 500;
    showToast({
      text: `上传失败：${response.message}`,
      type: 'danger',
    });
  }
}

const handleVideoProgress: UploadProps['onProgress'] = (evt, uploadFile, uploadFiles) => {
  uploadPercent.value = evt.percent;
  if (evt.percent >= 100 || evt.percent < 0) {
    setTimeout(() => {
      if (uploadPercent.value == 100) {
        // 再判断是因为，这期间后端可能已经返回并导致uploadPercent被修改了
        uploadPercent.value = 101;
      }
    }, 500);
  }
}

interface RuleForm {
  title: string,
  pid: string,
  content: string
}

const formSize = ref('default')
const basicFormRef = ref<FormInstance>()
const basicForm = reactive<RuleForm>({
  title: '',
  pid: '',
  content: ''
})

const rules = reactive<FormRules<RuleForm>>({
  title: [
    {required: true, message: '请输入标题', trigger: 'blur'}
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
const submitForm = async () => {
  if (!basicFormRef.value) return
  submitting.value = true;
  await basicFormRef.value.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      console.log(basicForm)
      console.log("发送请求")
      axios.post('/api/admin/updates/video', basicForm, {headers: headers.value}).then(res => {
        console.log(res.data)
        if (res.data.code == 200) {
          //请求成功
          console.log(res.data.data)
          submitted.value = true;
          showToast({ text: '发布成功！' });
        } else {
          alert(res.data.message)
        }
      })
      .catch(err => {
        alert("失败" + err)
      })
      .finally(() => {
        submitting.value = false;
      })

    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = () => {
  if (!basicFormRef) return;
  basicFormRef.value?.resetFields();
  imageUrl.value = '';
  submitted.value = false;
  videoFileList.value = [];
}


const imageUrl = ref('');
const handleCoverSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  console.log("!!!!!" + imageUrl.value);
}

const beforeCoverUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    showToast({
      text: '只能上传 JPG 或 PNG 格式的封面!',
      type: 'danger',
    });
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    showToast({
      text: '封面大小不能超过10MB!',
      type: 'danger',
    });
    return false
  }
  return true
}

const videoFileList = ref<UploadUserFile[]>();


class Partition {
  value: number;
  label: string;

  constructor(id: number, name: string) {
    this.value = id;
    this.label = name;
  }
};

const partitions = computed(() => {
  return partitionStore.partition.map((v) => {
    return new Partition(v.id!, v.name!)
  });
});

const options = partitions;

// 0~100为进度，101为后台处理中，200为成功，500为失败
const uploadPercent = ref(-1);
const submitting = ref(false);
const submitted = ref(false); // 是否已经最终提交

</script>

<template>
  <el-card class="topBox" shadow="never">
    <div style="display: flex; gap: 1rem;">
      <el-upload ref="uploadRef" class="upload-demo" action="/api/admin/updates/uploadMedia" :headers="videoHeaders"
                 :show-file-list="false" :auto-upload="true" name="video" method="post" :limit="1"
                 :on-success="handleSuccess" :on-exceed="handleExceed" :on-progress="handleVideoProgress"
                 v-model:file-list="videoFileList">
        <template #trigger>
          <DiliButton :button-style="{'height': '2.5rem'}" type="primary" :text="videoFileList?.length ? '+ 重新上传' : '+ 上传视频'"></DiliButton>
        </template>
      </el-upload>
      <div style="flex: 1; display: flex; gap: 1rem; align-items: center;" v-if="uploadPercent > 0 && uploadPercent < 200">
        <DiliProgress style="font-size: .75rem; flex: 1;" :value="uploadPercent" />
        <span v-if="uploadPercent <= 100" style="width: max-content; white-space: nowrap;">{{ uploadPercent.toFixed(0) }} %</span>
        <div v-else-if="uploadPercent == 101" style="display: flex; flex-direction: column; align-items: center;"><Spinning :color="variables.colorPrimary" />处理中</div>
      </div>
      <div v-else-if="uploadPercent == 200" :style="{'color': variables.colorPrimary}" style="margin: auto 0; display: flex; flex: 1;">
        上传成功
        <div style="margin-left: auto; color: black;">{{ videoFileList?.[0].name }}</div>
      </div>
      <div v-else-if="uploadPercent == 500" :style="{'color': variables.colorDanger}" style="margin: auto 0;">
        上传失败，请重试
      </div>
    </div>
  </el-card>

  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <span>基本设置</span>
        <!-- <el-button class="button">一键填写</el-button> -->
      </div>
    </template>
    <el-form ref="basicFormRef" :model="basicForm" :rules="rules" label-width="120px" class="demo-ruleForm"
             :size="formSize" status-icon :disabled="submitted" @submit.prevent>

      <el-form-item label="封面" prop="imageUrl">
        <el-upload class="avatar-uploader" name="image" action="/api/admin/updates/changeVideoCover"
                   :headers="videoHeaders" :show-file-list="false"
                   :on-success="handleCoverSuccess" :before-upload="beforeCoverUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="cover"/>
          <div v-else style="position: relative; width: 320px; height: 180px; display: flex; flex-direction: column;
          justify-content: center; align-items: center">
            <el-icon class="avatar-uploader-icon">
              <Plus/>
            </el-icon>
            <el-text class="uploadImgText">上传封面</el-text>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="basicForm.title" show-word-limit type="text" maxlength="10"/>
      </el-form-item>
      <el-form-item label="分区" prop="pid">
        <el-select v-model="basicForm.pid" placeholder="请选择分区">
          <el-option v-for=" item  in  options " :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="简介" prop="content">
        <el-input v-model="basicForm.content" :rows="3" type="textarea"
                  placeholder="填写更全面的相关信息，让更多人找到你的视频吧！"
                  show-word-limit maxlength="250"/>
      </el-form-item>
      <el-form-item style="margin-top: 30px;">
        <div style="display: flex; gap: 1rem; width: 100%;">
          <DiliButton type="primary" @click="submitForm" :text="submitting ? ' 转码中, 请耐心等待...' : '  立即投稿   '" :disabled="submitted || submitting">
            <Spinning v-if="submitting" />
          </DiliButton>
          <DiliButton style="margin-left: auto;" type="normal" @click="resetForm" text="   重置   " :shadow="false"></DiliButton>
        </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style lang="scss">
@import "@/assets/variables.module";
.topBox {
  width: 70%;
  text-align: left;
  background-color: #ffffff;
  margin: 1rem auto 0 auto;
  border-radius: .5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.box-card {
  width: 70%;
  margin: .5rem auto 0 auto;
  border-radius: .5rem;
}

.avatar-uploader {
  background-color: #f2f2f2dc;
}

.avatar-uploader .cover {
  width: 320px;
  height: 180px;
  display: block;
  object-fit: cover;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: .5rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: $color-primary;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 320px;
  height: 160px;
  text-align: center;
}

.uploadImgText {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,25%);
  font-size: 1rem;
}
</style>