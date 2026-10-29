import { onBeforeUnmount, ref } from 'vue'
import { ElMessage } from 'element-plus'

export function useCopyEmail(email) {
  const copied = ref(false)
  let timer

  async function copy() {
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      const input = document.createElement('textarea')
      input.value = email
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
    copied.value = true
    ElMessage({
      message: `邮箱已复制 — ${email}`,
      duration: 2600,
      customClass: 'copy-message'
    })
    window.clearTimeout(timer)
    timer = window.setTimeout(() => (copied.value = false), 2600)
  }

  onBeforeUnmount(() => window.clearTimeout(timer))

  return { copied, copy }
}
