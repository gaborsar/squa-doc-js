import React from "react";

export default function renderWrappedNodes(nodes, renderWrapper, renderNode) {
    const queue = nodes.map(renderWrapper);

    let Wrapper;
    let wrapperKey;
    let wrapperProps;
    let wrapperContent = [];

    const content = [];

    queue.forEach(job => {
        if (Wrapper !== job.component) {
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
            Wrapper = job.component;
            wrapperProps = job.props;
            wrapperKey = job.node.key;
            wrapperContent = [renderNode(job.node)];
        } else {
            wrapperContent.push(renderNode(job.node));
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
