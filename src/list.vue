<script lang="ts" setup generic="T">
import type { PropType, Ref } from 'vue';
import { useThrottleFn } from '@vueuse/core';
import { clone, sortedIndexBy } from 'lodash-es';
import { computed, nextTick, onMounted, onUnmounted, provide, ref, watch } from 'vue';

export interface VirtualScrollEmits {
  (e: 'topArrived'): void;
  (e: 'bottomArrived'): void;
  (e: 'scroll'): void;
};

export interface RenderedItem<T> {
  index: number;
  data: T;
  offset: number;
  height: number;
}

export interface VirtualScrollInstance<T> {
  visibleItems: Ref<RenderedItem<T>[]>;
  renderItems: Ref<RenderedItem<T>[]>;
  scrollToItem: (options: { key: T[keyof T]; alignment: 'start' | 'center' | 'end'; smooth?: boolean }) => Promise<void>;
  scrollToTop: (smooth?: boolean) => void;
  scrollToBottom: (smooth?: boolean) => Promise<void>;
  getScroll: () => { scrollHeight: number; scrollTop: number; clientHeight: number };
}

const props = defineProps({
  /** 要渲染的数据 */
  items: {
    type: Array as PropType<T[]>,
    required: true,
  },
  /** item高度, 如果fixedHeight为true，则忽略此值 */
  itemHeight: {
    type: Number,
    default: 48,
  },
  /** 缓冲区大小, 单位是item数量 */
  buffer: {
    type: Number,
    default: 0,
  },
  /** 唯一键 */
  keyField: {
    type: String as unknown as PropType<keyof T>,
    default: 'id',
  },
  /** 顶部阈值, 当滚动到顶部时，会触发topArrived事件 */
  topThreshold: {
    type: Number,
    default: 50,
  },
  /** 底部阈值, 当滚动到底部时，会触发bottomArrived事件 */
  bottomThreshold: {
    type: Number,
    default: 50,
  },
  /** 初始位置, 可以是keyField的值, 也可以是'top'或'bottom' */
  initialPosition: {
    type: [String, Number] as PropType<'top' | 'bottom' | T[keyof T]>,
    default: 'bottom',
  },
  /** 是否固定高度 */
  fixedHeight: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<VirtualScrollEmits>();

provide('fixedHeight', props.fixedHeight);

const containerRef = ref<HTMLDivElement>();
const containerHeight = ref(0);
const itemHeights = ref<number[]>([]);
const itemPositions = ref<{ top: number; bottom: number }[]>([]);
const renderStartIndex = ref(0);
const renderEndIndex = ref(0);
const isTopArrived = ref(false);
const isBottomArrived = ref(false);

const totalHeight = computed(() => {
  return itemPositions.value[itemPositions.value.length - 1]?.bottom || 0;
});

// 渲染的item，包含buffer
const renderItems = computed<RenderedItem<T>[]>(() => {
  return props.items.slice(renderStartIndex.value, renderEndIndex.value + 1).map((item, index) => ({
    index: renderStartIndex.value + index,
    data: item,
    offset: itemPositions.value[renderStartIndex.value + index]?.top || 0,
    height: itemHeights.value[renderStartIndex.value + index] || props.itemHeight,
  }));
});

// 可视区域内的所有item
const visibleItems = computed<RenderedItem<T>[]>(() => {
  const scrollTop = containerRef.value?.scrollTop ?? 0;
  const clientHeight = containerRef.value?.clientHeight ?? 0;
  return renderItems.value.filter((item) => {
    return (
      (item.offset < scrollTop + clientHeight && item.offset + item.height > scrollTop)
      || (item.offset <= scrollTop && item.offset + item.height >= scrollTop + clientHeight)
    );
  });
});

function updateItemPositions() {
  let top = 0;
  itemPositions.value = props.items.map((_, index) => {
    const height = itemHeights.value[index] || props.itemHeight;
    const position = { top, bottom: top + height };
    top += height;
    return position;
  });
}

const isInitialized = ref(false);
let firstVisibleItem: { key: T[keyof T]; offset: number } | undefined;
function calculateVisibleRange(calculateFirstVisibleItem: boolean = true) {
  if (!containerRef.value) {
    return;
  }
  const { scrollTop, clientHeight } = containerRef.value;
  if (calculateFirstVisibleItem) {
    calcFirstVisibleItem();
  }

  // 起始索引
  const startIndex = sortedIndexBy(itemPositions.value, { top: scrollTop, bottom: scrollTop }, item => item.bottom);
  // 结束索引
  const endIndex = sortedIndexBy(itemPositions.value, { top: scrollTop + clientHeight, bottom: scrollTop + clientHeight }, item => item.top);

  renderStartIndex.value = Math.max(0, startIndex - props.buffer);
  renderEndIndex.value = Math.min(props.items.length - 1, endIndex + props.buffer);
}

// 第一个可见项
function calcFirstVisibleItem() {
  if (!containerRef.value) {
    return;
  }
  const { scrollTop } = containerRef.value!;
  const firstVisibleItemIndex = visibleItems.value.length > 0 ? visibleItems.value[0].index : -1;
  if (firstVisibleItemIndex !== -1) {
    firstVisibleItem = {
      key: props.items[firstVisibleItemIndex][props.keyField as keyof T],
      offset: scrollTop - itemPositions.value[firstVisibleItemIndex].top,
    };
  }
}

function emitArrived() {
  if (!containerRef.value) {
    return;
  }

  const { scrollTop, clientHeight, scrollHeight } = containerRef.value;
  const topThreshold = props.topThreshold ?? 0;
  const bottomThreshold = props.bottomThreshold ?? 0;
  if (scrollTop <= topThreshold && !isTopArrived.value) {
    isTopArrived.value = true;
    emit('topArrived');
  } else if (scrollTop > topThreshold) {
    isTopArrived.value = false;
  }

  if (scrollHeight - scrollTop - clientHeight <= bottomThreshold && !isBottomArrived.value) {
    isBottomArrived.value = true;
    emit('bottomArrived');
  } else if (scrollHeight - scrollTop - clientHeight > bottomThreshold) {
    isBottomArrived.value = false;
  }
}

const onScrollThrottled = useThrottleFn(() => calculateVisibleRange(false), 300, true);
function onScroll() {
  emit('scroll');
  emitArrived();
  // 不能放在throttle中，需要及时计算
  calcFirstVisibleItem();
  onScrollThrottled();
}

function onItemResize(index: number, height: number, update: boolean = true) {
  if (itemHeights.value[index] !== height) {
    itemHeights.value[index] = height;
    if (update) {
      updateItemPositions();
      calculateVisibleRange();

      // 重新调整滚动位置
      if (containerRef.value && firstVisibleItem) {
        const firstVisibleItemIndex = props.items.findIndex(item => item[props.keyField as keyof T] === firstVisibleItem?.key);
        if (firstVisibleItemIndex !== -1) {
          const newScrollPosition = itemPositions.value[firstVisibleItemIndex].top + firstVisibleItem.offset;
          scrollToPosition({ top: newScrollPosition });
        }
      }
    }
  }
}

/** 滚动到底部 */
async function scrollToBottom(smooth: boolean = true) {
  if (containerRef.value) {
    renderEndIndex.value = props.items.length - 1;
    await nextTick();
    calculateVisibleRange();
    await nextTick();
    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        if (containerRef.value) {
          scrollToPosition({ top: containerRef.value.scrollHeight, smooth });
          resolve();
        }
      });
    });
  }
}

