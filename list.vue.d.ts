import { PropType, Ref } from 'vue';
export interface VirtualScrollEmits {
    (e: 'topArrived'): void;
    (e: 'bottomArrived'): void;
    (e: 'scroll'): void;
}
export interface RenderedItem<T> {
    index: number;
    data: T;
    offset: number;
    height: number;
}
export interface VirtualScrollInstance<T> {
    visibleItems: Ref<RenderedItem<T>[]>;
    renderItems: Ref<RenderedItem<T>[]>;
    scrollToItem: (options: {
        key: T[keyof T];
        alignment: 'start' | 'center' | 'end';
        smooth?: boolean;
    }) => Promise<void>;
    scrollToTop: (smooth?: boolean) => void;
    scrollToBottom: (smooth?: boolean) => Promise<void>;
    getScroll: () => {
        scrollHeight: number;
        scrollTop: number;
        clientHeight: number;
    };
}
declare const _default: <T>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{
        fixedHeight: boolean;
        itemHeight: number;
        buffer: number;
        keyField: [{
            type: PropType<keyof T>;
            default: string;
        }] extends [import('vue').Prop<infer V, infer D>] ? unknown extends V ? keyof V extends never ? import('@vue/shared').IfAny<V, V, D> : V : V : {
            type: PropType<keyof T>;
            default: string;
        };
        topThreshold: number;
        bottomThreshold: number;
        initialPosition: [{
            type: PropType<"top" | "bottom" | T[keyof T]>;
            default: string;
        }] extends [import('vue').Prop<infer V, infer D>] ? unknown extends V ? keyof V extends never ? import('@vue/shared').IfAny<V, V, D> : V : V : {
            type: PropType<"top" | "bottom" | T[keyof T]>;
            default: string;
        };
    }> & Omit<{
        readonly fixedHeight: boolean;
        readonly items: T[];
        readonly itemHeight: number;
        readonly buffer: number;
        readonly keyField: [{
            type: PropType<keyof T>;
            default: string;
        }] extends [import('vue').Prop<infer V, infer D>] ? unknown extends V ? keyof V extends never ? import('@vue/shared').IfAny<V, V, D> : V : V : {
            type: PropType<keyof T>;
            default: string;
        };
        readonly topThreshold: number;
        readonly bottomThreshold: number;
        readonly initialPosition: [{
            type: PropType<"top" | "bottom" | T[keyof T]>;
            default: string;
        }] extends [import('vue').Prop<infer V, infer D>] ? unknown extends V ? keyof V extends never ? import('@vue/shared').IfAny<V, V, D> : V : V : {
            type: PropType<"top" | "bottom" | T[keyof T]>;
            default: string;
        };
        readonly onScroll?: (() => any) | undefined;
        readonly onTopArrived?: (() => any) | undefined;
        readonly onBottomArrived?: (() => any) | undefined;
    } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps, "fixedHeight" | "itemHeight" | "buffer" | "keyField" | "topThreshold" | "bottomThreshold" | "initialPosition">, "onScroll" | "items" | "onTopArrived" | "onBottomArrived" | ("fixedHeight" | "itemHeight" | "buffer" | "keyField" | "topThreshold" | "bottomThreshold" | "initialPosition")> & {}> & import('vue').PublicProps;
    expose(exposed: import('vue').ShallowUnwrapRef<VirtualScrollInstance<T>>): void;
    attrs: any;
    slots: {
        default?(_: {
            item: T;
            index: number;
            resize: (height?: number) => void;
            fixedHeight: boolean;
        }): any;
    };
    emit: VirtualScrollEmits;
}>) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
    [key: string]: any;
}> & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T]: T[K];
} & {};
