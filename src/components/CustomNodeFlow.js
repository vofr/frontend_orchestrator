import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MiniMap, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import ServiceNode from './ServiceNode';
import ColorSelectorNode from './ColorSelectorNode';

import './index.css';

const initBgColor = "#faf5f5";

const connectionLineStyle = { stroke: '#fff' };
const snapGrid = [20, 20];
const nodeTypes = {
  serviceNode: ServiceNode,
};

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

const CustomNodeFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [bgColor, setBgColor] = useState(initBgColor);

  useEffect(() => {
    const onChange = (event) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id !== '2') {
            return node;
          }

          const color = event.target.value;

          setBgColor(color);

          return {
            ...node,
            data: {
              ...node.data,
              color,
            },
          };
        })
      );
    };

    setNodes([
      {
        id: '2',
        type: 'serviceNode',
        data: {
          onChange: onChange,
          color: initBgColor,
          label: 'Node with Services',
          services: [
            { name: 'Service 1A', appName: 'Front testting application' },
            { name: 'Service 2', appName: 'App B' },
            { name: 'Service 3A', appName: 'App A' },
            { name: 'Service 4B', appName: 'App B' },
            { name: 'Service 5A', appName: 'App A' },
            { name: 'Service 6B', appName: 'App B' }
          ],
          hardware:{
              cpuUsage: 20,
              nrOfCores: 4,
              freeRam:1034,
              freeStorage:32
          }
        },
        position: { x: 300, y: 0 },
      },
      {
        id: '3',
        type: 'serviceNode',
        data: {
            onChange: onChange,
            color: initBgColor,
            label: 'Node with Services',
            hardware:{
                cpuUsage: 20,
                nrOfCores: 4,
                freeRam:1034,
                freeStorage:32
            }
          },
        position: { x: 150, y: 700 },
        targetPosition: 'left',
      },
      {
        id: '4',
        type: 'serviceNode',
        data: {
            onChange: onChange,
            color: initBgColor,
            label: 'Node with Services',
            services: [
              { name: 'Service 1B', appName: 'App B' }
            ],
            hardware:{
                cpuUsage: 20,
                nrOfCores: 4,
                freeRam:1034,
                freeStorage:32
            }
          },
        position: { x: 650, y: 700 },
        targetPosition: 'left',
      },
    ]);

    setEdges([
      {
        id: 'e2a-3',
        source: '2',
        target: '3',
        sourceHandle: 'fog', // Connect from the bottom of node '2'
        targetHandle: 'edge', // Connect to the top of node '3'
        animated: true,
        style: { stroke: '#000000' },
        label: `Latency: 10 ms\nBandwidth: 100mb/s`
      },
      {
        id: 'e2b-4',
        source: '2',
        target: '4',
        sourceHandle: 'fog', // Connect from the bottom of node '2'
        targetHandle: 'edge', // Connect to the top of node '3'
        animated: true,
        style: { stroke: '#000000' },
      },
    ]);
  }, []);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#fff' } }, eds)),
    []
  );
  return (
    <div style={{ height: 1100 }}>
        <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        style={{ background: bgColor }}
        nodeTypes={nodeTypes}
        connectionLineStyle={connectionLineStyle}
        snapToGrid={true}
        snapGrid={snapGrid}
        defaultViewport={defaultViewport}
        fitView
        attributionPosition="bottom-left"
        >
        <MiniMap
            nodeStrokeColor={(n) => {
            if (n.type === 'input') return '#0041d0';
            if (n.type === 'selectorNode') return bgColor;
            if (n.type === 'output') return '#ff0072';
            }}
            nodeColor={(n) => {
            if (n.type === 'selectorNode') return bgColor;
            return '#fff';
            }}
        />
        <Controls />
        </ReactFlow>
    </div>
  );
};

export default CustomNodeFlow;
