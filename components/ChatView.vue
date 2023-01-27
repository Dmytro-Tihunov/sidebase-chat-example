<script setup lang="ts">
import type { Ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useCookies } from '@vueuse/integrations/useCookies'

const message = useMessage()
const cookies = useCookies()

const isEditedEl: Ref<null | object> = ref(null)
const isBeingEdited: Ref<boolean> = ref(false)

function deleteMessage (id: number): Promise<void> {
  const { data } = useFetch(`/api/message/${id}`, {
    method: 'DELETE',
    headers: useRequestHeaders(['cookie']),
    onResponse ({ response }) {
      if (response.status === 200) {
        emit('deleteMessage', true)
        message.success('Message deleted')
      }
    },
    onResponseError ({ response }) {
      message.error(response._data.statusMessage ?? 'Unknown Error')
    }
  })
}

function editMessage (el: any): void {
  isBeingEdited.value = !isBeingEdited.value
  isEditedEl.value = el
  console.log(el)
}

function cancelEditing (): void {
  isEditedEl.value = null
  isBeingEdited.value = false
}

const emit = defineEmits<{
  (e: 'deleteMessage', code: boolean): void
}>()

watch(isEditedEl, (newValue, oldValue) => {
  console.log(newValue)
})

defineProps<{
    messages: object | null
}>()
</script>

<template>
  <div class="w-full">
    <div v-for="(el, index) in messages" :key="el.id" class="message py-2 px-4 flex items-center hover:bg-blue-50">
      <div class="bg-blue-300 w-8 h-8 mr-2 rounded-full">
        {{ el.author.name.at(1) }}
      </div>
      <div class="flex flex-col">
        <div>
          {{ el.author.name }}
          {{ el.createdAt }}
        </div>
        <div v-if="isEditedEl?.id !== el.id">
          {{ el.message }}
        </div>
        <div v-if="isEditedEl?.id === el.id">
          <n-space>
            <n-input v-model:value="el.message" type="text" placeholder="Basic Input" />
            <n-button strong secondary type="primary">
              Change
            </n-button>
            <n-button strong secondary type="error" @click="cancelEditing">
              Cancel
            </n-button>
          </n-space>
        </div>
      </div>
      <div v-if="cookies.get('user') === el.author.id && !isBeingEdited" class="buttons">
        <button @click="deleteMessage(el.id)">
          Delete
        </button>
        <button @click="editMessage(el)">
          Edit
        </button>
      </div>
      <!-- {{ messages[index - 1]?.author.id === el.author.id }} -->
    </div>
    <div v-if="messages?.length <= 0" class="text-center text-gray-500 pb-5">
      No messages.
    </div>
  </div>
</template>

<style scoped>
.message:hover .buttons{
  @apply flex
}
.buttons {
  @apply hidden
}
</style>
