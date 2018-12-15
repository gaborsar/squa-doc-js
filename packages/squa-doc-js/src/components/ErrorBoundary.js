import React, { PureComponent } from "react";

export default class ErrorBoundary extends PureComponent {
    state = { hasError: false };

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
        console.error(error, info);
    }

    render() {
        return this.state.hasError ? (
            <h1 className="SquaDocJs-error">Something went wrong!</h1>
        ) : (
            this.props.children
        );
    }
}
