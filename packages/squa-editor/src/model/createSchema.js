function isEmbed(rule, embedType) {
  return !!rule.embeds && rule.embeds.indexOf(embedType) !== -1;
}

function isMark(rule, markType) {
  return !!rule.marks && rule.marks.indexOf(markType) !== -1;
}

function isBlockEmbed(rules, embedType) {
  return !!rules.block && isEmbed(rules.block, embedType);
}

function isInlineEmbed(rules, embedType) {
  return !!rules.inline && isEmbed(rules.inline, embedType);
}

function isBlockMark(rules, markType) {
  return !!rules.block && isMark(rules.block, markType);
}

function isInlineMark(rules, markType) {
  return !!rules.inline && isMark(rules.inline, markType);
}

function isBlockEmbedMark(rules, embedType, markType) {
  return isBlockEmbed(rules, embedType) && isBlockMark(rules, markType);
}

function isInlineEmbedMark(rules, embedType, markType) {
  return isInlineEmbed(rules, embedType) && isInlineMark(rules, markType);
}

function isCustomEmbedMark(rules, embedType, markType) {
  return !!rules[embedType] && isMark(rules[embedType], markType);
}

function isEmbedMark(rules, embedType, markType) {
  return (
    isBlockEmbedMark(rules, embedType, markType) ||
    isInlineEmbedMark(rules, embedType, markType) ||
    isCustomEmbedMark(rules, embedType, markType)
  );
}

export default function createSchema(rules) {
  return {
    isBlockEmbed(embedType) {
      return isBlockEmbed(rules, embedType);
    },

    isInlineEmbed(embedType) {
      return isInlineEmbed(rules, embedType);
    },

    isBlockMark(markType) {
      return isBlockMark(rules, markType);
    },

    isInlineMark(markType) {
      return isInlineMark(rules, markType);
    },

    isEmbedMark(embedType, markType) {
      return isEmbedMark(rules, embedType, markType);
    }
  };
}
