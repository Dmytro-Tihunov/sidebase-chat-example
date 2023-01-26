<script setup lang="ts">
import type { Ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useCookies } from '@vueuse/integrations/useCookies'

const message = useMessage()
const cookies = useCookies()

const isEditing: Ref<boolean> = ref(false)

function deleteMessage (id: number): Promise<void> {
  const { data } = useFetch(`/api/message/${id}`, {
    method: 'DELETE',
    onResponse ({ response }) {
      if (response.status === 200) {
        emit('deleteMessage', true)
        message.success('Message deleted')
      }
    }
  })
}

function editMessage (id: number): void {
  isEditing.value = !isEditing.value
  console.log(id)
}

const emit = defineEmits<{
  (e: 'deleteMessage', code: boolean): void
}>()

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
        <div v-if="!isEditing">
          {{ el.message }}
        </div>
        <div v-else>
          <input type="text" :value="el.message">
        </div>
      </div>
      <div v-if="cookies.get('user') === el.author.id" class="buttons">
        <button @click="deleteMessage(el.id)">
          Delete
        </button>
        <button @click="editMessage(el.id)">
          Edit
        </button>
      </div>
      <!-- {{ messages[index - 1]?.author.id === el.author.id }} -->
    </div>
    <div v-if="messages?.length <= 0" class="text-center">
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
