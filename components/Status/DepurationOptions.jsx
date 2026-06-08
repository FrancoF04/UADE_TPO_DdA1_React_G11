import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { colors } from '../../config/theme';
import DepurationOptionsButton from './DepurationOptionsButton';

export default function DepurationOptions() {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <View>
            <DepurationOptionsButton setDepurationOptionsVisible={setIsVisible} />
        </View>
    );
}

const styles = StyleSheet.create({
});