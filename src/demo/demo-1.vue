<script setup lang="ts">
import { ref } from 'vue';
import { VirtualList, VirtualListItem } from '../index';

const list = ref([
  {
    id: 1,
    name: '张三',
  },
  {
    id: 2,
    name: '李四',
  },
  {
    id: 3,
    name: '王五',
  },
]);

function addItem() {
  for (let i = 0; i < 10; i++) {
    list.value.push({
      id: list.value.length + 1,
      name: `用户${list.value.length + 1}`,
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
      :item-height="50"
      key-field="id"
      :buffer="buffer"
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
</style>
