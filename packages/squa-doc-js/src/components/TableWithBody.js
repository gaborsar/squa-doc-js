import React, { PureComponent } from "react";

export default class TableWithBody extends PureComponent {
    render() {
        const { children, ...props } = this.props;
        return (
            <table {...props}>
                <tbody>{children}</tbody>
            </table>
        );
    }
}
