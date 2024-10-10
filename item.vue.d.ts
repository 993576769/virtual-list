import { PropType } from 'vue';
declare const _default: <T>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly resize: (height?: number) => void;
        readonly item: [{
            type: PropType<T>;
            required: true;
        }] extends [import('vue').Prop<infer V, infer D>] ? unknown extends V ? keyof V extends never ? import('@vue/shared').IfAny<V, V, D> : V : V : {
            type: PropType<T>;
            required: true;
        };
        readonly index: number;
    } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps, never>, "resize" | "item" | "index"> & {}> & import('vue').PublicProps;
    expose(exposed: import('vue').ShallowUnwrapRef<{}>): void;
    attrs: any;
    slots: {
        default?(_: {}): any;
    };
    emit: {};
}>) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
    [key: string]: any;
}> & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T]: T[K];
} & {};
