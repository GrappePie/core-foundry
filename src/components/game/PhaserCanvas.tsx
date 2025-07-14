'use client';

import { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';
import { phaserConfig } from '@/core/phaser/game';
import MainScene from '@/core/phaser/scenes/MainScene';
import { VisualConfig } from '@/lib/types';

interface PhaserCanvasProps {
    visualConfig: VisualConfig;
}

const PhaserCanvas = ({ visualConfig }: PhaserCanvasProps) => {
    const gameRef = useRef<Phaser.Game | null>(null);

    // Inicialización del juego y monkey-patch de AudioContext
    useEffect(() => {
        if (typeof window === 'undefined' || gameRef.current) return;

        const game = new Phaser.Game({
            ...phaserConfig,
            scene: [MainScene],
        });
        gameRef.current = game;

        // Evitar resume en AudioContext cerrado
        const soundManager = (game.sound as any);
        if (soundManager?.context) {
            const rawCtx: AudioContext =
                soundManager.context.rawContext ||
                soundManager.context.audioContext ||
                soundManager.context;
            const originalResume = rawCtx.resume.bind(rawCtx);
            rawCtx.resume = async () => {
                if (rawCtx.state === 'suspended') return originalResume();
                if (rawCtx.state === 'running') return;
                console.warn(`Ignored resume on AudioContext in state: ${rawCtx.state}`);
            };
        }

        return () => {
            game.destroy(true);
            gameRef.current = null;
        };
    }, []);

    // Sincronizar visualConfig con la escena Phaser (polling hasta que la escena esté activa)
    useEffect(() => {
        let cancelled = false;
        let synced = false;

        const tick = () => {
            if (cancelled) return;
            const game = gameRef.current;
            if (!game) {
                requestAnimationFrame(tick);
                return;
            }
            const scene = game.scene.getScene('MainScene') as MainScene;
            if (scene && scene.scene.isActive()) {
                try {
                    scene.syncWithReact(visualConfig);
                } catch (err) {
                    console.warn('Error sincronizando escena:', err);
                }
                synced = true;
            }
            if (!synced) {
                requestAnimationFrame(tick);
            }
        };

        tick();
        return () => { cancelled = true; };
    }, [visualConfig]);

    return <div id="phaser-container" className="w-full h-full" />;
};

export default PhaserCanvas;
