interface Event {
    name: string;
    on: string;
    once: boolean;
    disabled?: boolean;
    execute(...args: unknown[]): Promise<void>;
}

export default Event;