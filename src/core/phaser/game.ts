import * as Phaser from 'phaser'; // CORRECCIÓN: Se usa una importación de namespace
import MainScene from './scenes/MainScene';

/**
 * Configuración principal del juego de Phaser.
 */
export const phaserConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'phaser-container',
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#111827',
    scene: [MainScene],
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: process.env.NODE_ENV === 'development',
            gravity: { x: 0, y: 0 },
        },
    },
};
