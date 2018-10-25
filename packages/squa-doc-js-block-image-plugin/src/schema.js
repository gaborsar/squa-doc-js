const marks = ["alt", "caption"];

const schema = {
    isBlockEmbed(name) {
        return name === "block-image";
    },

    isBlockEmbedMark(embedName, markName) {
        return embedName === "block-image" && marks.indexOf(markName) !== -1;
    }
};

export default schema;
