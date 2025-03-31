import { getContext } from 'svelte';
import { useNodesData, useSvelteFlow } from '@xyflow/svelte';
import type { TinyflowOptions } from '../../Tinyflow';

/**
 * 获取当前节点的ID
 * Returns the current node ID from the Svelte context
 */
export const useCurrentNodeId = () => {
    return getContext<string>('svelteflow__node_id');
};

/**
 * 获取Tinyflow的配置选项
 * Returns the Tinyflow options from the Svelte context
 */
export const getOptions = () => {
    return getContext<TinyflowOptions>('tinyflow_options');
};

/**
 * 获取当前节点的数据
 * Returns the data associated with the current node
 */
export const useCurrentNodeData = () => {
    const currentNodeId = useCurrentNodeId();
    return useNodesData<any>(currentNodeId);
};

/**
 * 返回一个用于更新当前节点数据的函数
 * Returns a function to update the current node's data
 * @returns {{ updateNodeData: (data: any) => void }} 包含更新节点数据方法的对象
 */
export const useUpdateNodeData = () => {
    const { updateNodeData } = useSvelteFlow();
    const currentNodeId = useCurrentNodeId();
    return {
        updateNodeData: (data: any) => {
            updateNodeData(currentNodeId, data);
        }
    };
};
