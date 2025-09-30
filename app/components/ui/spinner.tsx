import React, { useRef, useEffect, useState } from 'react';

interface SpinnerState {
    isShowing: boolean;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    arcPercentage: number; // 0 to 100
}   

export function useSpinner() {
    const [spinnerState, setSpinnerState] = useState({
        isShowing: false,
        isLoading: false,
        isSuccess: false,
        isError: false,
        arcPercentage: 15
    })

    const showSpinner = () => setSpinnerState(prev=> ({
         ...prev,
        isShowing: true
    }));

    const hideSpinner = () => setSpinnerState(prev => ({
        ...prev,
        isShowing: false
    }));

    const showSpinnerLoading = () => setSpinnerState(prev => ({
        ...prev,
        isLoading: true
    }));

    const showSpinnerSuccess = () => setSpinnerState({
        isShowing: true,
        isLoading: false,
        isSuccess: true,
        isError: false,
        arcPercentage: 100
    });

    const showSpinnerError = () => setSpinnerState({
        isShowing: true,
        isLoading: false,
        isSuccess: false,
        isError: true,
        arcPercentage: 100
    });

    return {
        spinnerState,
        showSpinner,
        hideSpinner,
        showSpinnerLoading,
        showSpinnerSuccess,
        showSpinnerError
    };
}

export default function SpinnerComponent({ spinnerState, size = 80 }: { spinnerState: SpinnerState, size?: number }) {
    const { isShowing, isLoading, isSuccess, isError, arcPercentage } = spinnerState;
    const [currentRotation, setCurrentRotation] = useState(0);
    const [isCompletingRotation, setIsCompletingRotation] = useState(false);
    const rotationRef = useRef(0);
    const animationRef = useRef<number | null>(null);
    const isLoadingRef = useRef(isLoading); // ← Add this ref

    // Handle rotation animation
    useEffect(() => {
        isLoadingRef.current = isLoading; // ← Keep ref in sync
        
        if (isLoading) {
            setIsCompletingRotation(false);
            
            // Cancel any existing animation
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            
            let startTime: number | null = null;
            
            const animate = (timestamp: number) => {
                // Check if we're still loading before continuing
                if (!isLoadingRef.current) return;
                
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                
                // Calculate current rotation (360 degrees per 1000ms)
                const newRotation = (elapsed / 1000) * 360;
                rotationRef.current = newRotation % 360;
                setCurrentRotation(newRotation);
                
                animationRef.current = requestAnimationFrame(animate);
            };
            
            animationRef.current = requestAnimationFrame(animate);
        } else if (!isCompletingRotation && rotationRef.current !== 0) {
            console.log('Stopping loading animation');

            // Cancel any existing animation first
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            
            setIsCompletingRotation(true);
            
            const currentRot = rotationRef.current;
            const targetRotation = Math.ceil(currentRot / 360) * 360;
            const remaining = targetRotation - currentRot;
            const duration = (remaining / 360) * 1000;

            const startRotation = currentRot;
            let startTime: number | null = null;

            const completeRotation = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const easeOut = 1 - Math.pow(1 - progress, 2);
                const newRotation = startRotation + (remaining * easeOut);

                setCurrentRotation(newRotation);
                rotationRef.current = newRotation;
                
                if (progress < 1) {
                    animationRef.current = requestAnimationFrame(completeRotation);
                } else {
                    // After completing rotation, smoothly return to start
                    setTimeout(() => {
                        // setCurrentRotation(0);
                        // rotationRef.current = 0;
                        setIsCompletingRotation(false);
                    }, 200);
                }
            };

            animationRef.current = requestAnimationFrame(completeRotation);
        }

        return () => {
            // We don't cancel here anymore - we cancel explicitly when starting new animations
        };
    }, [isLoading, isCompletingRotation]);

    if (!isShowing) return null;

    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = `${(arcPercentage / 100) * circumference} ${circumference}`;
    const outerSize = size * 1.15;
    const innerSize = size * 0.75;

    return (
        <div className="flex items-center justify-center">
            <div
                className="relative"
                style={{
                    height: `${size}px`,
                    width: `${size}px`,
                    '--spinner-size': `${size}px`,
                    '--spinner-outer-size': `${outerSize}px`,
                    '--spinner-outer-size-pulsed': `${outerSize * 1.15}px`
                } as React.CSSProperties}
            >
                {/* Inner circle */}
                <div 
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full z-10 ${
                        isShowing ? 'animate-fade-in' : 'animate-fade-out'
                    }`}
                    style={{
                        width: `${innerSize}px`,
                        height: `${innerSize}px`,
                        backgroundColor: isError ? '#ef4444' : isSuccess ? '#10b981' : '#3b82f6'
                    }}
                ></div>

                <div
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                        isSuccess ? 'animate-grow-shrink-outer' : ''
                    }`}
                    style={{ width: `${outerSize}px`, height: `${outerSize}px` }}
                >
                    <svg
                        className="w-full h-full transition-transform duration-300 ease-out"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="xMidYMid meet"
                        style={{ 
                            transform: `rotate(${currentRotation}deg)`,
                            // Smooth transition when returning to start, instant during rotation
                            transition: currentRotation === 0 ? 'transform 0.3s ease-out' : 'none'
                        }}
                    >
                        {/* Background circle */}
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                        {/* Animated arc with rounded ends */}
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke={isError ? "#ef4444" : isSuccess ? "#10b981" : "#3b82f6"}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={strokeDasharray}
                            transform="rotate(-90 50 50)"
                            className="transition-all duration-300"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}
