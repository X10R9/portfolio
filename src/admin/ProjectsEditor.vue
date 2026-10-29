<script setup>
import { computed, ref } from 'vue'
import { ElForm, ElFormItem, ElInput, ElMessageBox, ElOption, ElSelect } from 'element-plus'
import { ArrowDown, ArrowUp, Delete, Plus } from '@element-plus/icons-vue'

const props = defineProps({
  projects: { type: Array, required: true }
})

const selected = ref(0)
const current = computed(() => props.projects[selected.value] || null)

function reindex() {
  props.projects.forEach((project, i) => {
    project.index = String(i + 1).padStart(2, '0')
  })
}

function addProject() {
  const project = {
    id: `project-${Date.now()}`,
    index: '',
    title: '新项目',
    subtitle: '',
    type: '个人项目',
    year: String(new Date().getFullYear()),
    role: '独立完成',
    stack: [],
    summary: '',
    cover: '',
    coverAlt: '',
    coverPosition: '50% 50%',
    aspect: '16 / 10',
    gallery: [],
    facts: [
      { value: '', label: '' },
      { value: '', label: '' },
      { value: '', label: '' },
      { value: '', label: '' }
    ],
    sections: [
      { title: '背景', body: '' },
      { title: '做法', body: '' },
      { title: '结果', body: '' }
    ],
    highlights: ['', '', '']
  }
  props.projects.push(project)
  selected.value = props.projects.length - 1
  reindex()
}

