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

    const deselectRobot = () => {
        setRobotData({
            name: null,
            isConnected: null,
            NetworkInterface: null,
        });
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
        setRobotData(prev => ({
            ...prev,
            isConnected: "Disconnected",
            NetworkInterface: null,
        }));
    }

    return (
        <RobotContext.Provider value={{ robot, selectRobot, deselectRobot,connectRobot, disconnectRobot }}>
            {children}
        </RobotContext.Provider>
    );
}

