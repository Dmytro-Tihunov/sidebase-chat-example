<script setup lang="ts">
import type { Ref } from 'vue'
import type { DrawerPlacement } from 'naive-ui'
import { useCookies } from '@vueuse/integrations/useCookies'

const cookies = useCookies(['locale'])

// Group chat app
const { data: channels, pending: isChanellsLoading, refresh: channelsRefresh } = await useLazyFetch('/api/channel')

const { data: users, pending: isUsersLoading } = await useLazyFetch('/api/user/user', {
  method: 'GET'
})

// Global state
const chosenChannel = useState<null | object>('chosenChannel', () => null)
const activeUser = useState<null>('activeUser', () => cookies.get('user'))
const messages = ref(null)

async function getChannel (id: number): Promise<void> {
  const { data: channel } = await useFetch(`/api/channel/${id}`, {
    method: 'GET',
    onResponse ({ response }) {
      chosenChannel.value = response._data
    }
  })
  const { data: messagesList, refresh: messagesRefresh } = await useFetch(`/api/message/${id}`, {
    method: 'GET',
    onResponse ({ response }) {
      messages.value = response._data
    }
  })
}

const input: Ref<string> = ref('')

async function addMessage () {
  const { data } = await useFetch('/api/message/message', {
    method: 'POST',
    body: {
      message: input.value,
      creatorId: cookies.get('user'),
      channelId: chosenChannel.value.id
    },
    onResponse ({ response }) {
      getChannel(chosenChannel.value.id)
    }
  })
  input.value = ''
}

const activeDrawer = ref(false)
const typeDrawer = ref('')

function triggerDrawer (type: string): void {
  typeDrawer.value = type
  activeDrawer.value = !activeDrawer.value
}

const placement = ref<DrawerPlacement>('right')

const chosenUser = ref()

function changeUser () {
  activeUser.value = chosenUser.value
  cookies.set('user', chosenUser.value)
}

function callbackDrawer (e: boolean): void {
  activeDrawer.value = e
  channelsRefresh()
}

onMounted(() => {
  cookies.get('user') ? chosenUser.value = cookies.get('user') : chosenUser.value = 1; cookies.set('user', 1)
})
</script>

<template>
  <div class="flex min-h-screen justify-center items-center">
    <div id="drawer-target" class="w-2/4 min-h-[40rem] max-h-[40rem] overflow-hidden rounded-sm bg-white border shadow-xl flex relative">
      <n-message-provider>
        <n-drawer
          v-model:show="activeDrawer"
          :width="300"
          :height="500"
          :placement="placement"
          :trap-focus="false"
          to="#drawer-target"
        >
          <Drawer :type="typeDrawer" @drawer-callback="callbackDrawer" />
        </n-drawer>

        <div class="border-r w-1/4 bg-gray-100">
          <n-scrollbar>
            <div class="border-b flex items-center justify-between py-2 px-4">
              <div class="w-full">
                <n-select
                  v-model:value="chosenUser"
                  :loading="isUsersLoading"
                  value-field="id"
                  :options="users"
                  default-value="dmytro"
                  label-field="name"
                  @update:value="changeUser"
                />
              </div>
              <n-button quaternary circle type="success" @click="triggerDrawer('user')">
                <template #icon>
                  +
                </template>
              </n-button>
            </div>
            <div class="flex justify-between items-center p-2 px-4 border-b">
              <h5 class="font-semibold">
                Channels
              </h5>

              <n-button quaternary circle type="success" @click="triggerDrawer('channel')">
                <template #icon>
                  +
                </template>
              </n-button>
            </div>

            <div v-if="isChanellsLoading">
              <n-spin size="small" />
            </div>

            <div
              v-for="el in channels"
              v-else
              :key="el.id"
              :class="[chosenChannel?.id === el.id ? 'bg-gray-300' :
                '']"
              class="border-b p-2 flex hover:cursor-pointer hover:bg-gray-200"
              @click="getChannel(el.id)"
            >
              <div class="w-[40px] mr-1 flex h-[40px] uppercase justify-center items-center rounded-full border ">
                <div>{{ el.name.at(0) }}</div>
              </div>
              {{ el.name }}
            </div>
          </n-scrollbar>
        </div>

        <div class="w-3/4 relative">
          <div v-if="chosenChannel" class="border-b items-center px-2 flex py-2">
            <n-tooltip placement="bottom" trigger="hover">
              <template #trigger>
                <button class="w-[40px] mr-1 flex h-[40px] uppercase justify-center items-center rounded-full border " @click="triggerDrawer('info')">
                  <div>{{ chosenChannel.name.at(0) }}</div>
                </button>
              </template>
              <span> Channel info </span>
            </n-tooltip>
            {{ chosenChannel.name }}
          </div>

          <div class="app-window">
            <n-scrollbar>
              <chat-view :messages="messages" @delete-message="getChannel(chosenChannel.id)" />
            </n-scrollbar>
          </div>

          <div v-if="chosenChannel" class="flex border-t px-4 py-2 w-full">
            <div class="w-full">
              <n-input v-model:value="input" type="text" placeholder="Enter message" @keyup.enter="addMessage" />
            </div>
          </div>
        </div>
      </n-message-provider>
    </div>
  </div>
</template>

<style scoped>
.app-window{
  height: calc(100% - 108px);
  align-items: flex-end;
  display: flex;
}
</style>
