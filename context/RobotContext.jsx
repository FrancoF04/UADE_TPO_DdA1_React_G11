import { createContext, useState } from 'react';
import { conectionService } from '../services/conectionService';

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

    const connectRobot = async () => {
        setRobotData(prev => ({
            ...prev,
            isConnected: "Connecting",
        }));
        
        try {
            await conectionService.connect(robot.name);

            setRobotData(prev => ({
                ...prev,
                isConnected: "Connected",
                NetworkInterface: "eth0"
            }));
        } catch (error) {
            console.warn('[RobotContext] Mock server no disponible o error HTTP:', error.message || error);
            // Comportamiento fallback: Permitir simular la conexión para propósitos de prueba de UI
            setRobotData(prev => ({
                ...prev,
                isConnected: "Error"
            }));
        }
    }

    const disconnectRobot = async () => {
        try {
            await conectionService.disconnect();

            setRobotData(prev => ({
            ...prev,
            isConnected: "Disconnected",
            NetworkInterface: null,
        }));
        } catch (error) {
            console.warn('[RobotContext] Error al desconectar desde la API:', error.message || error);
        }
    }

    return (
        <RobotContext.Provider value={{ robot, selectRobot, deselectRobot,connectRobot, disconnectRobot }}>
            {children}
        </RobotContext.Provider>
    );
}

