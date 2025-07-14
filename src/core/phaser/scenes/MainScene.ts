import * as Phaser from 'phaser'; // CORRECCIÓN: Se usa una importación de namespace
import ModuleBus from '@/core/bus/ModuleBus';
import { VisualConfig } from '@/lib/types';

// El resto del código de MainScene no necesita cambios, solo la importación.
const SPRITE_TINT = 0xaaaaff;
const SPRITE_HOVER_TINT = 0xffffff;
const CONNECTION_COLOR = 0x00ff00;

export default class MainScene extends Phaser.Scene {
    private moduleSprites!: Phaser.GameObjects.Group;
    private connectionGraphics!: Phaser.GameObjects.Graphics;
    private currentVisualConfig: VisualConfig | null = null;
    private selectedForConnection: Phaser.GameObjects.Sprite | null = null;

    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.image('module_placeholder', '/assets/sprites/module_placeholder.png');
    }

    create() {
        this.moduleSprites = this.add.group();
        this.connectionGraphics = this.add.graphics();
        this.cameras.main.setBackgroundColor('#111827');
        this.setupCameraControls();
        this.setupModuleInteractions();
        this.events.emit('ready');
    }

    public syncWithReact(visualConfig: VisualConfig) {
        this.currentVisualConfig = visualConfig;
        this.drawModules();
        this.drawConnections();
    }

    private drawModules() {
        if (!this.currentVisualConfig) return;
        const activeModuleIds = Object.keys(this.currentVisualConfig.positions);
        this.moduleSprites.getChildren().forEach(sprite => {
            const s = sprite as Phaser.GameObjects.Sprite;
            if(!activeModuleIds.includes(s.getData('moduleId'))) {
                s.destroy();
            }
        });
        activeModuleIds.forEach(moduleId => {
            const pos = this.currentVisualConfig!.positions[moduleId];
            let sprite = this.findSpriteByModuleId(moduleId);
            if (sprite) {
                sprite.setPosition(pos.x, pos.y);
            } else {
                sprite = this.add.sprite(pos.x, pos.y, 'module_placeholder')
                    .setData('moduleId', moduleId)
                    .setTint(SPRITE_TINT)
                    .setInteractive({ useHandCursor: true });
                this.moduleSprites.add(sprite);
                this.input.setDraggable(sprite);
            }
        });
    }

    private drawConnections() {
        if (!this.currentVisualConfig) return;
        this.connectionGraphics.clear();
        this.connectionGraphics.lineStyle(2, CONNECTION_COLOR, 0.6);
        this.currentVisualConfig.connections.forEach(({ from, to }) => {
            const fromSprite = this.findSpriteByModuleId(from);
            const toSprite = this.findSpriteByModuleId(to);
            if (fromSprite && toSprite) {
                this.connectionGraphics.lineBetween(fromSprite.x, fromSprite.y, toSprite.x, toSprite.y);
            }
        });
    }

    private findSpriteByModuleId(id: string): Phaser.GameObjects.Sprite | null {
        return this.moduleSprites.getChildren().find(s => (s as Phaser.GameObjects.Sprite).getData('moduleId') === id) as Phaser.GameObjects.Sprite || null;
    }

    private setupModuleInteractions() {
        this.input.on('drag', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite, dragX: number, dragY: number) => {
            gameObject.setPosition(dragX, dragY);
            this.drawConnections();
        });
        this.input.on('dragend', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite) => {
            ModuleBus.publish({
                type: 'module:dragged',
                payload: {
                    moduleId: gameObject.getData('moduleId'),
                    position: { x: gameObject.x, y: gameObject.y },
                },
            });
        });
        this.input.on('gameobjectover', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) => {
            (gameObject as Phaser.GameObjects.Sprite).setTint(SPRITE_HOVER_TINT);
        });
        this.input.on('gameobjectout', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) => {
            const sprite = gameObject as Phaser.GameObjects.Sprite;
            if(this.selectedForConnection !== sprite) {
                sprite.setTint(SPRITE_TINT);
            }
        });
        this.input.on('gameobjectdown', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) => {
            const sprite = gameObject as Phaser.GameObjects.Sprite;
            const moduleId = sprite.getData('moduleId');
            if (pointer.event.shiftKey) {
                if (!this.selectedForConnection) {
                    this.selectedForConnection = sprite;
                    sprite.setTint(0xff0000);
                } else if (this.selectedForConnection !== sprite) {
                    ModuleBus.publish({
                        type: 'module:connect',
                        payload: { from: this.selectedForConnection.getData('moduleId'), to: moduleId }
                    });
                    this.selectedForConnection.setTint(SPRITE_TINT);
                    this.selectedForConnection = null;
                }
            } else {
                ModuleBus.publish({ type: 'ui:module:open', payload: { moduleId } });
            }
        });
    }

    private setupCameraControls() {
        this.input.on('wheel', (pointer: Phaser.Input.Pointer, gameObjects: Phaser.GameObjects.GameObject[], deltaX: number, deltaY: number) => {
            const newZoom = this.cameras.main.zoom - deltaY * 0.001;
            this.cameras.main.setZoom(Phaser.Math.Clamp(newZoom, 0.3, 2));
        });
        let isPanning = false;
        let startX = 0;
        let startY = 0;
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.rightButtonDown() || pointer.middleButtonDown()) {
                isPanning = true;
                startX = pointer.x;
                startY = pointer.y;
            }
        });
        this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
            if (pointer.rightButtonReleased() || pointer.middleButtonReleased()) {
                isPanning = false;
            }
        });
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (isPanning) {
                this.cameras.main.scrollX -= (pointer.x - startX) / this.cameras.main.zoom;
                this.cameras.main.scrollY -= (pointer.y - startY) / this.cameras.main.zoom;
                startX = pointer.x;
                startY = pointer.y;
            }
        });
    }
}
