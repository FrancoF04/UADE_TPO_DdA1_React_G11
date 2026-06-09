import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { colors, fontSizes } from '../config/theme';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useRobot } from '../hooks/useRobot';
import { useImage } from '../hooks/useImage';
import InterfazDeRed from '../components/Status/InterfazDeRed';
import ConectionButton from '../components/Status/ConectionButton';
import ConectionStatus from '../components/Status/ConectionStatus';
import DepurationOptionsButton from '../components/Status/DepurationOptionsButton';
import DepurationOptions from '../components/Status/DepurationOptions';

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
                        <ConectionStatus />
                    </View>
                    
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>PARÁMETROS DE RED</Text>
                        <InterfazDeRed />
                    </View>
                </View>
                <Image 
                    source={useImage(name)} 
                    style={styles.images}
                />
            </View>
            
            {isVisible && isConnected==='Connected' && <DepurationOptions />}
            
            <View style={styles.actionsContainer}>
                {isConnected==='Connected' && <DepurationOptionsButton setDepurationOptionsVisible={setIsVisible} />}
                <ConectionButton />
                {isConnected==='Connected' && (
                    <TouchableOpacity
                        style={styles.controlButton}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('Movement')}
                    >
                        <Text style={styles.controlButtonText}>Controlar robot</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 20,
    },
    header: {
        marginTop: 40,
        marginBottom: 20,
        width: '100%',
    },
    robotTitle: {
        fontSize: fontSizes.xl,
        color: colors.text,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    separator: {
        height: 2,
        backgroundColor: colors.primary,
        width: 100,
        marginTop: 8,
    },
    statusSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        padding: 20,
        borderRadius: 15,
        marginBottom: 30,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    infoContainer: {
        flex: 1,
        marginRight: 10,
    },
    infoItem: {
        marginBottom: 20,
    },
    label: {
        fontSize: fontSizes.sm - 2,
        color: colors.textSecondary,
        fontWeight: 'bold',
        marginBottom: 4,
        letterSpacing: 1,
    },
    images: {
        width: '40%',
        height: 120,
        resizeMode: 'contain',
    },
    depurationContainer: {
        flex: 1,
        marginBottom: 20,
    },
    actionsContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: 40,
    },
    controlButton: {
        width: '100%',
        height: 50,
        backgroundColor: colors.primary,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },
    controlButtonText: {
        fontSize: fontSizes.lg,
        color: colors.white,
        fontWeight: 'bold',
    },
});