import { Text, View, Image, TouchableOpacity } from 'react-native';
import styles from './StatusScreen.styles';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useRobot } from '../hooks/useRobot';
import { useImage } from '../hooks/useImage';
import NetworkInterface from '../components/Status/NetworkInterface';
import ConnectionButton from '../components/Status/ConnectionButton';
import ConnectionStatus from '../components/Status/ConnectionStatus';
import DebugOptionsButton from '../components/Status/DebugOptionsButton';
import DebugOptions from '../components/Status/DebugOptions';

export default function StatusScreen() {
    const { name, isConnected } = useRobot();
    const [isVisible, setIsVisible] = useState(false);
    const navigation = useNavigation();

    const isLocked = isConnected === 'Connected' || isConnected === 'Reconnecting';

    useEffect(() => {
        navigation.setOptions({
            headerBackVisible: !isLocked,
            gestureEnabled: !isLocked,
        });

        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (isLocked) {
                e.preventDefault();
            }
        });

        return unsubscribe;
    }, [navigation, isLocked]);
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.robotTitle}>{name?.toUpperCase() || 'ROBOT'}</Text>
                <View style={styles.separator} />
            </View>

            <View style={styles.statusSection}>
                <View style={styles.infoContainer}>
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>CONEXIÓN</Text>
                        <ConnectionStatus />
                    </View>
                    
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>PARÁMETROS DE RED</Text>
                        <NetworkInterface />
                    </View>
                </View>
                <Image 
                    source={useImage(name)} 
                    style={styles.images}
                />
            </View>
            
                {isVisible && isConnected==='Connected' && <DebugOptions />}
            
            <View style={styles.actionsContainer}>
                {isConnected==='Connected' && <DebugOptionsButton setDebugOptionsVisible={setIsVisible} />}
                {isConnected==='Connected' && (
                    <TouchableOpacity
                        style={styles.controlButton}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('Movement')}
                    >
                        <Text style={styles.controlButtonText}>Mover Robot</Text>
                    </TouchableOpacity>
                )}
                {isConnected==='Connected' && (
                    <TouchableOpacity
                        style={[styles.controlButton, styles.actionsButton]}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('Actions')}
                    >
                        <Text style={styles.controlButtonText}>Acciones</Text>
                    </TouchableOpacity>
                )}
                <ConnectionButton />
            </View>
        </View>
    );
}

