const MAX_DELAY = 1000;

export default class Snapshot {
    constructor({
        type,
        undoDelta,
        redoDelta,
        selection,
        timestamp = Date.now()
    }) {
        this.type = type;
        this.undoDelta = undoDelta;
        this.redoDelta = redoDelta;
        this.selection = selection;
        this.timestamp = timestamp;
    }

    merge(props) {
        return new Snapshot({ ...this, ...props });
    }

    get hasType() {
        return !!this.type;
    }

    setType(type) {
        return this.merge({ type });
    }

    setUndoDelta(undoDelta) {
        return this.merge({ undoDelta });
    }

    setRedoDelta(redoDelta) {
        return this.merge({ redoDelta });
    }

    setSelection(selection) {
        return this.merge({ selection });
    }

    setTimestamp(timestamp) {
        return this.merge({ timestamp });
    }

    canCompose(other) {
        return (
            this.type === other.type &&
            other.timestamp - this.timestamp < MAX_DELAY
        );
    }

    compose(other) {
        return this.merge({
            undoDelta: other.undoDelta.compose(this.undoDelta),
            redoDelta: this.redoDelta.compose(other.redoDelta),
            timestamp: other.timestamp
        });
    }
}
