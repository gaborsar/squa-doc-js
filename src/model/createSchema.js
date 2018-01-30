function isEmbed(rule, embedType) {
  const { embeds = [] } = rule;
  return embeds.indexOf(embedType) !== -1;
}

function isMark(rule, markType) {
  const { marks = [] } = rule;
  return marks.indexOf(markType) !== -1;
}

export default function createSchema(rules) {
  return {
    isBlockEmbed(embedType) {
      const { block: rule = {} } = rules;
      return isEmbed(rule, embedType);
    },

    isInlineEmbed(embedType) {
      const { inline: rule = {} } = rules;
      return isEmbed(rule, embedType);
    },

    isBlockMark(markType) {
      const { block: rule = {} } = rules;
      return isMark(rule, markType);
    },

    isInlineMark(markType) {
      const { inline: rule = {} } = rules;
      return isMark(rule, markType);
    },

    isEmbedMark(embedType, markType) {
      const { [embedType]: rule = {} } = rules;
      return isMark(rule, markType);
    }
  };
}