async function removeProject() {
  if (!current.value) return
  try {
    await ElMessageBox.confirm(`确定删除「${current.value.title}」？`, '删除项目', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    return
  }
  props.projects.splice(selected.value, 1)
  if (selected.value >= props.projects.length) selected.value = props.projects.length - 1
  reindex()
}

function move(direction) {
  const from = selected.value
  const to = from + direction
  if (to < 0 || to >= props.projects.length) return
  const [item] = props.projects.splice(from, 1)
  props.projects.splice(to, 0, item)
  selected.value = to
  reindex()
}

function addFact() {
  current.value?.facts.push({ value: '', label: '' })
}

function addSection() {
  current.value?.sections.push({ title: '', body: '' })
}

function addHighlight() {
  current.value?.highlights.push('')
}

function addGallery() {
  current.value?.gallery.push({ src: '', alt: '' })
}
</script>

<template>
  <div class="projects-editor">
    <div class="project-tabs">
      <button
        v-for="(project, i) in projects"
        :key="project.id"
        type="button"
        :class="{ 'is-active': selected === i }"
        @click="selected = i"
      >
        {{ project.index || String(i + 1).padStart(2, '0') }} {{ project.title || '未命名' }}
      </button>
      <button class="add" type="button" @click="addProject">
        <el-icon><Plus /></el-icon>
        新增项目
      </button>
    </div>

    <template v-if="current">
      <div class="project-toolbar">
        <div class="project-toolbar__left">
          <button class="tool-btn" type="button" :disabled="selected === 0" @click="move(-1)">
            <el-icon><ArrowUp /></el-icon>上移
          </button>
          <button
            class="tool-btn"
            type="button"
            :disabled="selected === projects.length - 1"
            @click="move(1)"
          >
            <el-icon><ArrowDown /></el-icon>下移
          </button>
        </div>
        <div class="project-toolbar__right">
          <button class="tool-btn is-danger" type="button" @click="removeProject">
            <el-icon><Delete /></el-icon>删除项目
          </button>
        </div>
      </div>

      <el-form class="admin-form" label-position="top" @submit.prevent>
        <section class="panel">
          <div class="panel__head">
            <h3>项目信息</h3>
            <span class="mono">01 / BASICS</span>
          </div>

          <div class="field-grid">
            <el-form-item label="项目名称">
              <el-input v-model="current.title" maxlength="40" />
            </el-form-item>
            <el-form-item label="副标题">
              <el-input v-model="current.subtitle" maxlength="50" />
            </el-form-item>
            <el-form-item label="类型">
              <el-input v-model="current.type" maxlength="30" />
            </el-form-item>
            <el-form-item label="年份">
              <el-input v-model="current.year" maxlength="12" />
            </el-form-item>
            <el-form-item label="我的角色">
              <el-input v-model="current.role" maxlength="40" />
            </el-form-item>
            <el-form-item label="技术标签">
              <el-select
                v-model="current.stack"
                multiple
                filterable
                allow-create
                default-first-option
                :reserve-keyword="false"
                placeholder="输入后回车新增"
              >
                <el-option v-for="item in current.stack" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </div>

          <el-form-item label="一句话介绍">
            <el-input
              v-model="current.summary"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              maxlength="140"
              show-word-limit
            />
          </el-form-item>
        </section>

        <section class="panel">
          <div class="panel__head">
            <h3>封面图片</h3>
            <span class="mono">02 / COVER</span>
          </div>

          <div class="project-cover-row">
            <div class="project-cover-row__fields">
              <el-form-item label="图片路径">
                <el-input v-model="current.cover" placeholder="/images/projects/xxx.webp" />
              </el-form-item>
              <div class="field-grid">
                <el-form-item label="图片描述（alt）">
                  <el-input v-model="current.coverAlt" maxlength="80" />
                </el-form-item>
                <el-form-item label="裁切位置">
                  <el-input v-model="current.coverPosition" placeholder="50% 50%" />
                </el-form-item>
                <el-form-item label="卡片比例">
                  <el-input v-model="current.aspect" placeholder="16 / 10" />
                </el-form-item>
              </div>
            </div>

            <div v-if="current.cover" class="cover-preview">
              <img :src="current.cover" :alt="current.coverAlt || '封面预览'" />
            </div>
          </div>
          <p class="hint">
            图片放在 <code>public/images/projects/</code>，这里填写 <code>/images/projects/文件名.webp</code>。
            比例可写 <code>16 / 10</code>、<code>4 / 3</code> 或 <code>2.55 / 1</code>。
          </p>
        </section>

        <section class="panel">
          <div class="panel__head">
            <h3>项目数据</h3>
            <span class="mono">03 / FACTS</span>
          </div>

          <div class="row-list">
            <div v-for="(fact, i) in current.facts" :key="i" class="row-item row-item--two" style="grid-template-columns: 110px minmax(0, 1fr) 34px">
              <el-form-item label="数值">
                <el-input v-model="fact.value" maxlength="12" />
              </el-form-item>
              <el-form-item label="说明">
                <el-input v-model="fact.label" maxlength="24" />
              </el-form-item>
              <button
                class="row-item__remove"
                type="button"
                aria-label="删除这项数据"
                @click="current.facts.splice(i, 1)"
              >
                <el-icon><Delete /></el-icon>
              </button>
            </div>
          </div>
          <button class="add-line" type="button" @click="addFact">
            <el-icon><Plus /></el-icon>增加数据
          </button>
        </section>

        <section class="panel">
          <div class="panel__head">
            <h3>详情正文</h3>
            <span class="mono">04 / CASE</span>
          </div>

          <div v-for="(section, i) in current.sections" :key="i" class="section-editor">
            <div class="section-editor__head">
              <el-form-item label="小标题">
                <el-input v-model="section.title" maxlength="16" />
              </el-form-item>
              <button
                class="row-item__remove"
                type="button"
                aria-label="删除这一节"
                @click="current.sections.splice(i, 1)"
              >
                <el-icon><Delete /></el-icon>
              </button>
            </div>
            <el-form-item label="正文">
              <el-input
                v-model="section.body"
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </el-form-item>
          </div>
          <button class="add-line" type="button" @click="addSection">
            <el-icon><Plus /></el-icon>增加一节
          </button>
        </section>

        <section class="panel">
          <div class="panel__head">
            <h3>关键要点</h3>
            <span class="mono">05 / NOTES</span>
          </div>

          <div class="row-list">
            <div v-for="(highlight, i) in current.highlights" :key="i" class="row-item row-item--two">
              <el-form-item :label="`要点 ${i + 1}`">
                <el-input v-model="current.highlights[i]" maxlength="100" />
              </el-form-item>
              <button
                class="row-item__remove"
                type="button"
                aria-label="删除这条要点"
                @click="current.highlights.splice(i, 1)"
              >
                <el-icon><Delete /></el-icon>
              </button>
            </div>
          </div>
          <button class="add-line" type="button" @click="addHighlight">
            <el-icon><Plus /></el-icon>增加要点
          </button>
        </section>

        <section class="panel">
          <div class="panel__head">
            <h3>补充图片</h3>
            <span class="mono">06 / GALLERY</span>
          </div>

          <div class="row-list">
            <div
              v-for="(image, i) in current.gallery"
              :key="i"
              class="row-item row-item--two"
              style="grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) 34px"
            >
              <el-form-item label="图片路径">
                <el-input v-model="image.src" placeholder="/images/projects/xxx.webp" />
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="image.alt" maxlength="80" />
              </el-form-item>
              <button
                class="row-item__remove"
                type="button"
                aria-label="删除这张图片"
                @click="current.gallery.splice(i, 1)"
              >
                <el-icon><Delete /></el-icon>
              </button>
            </div>
          </div>
          <button class="add-line" type="button" @click="addGallery">
            <el-icon><Plus /></el-icon>增加图片
          </button>
        </section>
      </el-form>
    </template>

    <div v-else class="empty-state">
      还没有项目。
      <button type="button" @click="addProject">创建第一个项目</button>
    </div>
  </div>
</template>
