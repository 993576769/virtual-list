<script lang="ts" setup generic="T">
import type { PropType } from 'vue';
import { inject, onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps({
  item: {
    type: Object as PropType<T>,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  resize: {
    type: Function as PropType<(height?: number) => void>,
    required: true,
  },
});

const fixedHeight = inject<boolean>('fixedHeight', true);

const itemRef = ref<HTMLElement | null>(null);

function updateHeight() {
  if (itemRef.value) {
    props.resize(itemRef.value.offsetHeight);
  }
}

// Watch for changes in the item's properties
watch(() => props.item, () => {
  if (!fixedHeight) {
    updateHeight();
  }
}, { deep: true });

onMounted(() => {
  if (fixedHeight) {
    props.resize();
    return;
  }
  if (itemRef.value) {
    // Initial height update
    updateHeight();

    // Use ResizeObserver to detect size changes
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(itemRef.value);

    // Use MutationObserver to detect content changes
    // const mutationObserver = new MutationObserver(updateHeight);
    // mutationObserver.observe(itemRef.value, {
    //   childList: true,
    //   subtree: true,
    //   characterData: true,
    //   attributes: true,
    // });

    onUnmounted(() => {
      resizeObserver.disconnect();
      // mutationObserver.disconnect();
    });
  }
});
</script>

<template>
  <div ref="itemRef" style="width: 100%; display: flex; flex-direction: column;" :data-index="index">
    <slot></slot>
  </div>
</template>
