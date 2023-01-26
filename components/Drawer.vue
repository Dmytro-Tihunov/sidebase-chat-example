<script setup lang="ts">
import { useMessage } from 'naive-ui'

interface user{
  name: string,
  bio: string
}

const message = useMessage()

const user: user = reactive({
  name: '',
  bio: ''
})
const channel = ref('')

function isEmptyOrSpaces (str: string) :boolean {
  return str === null || str.match(/^ *$/) !== null
}

async function createUser (): Promise<boolean | undefined | void> {
  if (isEmptyOrSpaces(user.name) || user.name.length < 5) {
    message.error('At least 5 symbols')
    return false
  }
  const { data } = await useFetch('/api/user/user', {
    method: 'POST',
    body: {
      name: user.name,
      bio: user.bio
    },
    onResponse ({ response }) {
      if (response.status === 200) {
        message.success('User has been created')
      }
      emit('drawerCallback', false)
    }
  })
}

async function addChannel (): Promise<boolean | undefined | void> {
  if (isEmptyOrSpaces(channel.value) || channel.value.length < 5) {
    message.error('At least 5 symbols')
    return false
  }
  const { data } = await useFetch('/api/channel/channel', {
    headers: useRequestHeaders(['cookie']),
    method: 'POST',
    body: {
      name: channel.value
    },
    onResponse ({ response }) {
      if (response.status === 200) {
        message.success('Channel has been created')
      }
      emit('drawerCallback', false)
    },
    onResponseError ({ response }) {
      message.error(response._data.statusMessage)
    }
  })
}

const emit = defineEmits<{
  (e: 'drawerCallback', code: boolean): void
}>()

defineProps<{
    type: string
    active?: boolean
}>()
</script>

<template>
  <n-drawer-content v-if="type === 'user'" title="Create user">
    <n-space vertical>
      <n-input v-model:value="user.name" type="text" placeholder="User name" />
      <n-input
        v-model:value="user.bio"
        type="textarea"
        placeholder="User bio (optional)"
      />
      <n-button strong secondary @click="createUser">
        Create
      </n-button>
    </n-space>
  </n-drawer-content>
  <n-drawer-content v-if="type === 'channel'" title="Create channel">
    <n-space vertical>
      <n-input v-model:value="channel" type="text" placeholder="Channel name" />
      <n-button strong secondary @click="addChannel">
        Create
      </n-button>
    </n-space>
  </n-drawer-content>
  <n-drawer-content v-if="type === 'info'" title="Channel info">
    <n-space vertical>
      <n-input v-model:value="channel" type="text" placeholder="Channel name" />
      <n-button strong secondary @click="addChannel">
        Create
      </n-button>
    </n-space>
  </n-drawer-content>
</template>
