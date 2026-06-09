import { useContext } from 'react';
import { RobotContext } from '../context/RobotContext';

export const useRobot = () => {
    const context = useContext(RobotContext);
    if (!context) {
        throw new Error('useRobot debe usarse dentro de un RobotProvider');
    }
    return context;
};