import React from "react";

export default function renderWrappedNodes(nodes, renderWrapper, renderNode) {
    let Wrapper;
    let wrapperKey;
    let wrapperProps;
    let wrapperContent = [];

    const content = [];

    nodes
        .map(renderWrapper)
        .forEach(({ wrapper: { component, props }, node }) => {
            if (Wrapper !== component) {
                if (wrapperContent.length !== 0) {
                    if (Wrapper !== undefined) {
                        content.push(
                            <Wrapper
                                key={wrapperKey}
                                className="SquaDocJs-wrapper"
                                data-wrapper={true}
                                data-key={wrapperKey}
                                {...wrapperProps}
                            >
                                {wrapperContent}
                            </Wrapper>
                        );
                    } else {
                        content.push.apply(content, wrapperContent);
                    }
                }
                Wrapper = component;
                wrapperKey = `wrapper-${node.key}`;
                wrapperProps = props;
                wrapperContent = [renderNode(node)];
            } else {
                wrapperContent.push(renderNode(node));
            }
        });

    if (wrapperContent.length !== 0) {
        if (Wrapper !== undefined) {
            content.push(
                <Wrapper
                    key={wrapperKey}
                    className="SquaDocJs-wrapper"
                    data-wrapper={true}
                    data-key={wrapperKey}
                    {...wrapperProps}
                >
                    {wrapperContent}
                </Wrapper>
            );
        } else {
            content.push.apply(content, wrapperContent);
        }
    }

    return content;
}
