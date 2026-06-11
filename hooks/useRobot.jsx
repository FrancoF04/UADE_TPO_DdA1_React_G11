import { useContext } from 'react';
import { RobotContext } from '@/context/RobotContext';

export const useRobot = () => {
    const context = useContext(RobotContext);
    if (!context) {
        throw new Error('useRobot must be used within a RobotProvider');
    }
    return context;
};