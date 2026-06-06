import {createContext, useState } from 'react';

export const RobotContext = createContext();

export const RobotProvider = ({ children }) => {
    const [robot, setRobotData] = useState({
        name: null,
        isConnected: null,
        NetworkInterface: null,
    });
    
    const selectRobot = (componentData) => {
        setRobotData(prev => ({
            ...prev,      
            ...componentData,  
            isConnected: "Disconnected",
        }));
    }

    const connectRobot = () => {
        setRobotData(prev => ({
            ...prev,
            isConnected: "Connecting",
        }));
        
        // LLAMADA A LA API PARA CONECTAR EL ROBOT

        setRobotData(prev => ({
            ...prev,
            isConnected: "Connected",
            NetworkInterface: "eth0"
        }));
    }

    const disconnectRobot = () => {
        setRobotData({
            name: null,
            isConnected: "Disconnected",
            NetworkInterface: null,
        });
    }

    return (
        <RobotContext.Provider value={{ robot, selectRobot, connectRobot, disconnectRobot }}>
            {children}
        </RobotContext.Provider>
    );
}

