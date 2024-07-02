import React from 'react';
import { Handle } from 'reactflow';

const ServiceNode = ({ data }) => {
    return (
      <div style={{ border: '1px solid #777', padding: 50, background: data.color, display: 'flex', flexDirection: 'column' }}>
        <div><strong>{data.label}</strong></div>
        <div style={{ display: 'flex', marginTop: 10 }}>
          {data.services && data.services.length > 0 ? (
            <div style={{ marginRight: 20 }}>
              <strong>Services:</strong>
              <div style={{ maxHeight: 250, overflowY: 'auto' }}>
                {data.services.map((service, index) => (
                  <div
                    key={index}
                    style={{
                      border: '1px solid #333',
                      padding: 5,
                      margin: '5px 0',
                      background: '#fff',
                    }}
                  >
                    <div><strong>service:</strong> {service.name}</div>
                    <div><strong>Application:</strong> {service.appName}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ marginRight: 20 }}>
                <strong>Services:</strong>
                <div>No services</div>
            </div>
          )}
          {data.hardware && (
            <div>
              <strong>Hardware:</strong>
              <div style={{ maxHeight: 250, overflowY: 'auto' }}>
                <div
                  style={{
                    border: '1px solid #333',
                    padding: 5,
                    margin: '5px 0',
                    background: '#fff',
                  }}
                >
                  <div><strong>CPU usage:</strong> {data.hardware.cpuUsage}%</div>
                  <div><strong>Number of Cores:</strong> {data.hardware.nrOfCores}</div>
                  <div><strong>Free RAM:</strong> {data.hardware.freeRam}mb</div>
                  <div><strong>Storage:</strong> {data.hardware.freeStorage}gb</div>
                </div>
              </div>
            </div>
          )} 
        </div>
        <Handle type="source" position="top" id="fog" />
        <Handle type="target" position="bottom" id="edge" />
      </div>
    );
  };
  
  export default ServiceNode;
  
