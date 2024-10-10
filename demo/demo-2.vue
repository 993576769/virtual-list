<script setup lang="ts">
import type { VirtualScrollInstance } from '../src/index';
import { computed, ref } from 'vue';
import { VirtualList, VirtualListItem } from '../src/index';

const list = ref<{
  id: number;
  name: string;
  height: number;
}[]>([
  {
    id: 1,
    name: 'User 1',
    height: 50,
  },
  {
    id: 2,
    name: 'User 2',
    height: 50,
  },
  {
    id: 3,
    name: 'User 3',
    height: 20,
  },
  {
    id: 4,
    name: 'User 4',
    height: 100,
  },
  {
    id: 5,
    name: 'User 5',
    height: 200,
  },
]);

function addItem() {
  list.value.push({
    id: list.value.length + 1,
    name: `User ${list.value.length + 1}`,
    height: Math.floor(Math.random() * 100) + 50,
  });
}

const buffer = ref(0);
const listRef = ref<VirtualScrollInstance<typeof list.value>>();
const visibleItems = computed(() => {
  return (listRef.value?.visibleItems as any)?.map(item => item.data.id);
});
</script>

<template>
  <div class="demo-1">
    <button @click="addItem">
      Add Item
    </button>
    <div>
      <label>Buffer: </label>
      <input v-model="buffer" type="number" />
    </div>
    <div>
      <label>Visible items: </label>
      {{ visibleItems }}
    </div>

    <VirtualList
      ref="listRef"
      :items="list"
      :item-height="50"
      key-field="id"
      :buffer="buffer"
    >
      <template #default="{ item, index, resize }">
        <VirtualListItem :item="item" :index="index" :resize="resize">
          <div class="item" :style="{ height: `${item.height}px` }">
            {{ item.name }}
          </div>
        </VirtualListItem>
      </template>
    </VirtualList>
  </div>
</template>

<style scoped>
.demo-1 {
  display: flex;
  flex-direction: column;
  max-height: 500px;
}

.item {
  box-shadow: inset 0 0 0 1px red;
}
</style>
