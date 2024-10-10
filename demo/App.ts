import { defineComponent, h } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

export default defineComponent({
  name: 'VueucDemo',
  setup() {
    return () => {
      return h('main', {
        style: {
          display: 'flex',
        },
      }, [
        h('aside', {
          style: {
            paddingRight: '24px',
            borderRight: '1px solid grey',
          },
        }, [
          h('ul', [
            h('li', [h(RouterLink, {
              to: '/demo-1',
            }, {
              default: () => 'Virtual List(fixed height)',
            })]),
            h('li', [h(RouterLink, {
              to: '/demo-2',
            }, {
              default: () => 'Virtual List(variable height)',
            })]),
          ]),
        ]),
        h('div', {
          style: {
            flex: 1,
            overflow: 'hidden',
            paddingLeft: '24px',
          },
        }, [
          h(RouterView),
        ]),
      ]);
    };
  },
});
