import React, { PureComponent } from "react";
import Editor from "./Editor";

export default class PluginEditor extends PureComponent {
  blockRenderFn = (...attrs) => {
    const { plugins } = this.props;

    for (const { blockRenderFn } of plugins) {
      let blockObj;

      if (blockRenderFn) {
        blockObj = blockRenderFn(...attrs);
      }

      if (blockObj) {
        return blockObj;
      }
    }
  };

  embedRenderFn = (...attrs) => {
    const { plugins } = this.props;

    for (const { embedRenderFn } of plugins) {
      let embedObj;

      if (embedRenderFn) {
        embedObj = embedRenderFn(...attrs);
      }

      if (embedObj) {
        return embedObj;
      }
    }
  };

  blockStyleFn = (...attrs) => {
    const { plugins } = this.props;

    for (const { blockStyleFn } of plugins) {
      let blockStyleObj;

      if (blockStyleFn) {
        blockStyleObj = blocStyleFn(...attrs);
      }

      if (blockStyleObj) {
        return blockStyleObj;
      }
    }
  };

  inlineStyleFn = (...attrs) => {
    const { plugins } = this.props;

    for (const { inlineStyleFn } of plugins) {
      let inlineStyleObj;

      if (inlineStyleFn) {
        inlineStyleObj = inlineStyleFn(...attrs);
      }

      if (inlineStyleObj) {
        return inlineStyleObj;
      }
    }
  };
}