/** 滚动到指定item */
async function scrollToItem(options: { key: T[keyof T]; alignment: 'start' | 'center' | 'end'; smooth?: boolean }): Promise<void> {
  const { key, alignment = 'start', smooth = false } = options;
  const index = props.items.findIndex(item => item[props.keyField as keyof T] === key);
  if (index === -1) { return; }

  await waitForItemsToRender();

  let totalHeight = 0;
  for (let i = 0; i < index; i++) {
    totalHeight += itemHeights.value[i] || props.itemHeight;
  }

  const itemHeight = itemHeights.value[index] || props.itemHeight;
  const containerHeight = containerRef.value?.clientHeight || 0;

  let scrollTop;
  switch (alignment) {
    case 'center':
      scrollTop = totalHeight - (containerHeight / 2) + (itemHeight / 2);
      break;
    case 'end':
      scrollTop = totalHeight + itemHeight - containerHeight;
      break;
    case 'start':
    default:
      scrollTop = totalHeight;
  }
  scrollToPosition({ top: Math.max(0, scrollTop), smooth });
  calculateVisibleRange();
}

/** 滚动到顶部 */
function scrollToTop(smooth: boolean = true) {
  if (containerRef.value) {
    scrollToPosition({ top: 0, smooth });
  }
}

function scrollToPosition(options: { top: number; smooth?: boolean }) {
  const { top, smooth } = options;
  if (containerRef.value) {
    if (smooth) {
      containerRef.value.scrollTo({ top, behavior: 'smooth' });
    } else {
      containerRef.value.scrollTop = top;
    }
  }
}

