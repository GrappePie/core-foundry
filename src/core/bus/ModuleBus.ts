import type { ModuleEventMap } from '@/lib/types';

type EventCallback<Payload> = (payload: Payload) => void;

class EventBus<T> {
    private subscribers: { [K in keyof T]?: Set<EventCallback<T[K]>> } = {};

    subscribe<K extends keyof T>(eventType: K, callback: EventCallback<T[K]>): () => void {
        if (!this.subscribers[eventType]) {
            this.subscribers[eventType] = new Set();
        }
        this.subscribers[eventType]!.add(callback);

        return () => {
            this.subscribers[eventType]!.delete(callback);
        };
    }

    publish<K extends keyof T>(event: { type: K; payload: T[K] }): void {
        this.subscribers[event.type]?.forEach((callback) => {
            (callback as EventCallback<T[K]>)(event.payload);
        });
    }
}

const ModuleBus = new EventBus<ModuleEventMap>();
export default ModuleBus;
