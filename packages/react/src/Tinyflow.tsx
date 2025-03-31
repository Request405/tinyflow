// 导入必要的 React Hooks
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import {
    Tinyflow as TinyflowNative,
    type TinyflowOptions as TinyflowNativeOptions
} from '@tinyflow-ai/ui';
// 导入 Tinyflow UI 组件的样式
import '@tinyflow-ai/ui/dist/index.css';

/**
 * Tinyflow 组件的配置选项类型
 * 继承自原生 TinyflowOptions，但排除 'element' 属性
 * 并添加 React 特有的 style 和 className 属性
 */
export type TinyflowOptions = {
    style?: React.CSSProperties;
    className?: string;
} & Omit<TinyflowNativeOptions, 'element'>;

/**
 * Tinyflow 组件的引用接口
 * 定义了可以通过 ref 访问的方法
 */
export interface TinyflowHandle {
    getData: () => any;
}

/**
 * Tinyflow React 组件
 * 使用 forwardRef 以支持引用传递
 */
const Tinyflow = forwardRef<TinyflowHandle, TinyflowOptions>((options, ref) => {
    // 创建对 DOM 元素的引用
    const divRef = useRef<HTMLDivElement | null>(null);
    // 保存 Tinyflow 实例的引用
    const tinyflowInstance = useRef<TinyflowNative | null>(null);

    // 暴露组件方法给父组件
    useImperativeHandle(ref, () => ({
        getData: () => {
            if (tinyflowInstance.current) {
                return tinyflowInstance.current.getData();
            }
            console.warn('Tinyflow instance is not initialized');
            return null;
        }
    }));

    // 从 props 中解构需要的属性
    const { data, style, className } = options;

    // 处理组件的生命周期
    useEffect(() => {
        if (divRef.current) {
            // 创建新的 Tinyflow 实例
            const tinyflow = new TinyflowNative({
                ...options,
                element: divRef.current
                // data: data
            });

            tinyflowInstance.current = tinyflow;

            // 清理函数：组件卸载时销毁 Tinyflow 实例
            return () => {
                tinyflow.destroy();
                tinyflowInstance.current = null;
            };
        }
    }, [data]); // 当 data 变化时重新初始化

    // 渲染包含 Tinyflow 的容器 div
    return <div ref={divRef} style={{ height: '600px', ...style }} className={className} />;
}) as React.ForwardRefExoticComponent<TinyflowOptions & React.RefAttributes<TinyflowHandle>>;

export default Tinyflow;
