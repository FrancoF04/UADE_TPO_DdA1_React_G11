import {createContext, useState } from 'react';

export const RobotContext = createContext();

export const RobotProvider = ({ children }) => {
    const [robot, setRobotData] = useState({
        name: null,
        isConnected: "Disconnected",
    });
    
    const selectRobot = (componentData) => {
        setRobotData(prev => ({
            ...prev,      
            ...componentData,  
            isConnected: "Disconnected",
        }));
    }

    const disconnectRobot = () => {

        setRobotData({
            name: null,
            isConnected: "Disconnected",
        });
    }

    return (
        <RobotContext.Provider value={{ robot, selectRobot, disconnectRobot }}>
            {children}
        </RobotContext.Provider>
    );
}

