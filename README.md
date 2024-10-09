# Virtual Scroll Component Documentation

[![Build](https://github.com/993576769/virtual-list/actions/workflows/build.yml/badge.svg)](https://github.com/993576769/virtual-list/actions/workflows/build.yml)
[![Publish](https://github.com/993576769/virtual-list/actions/workflows/publish.yml/badge.svg)](https://github.com/993576769/virtual-list/actions/workflows/publish.yml)

## Demo

[https://993576769.github.io/virtual-list/](https://993576769.github.io/virtual-list/)

## Installation

```bash
npm install @a993576769/virtual-list
```

## Virtual Scroll List Component

### Props

| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| `items` | `Array<T>` | Required | Array of items to be rendered |
| `estimatedItemHeight` | `Number` | 48 | Estimated height of each item |
| `buffer` | `Number` | 0 | Number of items to render outside the visible area |
| `keyField` | `keyof T` | 'id' | Unique key field for each item |
| `topThreshold` | `Number` | 50 | Threshold for triggering the `topArrived` event |
| `bottomThreshold` | `Number` | 50 | Threshold for triggering the `bottomArrived` event |
| `initialPosition` | `'top' \| 'bottom' \| T[keyof T]` | 'bottom' | Initial scroll position |

### Events

| Event Name | Parameters | Description |
|------------|------------|-------------|
| `topArrived` | None | Triggered when scrolling reaches the top threshold |
| `bottomArrived` | None | Triggered when scrolling reaches the bottom threshold |
| `scroll` | None | Triggered on scroll |

### Exposed Methods and Refs

| Name | Type | Description |
|------|------|-------------|
| `visibleItems` | `Ref<RenderedItem<T>[]>` | Array of currently visible items |
| `renderItems` | `Ref<RenderedItem<T>[]>` | Array of all rendered items, including buffer |
| `scrollToItem` | ``({ key: T[keyof T]; alignment: `start` \| `center` \| `end`; smooth?: boolean }) => Promise<void>`` | Scrolls to a specific item |
| `scrollToTop` | `(smooth?: boolean) => void` | Scrolls to the top of the list |
| `scrollToBottom` | `(smooth?: boolean) => Promise<void>` | Scrolls to the bottom of the list |
| `getScroll` | `() => { scrollHeight: number; scrollTop: number; clientHeight: number }` | Returns current scroll information |

## Virtual Scroll Item Component

### Props

| Prop Name | Type | Required | Description |
|-----------|------|----------|-------------|
| `item` | `T` | Yes | The data object for the list item |
| `index` | `Number` | Yes | The index of the item in the list |
| `resize` | `Function` | Yes | Callback function to report item height changes |

## Usage

To use the Virtual Scroll components together:

```vue
<script setup lang="ts">
import { VirtualScroll, VirtualScrollItem } from '@a993576769/virtual-list';
import { ref } from 'vue';

const myItems = ref([/* your items array */]);
</script>

<template>
  <VirtualScroll :items="myItems">
    <template #default="{ item, index, resize }">
      <VirtualScrollItem :item="item" :index="index" :resize="resize">
        <!-- Your item content here -->
      </VirtualScrollItem>
    </template>
  </VirtualScroll>
</template>
```

## License

This project is licensed under the [MIT license](https://opensource.org/licenses/MIT).
