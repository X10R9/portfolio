<script setup>
import { ElForm, ElFormItem, ElInput, ElOption, ElSelect } from 'element-plus'
import { Delete, Plus } from '@element-plus/icons-vue'

defineProps({
  profile: { type: Object, required: true }
})
</script>

<template>
  <el-form class="admin-form" label-position="top" @submit.prevent>
    <section class="panel">
      <div class="panel__head">
        <h3>身份信息</h3>
        <span class="mono">01 / IDENTITY</span>
      </div>

      <div class="field-grid">
        <el-form-item label="姓名">
          <el-input v-model="profile.name" maxlength="20" />
        </el-form-item>
        <el-form-item label="英文名 / 拼音">
          <el-input v-model="profile.latin" maxlength="32" />
        </el-form-item>
        <el-form-item label="字标 / Monogram">
          <el-input v-model="profile.monogram" maxlength="2" />
        </el-form-item>
        <el-form-item label="年级">
          <el-input v-model="profile.grade" maxlength="16" />
        </el-form-item>
        <el-form-item label="学校">
          <el-input v-model="profile.school" maxlength="40" />
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="profile.major" maxlength="40" />
        </el-form-item>
        <el-form-item label="所在地">
          <el-input v-model="profile.location" maxlength="32" />
        </el-form-item>
        <el-form-item label="坐标">
          <el-input v-model="profile.coords" maxlength="32" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="profile.email" maxlength="80" />
        </el-form-item>
        <el-form-item label="当前状态 / 开放状态">
          <el-input v-model="profile.availability" maxlength="32" />
        </el-form-item>
        <el-form-item label="人像图片路径">
          <el-input v-model="profile.portrait" placeholder="/images/portrait.jpg" />
        </el-form-item>
      </div>
      <p class="hint">
        人像留空时显示等高线插图；填入 public 下的路径或图片 URL 后，关于区会自动切换为照片。
      </p>
    </section>

    <section class="panel">
      <div class="panel__head">
        <h3>首页文案</h3>
        <span class="mono">02 / HERO</span>
      </div>

      <el-form-item label="首屏介绍">
        <el-input
          v-model="profile.lede"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          maxlength="180"
          show-word-limit
        />
      </el-form-item>
      <div class="field-grid">
        <el-form-item label="当前在做什么">
          <el-input v-model="profile.current" maxlength="60" />
        </el-form-item>
        <el-form-item label="关注方向">
          <el-select
            v-model="profile.focus"
            multiple
            filterable
            allow-create
            default-first-option
            :reserve-keyword="false"
            placeholder="输入后回车新增"
          >
            <el-option v-for="item in profile.focus" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </div>
    </section>

    <section class="panel">
      <div class="panel__head">
        <h3>关于段落</h3>
        <span class="mono">03 / INTRO</span>
      </div>

      <div class="row-list">
        <div v-for="(paragraph, i) in profile.intro" :key="i" class="row-item row-item--two">
          <el-form-item :label="`段落 ${i + 1}`">
            <el-input
              v-model="profile.intro[i]"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 8 }"
            />
          </el-form-item>
          <button
            class="row-item__remove"
            type="button"
            aria-label="删除段落"
            @click="profile.intro.splice(i, 1)"
          >
            <el-icon><Delete /></el-icon>
          </button>
        </div>
      </div>
      <button class="add-line" type="button" @click="profile.intro.push('')">
        <el-icon><Plus /></el-icon>
        增加段落
      </button>
    </section>

    <section class="panel">
      <div class="panel__head">
        <h3>项目数据</h3>
        <span class="mono">04 / STATS</span>
      </div>

      <div class="row-list">
        <div v-for="(stat, i) in profile.stats" :key="i" class="row-item row-item--stat">
          <el-form-item label="数值">
            <el-input v-model="stat.value" maxlength="8" />
          </el-form-item>
          <el-form-item label="标签">
            <el-input v-model="stat.label" maxlength="16" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="stat.note" maxlength="40" />
          </el-form-item>
          <button
            class="row-item__remove"
            type="button"
            aria-label="删除这一项"
            @click="profile.stats.splice(i, 1)"
          >
            <el-icon><Delete /></el-icon>
          </button>
        </div>
      </div>
      <button class="add-line" type="button" @click="profile.stats.push({ value: '', label: '', note: '' })">
        <el-icon><Plus /></el-icon>
        增加数据
      </button>
    </section>

    <section class="panel">
      <div class="panel__head">
        <h3>实践线索</h3>
        <span class="mono">05 / TRAJECTORY</span>
      </div>

      <div class="row-list">
        <div v-for="(item, i) in profile.timeline" :key="i" class="row-item row-item--trace">
          <el-form-item label="时间">
            <el-input v-model="item.year" maxlength="12" />
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="item.title" maxlength="40" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="item.note" maxlength="48" />
          </el-form-item>
          <button
            class="row-item__remove"
            type="button"
            aria-label="删除这条线索"
            @click="profile.timeline.splice(i, 1)"
          >
            <el-icon><Delete /></el-icon>
          </button>
        </div>
      </div>
      <button
        class="add-line"
        type="button"
        @click="profile.timeline.push({ year: '', title: '', note: '' })"
      >
        <el-icon><Plus /></el-icon>
        增加线索
      </button>
    </section>

    <div v-if="profile.portrait" class="panel">
      <div class="panel__head">
        <h3>人像预览</h3>
        <span class="mono">PORTRAIT</span>
      </div>
      <div class="cover-preview cover-preview--portrait">
        <img :src="profile.portrait" alt="人像预览" />
      </div>
    </div>
  </el-form>
</template>
