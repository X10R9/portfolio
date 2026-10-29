<script setup>
import { ElForm, ElFormItem, ElInput } from 'element-plus'
import { Delete, Plus } from '@element-plus/icons-vue'

defineProps({
  items: { type: Array, required: true }
})
</script>

<template>
  <el-form class="admin-form" label-position="top" @submit.prevent>
    <section class="panel">
      <div class="panel__head">
        <h3>其他实验</h3>
        <span class="mono">MORE / LIST</span>
      </div>
      <p class="hint">
        这里的内容出现在精选项目下方，用一行文字说明练习内容和结果，不需要封面图。
      </p>

      <div class="row-list">
        <div
          v-for="(item, i) in items"
          :key="i"
          class="row-item row-item--more"
        >
          <el-form-item label="名称">
            <el-input v-model="item.title" maxlength="30" />
          </el-form-item>
          <el-form-item label="技术 / 类型">
            <el-input v-model="item.meta" maxlength="30" />
          </el-form-item>
          <el-form-item label="年份">
            <el-input v-model="item.year" maxlength="12" />
          </el-form-item>
          <el-form-item label="补充">
            <el-input v-model="item.detail" maxlength="50" />
          </el-form-item>
          <button
            class="row-item__remove"
            type="button"
            aria-label="删除这一条"
            @click="items.splice(i, 1)"
          >
            <el-icon><Delete /></el-icon>
          </button>
        </div>
      </div>

      <button
        class="add-line"
        type="button"
        @click="items.push({ title: '', meta: '', year: String(new Date().getFullYear()), detail: '' })"
      >
        <el-icon><Plus /></el-icon>
        增加一条
      </button>
    </section>
  </el-form>
</template>
