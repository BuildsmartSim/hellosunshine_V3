"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Hydration guard hook
export function useHasMounted() {
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);
    return hasMounted;
}

interface MediaItem {
    src: string;
    label?: string;
    id: string; // Unique ID for Framer Motion layoutId
    aspect?: string; // e.g., 'aspect-[16/9]'
    padding?: string; // e.g., '12px'
    borderRadius?: string;
    variant?: 'A' | 'B' | 'C';
}

interface MediaContextType {
    activeMedia: MediaItem | null;
    isTransitioning: boolean;
    openMedia: (item: MediaItem) => void;
    closeMedia: () => void;
    setTransitioning: (val: boolean) => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export function MediaProvider({ children }: { children: ReactNode }) {
    const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const openMedia = (item: MediaItem) => {
        setActiveMedia(item);
        setIsTransitioning(true);
    };

    const closeMedia = () => {
        setActiveMedia(null);
        setIsTransitioning(true);
    };

    return (
        <MediaContext.Provider value={{
            activeMedia,
            isTransitioning,
            openMedia,
            closeMedia,
            setTransitioning: setIsTransitioning
        }}>
            {children}
        </MediaContext.Provider>
    );
}

export function useMedia() {
    const context = useContext(MediaContext);
    if (!context) {
        throw new Error('useMedia must be used within a MediaProvider');
    }
    return context;
}