let oldItems: T[] = [];
async function initializeList() {
  const oldItemsLength = oldItems.length;
  const newItemsLength = props.items.length;

  const oldFirstVisibleItem = firstVisibleItem;
  const oldFirstVisibleItemIndex = oldItems.findIndex(item => item[props.keyField as keyof T] === oldFirstVisibleItem?.key);

  oldItems = clone(props.items);

  if (!isInitialized.value) {
    // 首次初始化
    if (props.initialPosition === 'bottom') {
      renderEndIndex.value = newItemsLength - 1;
      renderStartIndex.value = Math.max(0, renderEndIndex.value - Math.ceil(containerHeight.value / props.itemHeight) - props.buffer);
      await nextTick();
      updateItemPositions();
      scrollToPosition({ top: containerRef.value?.scrollHeight || 0 });
    } else if (props.initialPosition === 'top') {
      renderStartIndex.value = 0;
      renderEndIndex.value = Math.min(newItemsLength - 1, Math.ceil(containerHeight.value / props.itemHeight) + props.buffer);
      await nextTick();
      updateItemPositions();
      scrollToPosition({ top: 0 });
    } else {
      renderStartIndex.value = 0;
      renderEndIndex.value = newItemsLength - 1;
      await nextTick();
      await waitForItemsToRender();
      updateContainerHeight();
      // initialPosition 是一个特定项的 key
      await scrollToItem({ key: props.initialPosition as T[keyof T], alignment: 'end' });
    }
  } else {
    // 等待新的 items 渲染完成
    await nextTick();
    await waitForItemsToRender();

    // 更新所有渲染项的高度
    updateContainerHeight();

    // 恢复滚动位置
    if (oldItemsLength > 0 && containerRef.value && oldFirstVisibleItem?.key) {
      const newFirstVisibleItemIndex = props.items.findIndex(item => item[props.keyField as keyof T] === oldFirstVisibleItem.key);
      if (newFirstVisibleItemIndex !== -1) {
        const newScrollPosition = itemPositions.value[newFirstVisibleItemIndex].top + oldFirstVisibleItem.offset;
        if (oldFirstVisibleItemIndex < newFirstVisibleItemIndex) {
          // 下拉加载完成，往下滚动一段距离
          scrollToPosition({ top: newScrollPosition - 100 });
        } else {
          // 新消息
          scrollToPosition({ top: newScrollPosition, smooth: true });
        }
      } else if (newItemsLength > oldItemsLength) {
        // 如果找不到之前的可见项，并且是添加了新数据，尝试保持在底部
        scrollToPosition({ top: containerRef.value.scrollHeight - containerRef.value.clientHeight });
      }
    }
  }

  isInitialized.value = true;
  await waitForItemsToRender();
  calculateVisibleRange();
  emit('scroll');
}

async function updateContainerHeight() {
  if (containerRef.value && !props.fixedHeight) {
    containerHeight.value = containerRef.value.clientHeight;
    await nextTick();
    renderItems.value.forEach((item) => {
      const el = containerRef.value?.querySelector(`[data-index="${item.index}"]`) as HTMLElement;
      if (el) {
        onItemResize(item.index, el.offsetHeight, false);
      }
    });
    updateItemPositions();
    calculateVisibleRange();
  }
}

function waitForItemsToRender(): Promise<void> {
  if (props.fixedHeight) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const checkRendered = () => {
      const allItemsRendered = renderItems.value.every((item) => {
        const el = containerRef.value?.querySelector(`[data-index="${item.index}"]`) as HTMLElement;
        return el && el.offsetHeight > 0;
      });

      if (allItemsRendered) {
        resolve();
      } else {
        requestAnimationFrame(checkRendered);
      }
    };

    requestAnimationFrame(checkRendered);
  });
}

watch(() => props.items.length, initializeList, { immediate: true });

onMounted(() => {
  if (containerRef.value) {
    containerRef.value.addEventListener('scroll', onScroll);
    updateContainerHeight();

    const resizeObserver = new ResizeObserver(updateContainerHeight);
    resizeObserver.observe(containerRef.value);

    onUnmounted(() => {
      containerRef.value?.removeEventListener('scroll', onScroll);
      resizeObserver.disconnect();
    });
  }
});

function getScroll() {
  if (containerRef.value) {
    const { scrollHeight, scrollTop, clientHeight } = containerRef.value;
    return { scrollHeight, scrollTop, clientHeight };
  }
  return { scrollHeight: 0, scrollTop: 0, clientHeight: 0 };
}

defineExpose<VirtualScrollInstance<T>>({
  visibleItems,
  renderItems,
  scrollToItem,
  scrollToTop,
  scrollToBottom,
  getScroll,
});
</script>

<template>
  <div
    ref="containerRef"
    style="width: 100%; height: 100%; overflow: auto;"
    @scroll="onScroll"
  >
    <div style="position: relative;" :style="{ height: `${totalHeight}px` }">
      <div
        v-for="item in renderItems"
        :key="(item.data[props.keyField as keyof T] as any)"
        style="position: absolute; width: 100%;"
        :style="{
          transform: `translateY(${item.offset}px)`,
        }"
      >
        <slot
          :item="item.data"
          :index="item.index"
          :resize="(height?: number) => onItemResize(item.index, height || props.itemHeight)"
          :fixed-height="props.fixedHeight"
        ></slot>
      </div>
    </div>
  </div>
</template>
