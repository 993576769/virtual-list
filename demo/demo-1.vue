<script setup lang="ts">
import { ref } from 'vue';
import { VirtualList, VirtualListItem } from '../src/index';

const list = ref([
  {
    id: 1,
    name: 'User 1',
  },
  {
    id: 2,
    name: 'User 2',
  },
  {
    id: 3,
    name: 'User 3',
  },
]);

function addItem() {
  for (let i = 0; i < 10; i++) {
    list.value.push({
      id: list.value.length + 1,
      name: `User ${list.value.length + 1}`,
    });
  }
}

const buffer = ref(0);
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

    <VirtualList
      :items="list"
      key-field="id"
      :buffer="buffer"
      :item-height="30"
      fixed-height
    >
      <template #default="{ item, index, resize }">
        <VirtualListItem :item="item" :index="index" :resize="resize">
          <div class="item">
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
  height: 30px;
}
</style>
