import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BASE_API_URL,
    CONTROLLER,
    FOG_IP,
    INFRASTRUCTURE
} from './urls'

const infra = {
    "id": 1,
    "ipAddress": "192.168.1.183",
    "serverMeasurement": [
      {
        "id": 7,
        "hardwareMeasurements": {
          "id": 7,
          "cpuUsage": 5.6,
          "numberOfProcessors": 4,
          "ramFreeSpace": 1351.49,
          "storageFreeSpace": 58.36
        },
        "connectivityMeasurements": [
          {
            "id": 11,
            "ping": 0,
            "bandwidth": 33.727,
            "ipAddress": "192.168.1.183"
          }
        ],
        "timestamp": 1719967088407
      }
    ],
    "currentTasks": null,
    "pastTasks": null,
    "currentEdgeNodesDTO": [
      {
        "id": 2,
        "ipAddress": "192.168.1.40",
        "serverMeasurement": [
          {
            "id": 8,
            "hardwareMeasurements": {
              "id": 8,
              "cpuUsage": 33.4,
              "numberOfProcessors": 2,
              "ramFreeSpace": 0.26,
              "storageFreeSpace": 151.76
            },
            "connectivityMeasurements": [
              {
                "id": 12,
                "ping": 2,
                "bandwidth": 4.763,
                "ipAddress": "192.168.1.183"
              }
            ],
            "timestamp": 1719967153070
          }
        ],
        "currentTasks": [
            { "name": "Service 1", "appName": "App 1" }],
        "pastTasks": [],
        "joinStartTimestamp": 1719966894340,
        "joinEndTimestamp": -1
      },
      {
        "id": 3,
        "ipAddress": "192.168.1.183",
        "serverMeasurement": [
          {
            "id": 9,
            "hardwareMeasurements": {
              "id": 9,
              "cpuUsage": 8.2,
              "numberOfProcessors": 4,
              "ramFreeSpace": 1025.47,
              "storageFreeSpace": 58.36
            },
            "connectivityMeasurements": [
              {
                "id": 15,
                "ping": 0,
                "bandwidth": 36.166,
                "ipAddress": "192.168.1.183"
              }
            ],
            "timestamp": 1719967163353
          }
        ],
        "currentTasks":     [
            { "name": "Service 2", "appName": "App 1" },
            { "name": "Service 3", "appName": "App 2" },
            { "name": "Service 4", "appName": "App 3" }
            ],
        "pastTasks": [],
        "joinStartTimestamp": 1719966901175,
        "joinEndTimestamp": -1
      }
    ],
    "pastEdgeNodesDTO": null,
    "joinStartTimestamp": 0,
    "joinEndTimestamp": 0
  }

export const fetchInfrastructureDetails = async () => {
    try {
        //const response = await axios.get(`${BASE_API_URL}${CONTROLLER}${INFRASTRUCTURE}`);
        //return response.data;
        const response = infra;
        return response;
    } catch (error) {
        throw new Error(`Failed to fetch infrastructure details: ${error.message}`);
    }
};