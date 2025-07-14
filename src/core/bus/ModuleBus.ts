// Note: Removed unused ModuleEvent import

// Generic callback for events with typed payloads
type EventCallback<Payload> = (payload: Payload) => void;

class EventBus {
    private subscribers: Map<string, Set<EventCallback<unknown>>> = new Map();

    subscribe<Payload>(eventType: string, callback: EventCallback<Payload>): () => void {
        if (!this.subscribers.has(eventType)) {
            this.subscribers.set(eventType, new Set());
        }
        this.subscribers.get(eventType)!.add(callback as EventCallback<unknown>);

        return () => {
            this.subscribers.get(eventType)?.delete(callback as EventCallback<unknown>);
        };
    }

    publish<Payload>(event: { type: string; payload: Payload }): void {
        this.subscribers.get(event.type)?.forEach((callback) => {
            // Dispatch payload to subscribers
            (callback as EventCallback<Payload>)(event.payload);
        });
    }
}

const ModuleBus = new EventBus();
export default ModuleBus;
