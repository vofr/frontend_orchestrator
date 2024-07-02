import './index.css';
import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MiniMap, Controls, applyNodeChanges  } from 'reactflow';
import 'reactflow/dist/style.css';
import ServiceNode from './ServiceNode';
import{
    fetchInfrastructureDetails
} from  '../services/api/api';
import WebSocketComponent from './WebSocketComponent';

const NODE_COLOR = "#faf5f5";
const bgColor = "#faf5f5";
const connectionLineStyle = { stroke: '#fff' };

const snapGrid = [20, 20];
const nodeTypes = {
  serviceNode: ServiceNode,
};

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

const Infrastructure = () => {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  useEffect(() => {
    console.log("INIT INFRASTRUCTURE")
    const fetchData = async () => {
      try {
        const result = await fetchInfrastructureDetails();
        console.log("Fetched data:", result);
        transformResponseToNodesAndEdges(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("NODES RIGHT NOW ARE: ", nodes)
  }, [nodes]);

  useEffect(() => {
    console.log("EDGES RIGHT NOW ARE: ", edges)
  }, [edges]);

  const transformResponseToNodesAndEdges = (data) => {
    console.log('data\n' + data.data)
    if (!data) {
        console.log('Data is null or undefined');
        return [];
      }

      const fogServerMeasurement = data.serverMeasurement && data.serverMeasurement[0];
      const fogHardwareMeasurements = fogServerMeasurement && fogServerMeasurement.hardwareMeasurements;
    

    const fogNode = {
      id: data.id.toString(),
      type: 'serviceNode',
      data: {
        color: NODE_COLOR,
        label: `${data.ipAddress}(FOG)`,
        services: [], // Add services if they exist in the response
        hardware: fogHardwareMeasurements ? {
          cpuUsage: data.serverMeasurement[0].hardwareMeasurements.cpuUsage,
          nrOfCores: data.serverMeasurement[0].hardwareMeasurements.numberOfProcessors,
          freeRam: data.serverMeasurement[0].hardwareMeasurements.ramFreeSpace,
          freeStorage: data.serverMeasurement[0].hardwareMeasurements.storageFreeSpace,
        } : {}
      },
      position: { x: 300, y: 0 },
    };

    console.log("fog: " , fogNode)
  
    // Edge nodes transformation
    const edgeNodes = (data.currentEdgeNodesDTO || []).map((edgeNode, index) => ({
      id: edgeNode.id.toString(),
      type: 'serviceNode',
      data: {
        color: NODE_COLOR,
        label: `${edgeNode.ipAddress}(EDGE)`,
        services: [], // Add services if they exist in the response
        hardware: {
          cpuUsage: edgeNode.serverMeasurement[0].hardwareMeasurements.cpuUsage,
          nrOfCores: edgeNode.serverMeasurement[0].hardwareMeasurements.numberOfProcessors,
          freeRam: edgeNode.serverMeasurement[0].hardwareMeasurements.ramFreeSpace,
          freeStorage: edgeNode.serverMeasurement[0].hardwareMeasurements.storageFreeSpace,
        }
      },
      position: { x: 0 + index * 500, y: 600 },
      targetPosition: 'left',
    }));
  
    setNodes([fogNode, ...edgeNodes]);

    const edgesBetweenNodes = (data.currentEdgeNodesDTO || []).map((edgeNode, index) => {
        const serverMeasurement = edgeNode.serverMeasurement && edgeNode.serverMeasurement[0];
        const connectivityMeasurements = serverMeasurement && serverMeasurement.connectivityMeasurements;
      
        const latency = connectivityMeasurements ? connectivityMeasurements[0].ping : 'N/A';
        const bandwidth = connectivityMeasurements ? connectivityMeasurements[0].bandwidth : 'N/A';
      
        return {
          id: `${edgeNode.id.toString()}-1`,
          source: edgeNode.id.toString(),
          target: "1",
          sourceHandle: 'fog', // Connect from the bottom
          targetHandle: 'edge', // Connect to the top
          animated: true,
          style: { stroke: '#000000' },
          label: `Latency: ${latency} ms\nBandwidth: ${bandwidth} mb/s`
        };
      });

    setEdges(edgesBetweenNodes);

  };

  const addNewEdge = useCallback((newNode) => {
    console.log("new node: ", newNode);
    setNodes((prevNodes) => [...prevNodes, newNode]);

    const serverMeasurement = newNode.serverMeasurement
    const connectivityMeasurements = serverMeasurement && serverMeasurement.connectivityMeasurements;
  
    const latency = connectivityMeasurements ? connectivityMeasurements[0].ping : 'N/A';
    const bandwidth = connectivityMeasurements ? connectivityMeasurements[0].bandwidth : 'N/A';
    const newEdge = {
      id: `${newNode.id}-1`,
      source: newNode.id,
      target: "1", // assuming "1" is the id of the fog node
      sourceHandle: 'fog', // Connect from the bottom
      targetHandle: 'edge', // Connect to the top
      animated: true,
      style: { stroke: '#000000' },
      label: `Latency: ${latency} ms\nBandwidth: ${bandwidth} mb/s`
    };
    setEdges((prevEdges) => [...prevEdges, newEdge]);
  }, []);

  const handleNotification = useCallback((notification) => {
    console.log("new notification action: ", notification.action);
    if (!notification) {
      return;
    }

    if (notification.action === "new_edge") {
      console.log("new edge");
      const nodeServerMeasurement = notification.edge.serverMeasurement && notification.edge.serverMeasurement[0];
      const nodeHardwareMeasurements = nodeServerMeasurement && nodeServerMeasurement.hardwareMeasurements;
      const newNode = {
        id: notification.edge.id.toString(),
        type: 'serviceNode',
        data: {
          color: NODE_COLOR,
          label: `${notification.edge.ipAddress}(EDGE)`,
          services: [], // Add services if they exist in the response
          hardware: nodeHardwareMeasurements ? {
            cpuUsage: notification.edge.serverMeasurement[0].hardwareMeasurements.cpuUsage,
            nrOfCores: notification.edge.serverMeasurement[0].hardwareMeasurements.numberOfProcessors,
            freeRam: notification.edge.serverMeasurement[0].hardwareMeasurements.ramFreeSpace,
            freeStorage: notification.edge.serverMeasurement[0].hardwareMeasurements.storageFreeSpace,
          } : {}
        },
        position: { x: (0 + ((notification.edge.id-2) * 500)), y: 600 },
      };
      addNewEdge(newNode);
    } else if (notification.action === "new_node_measurements") {
      console.log("new measurement");
      setNodes((prevNodes) => {
        const updatedNodes = prevNodes.map((node) => {
          if (node.id === notification.nodeId.toString()) {
            const hardwareMeasurements = notification.server_measurement && notification.server_measurement.hardwareMeasurements;
            if (notification.nodeId.toString() !== "1"){ //not fog
              console.log("update edge label");
              setEdges((prevEdges) => {
                return prevEdges.map((edge) => {
                  if (edge.id === `${notification.nodeId.toString()}-1`) {
                    const connectivityMeasurements = notification.server_measurement && notification.server_measurement.connectivityMeasurements[0];
                    const latency = connectivityMeasurements ? connectivityMeasurements.ping : 'N/A';
                    const bandwidth = connectivityMeasurements ? connectivityMeasurements.bandwidth : 'N/A';
                    return {
                      ...edge,
                      label: `Latency: ${latency} ms\nBandwidth: ${bandwidth} mb/s`
                    };
                  }
                  return edge;
                });
              });
            } else {
              console.log("NOT update edge label because: ", notification.nodeId.toString());
            }
            if (hardwareMeasurements) {
              return {
                ...node,
                data: {
                  ...node.data,
                  hardware: {
                    cpuUsage: hardwareMeasurements.cpuUsage,
                    nrOfCores: hardwareMeasurements.numberOfProcessors,
                    freeRam: hardwareMeasurements.ramFreeSpace,
                    freeStorage: hardwareMeasurements.storageFreeSpace,
                  }
                }
              };
            }
          }
          return node;
        });
        return updatedNodes;
      });
    }
  }, [addNewEdge]);

  return (
    <div style={{ height: 1100 }}>
        <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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
       <WebSocketComponent
        handleNotification={handleNotification}
       />
    </div>
  );
};

export default Infrastructure;