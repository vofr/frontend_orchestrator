import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BASE_API_URL,
    CONTROLLER,
    FOG_IP,
    INFRASTRUCTURE
} from './urls'

export const fetchInfrastructureDetails = async () => {
    try {
        const response = await axios.get(`${BASE_API_URL}${CONTROLLER}${INFRASTRUCTURE}`);
        console.log("response: " + response.data); 
        
        console.log("response server: " , response.data
        ); 
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch infrastructure details: ${error.message}`);
    }
};