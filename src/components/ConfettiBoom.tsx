import LottieView from 'lottie-react-native';
import React from 'react';
import { View } from 'react-native';

type ConfettiBoomProps = {
    animRef: React.RefObject<LottieView>;
    coords: [number, number];
};

export default function ConfettiBoom({ animRef, coords }: ConfettiBoomProps) {
    return (
        <View
            style={{
                left: coords[0] - 100,
                top: coords[1] - 200,
                position: 'absolute',
                pointerEvents: 'none',
                zIndex: 100,
            }}
        >
            <LottieView
                ref={animRef}
                source={require('../lottie/confetti-boom.json')}
                autoPlay={false}
                loop={false}
                style={{
                    width: 200,
                    height: 200,
                }}
                speed={1.75}
            />
        </View>
    );
}
