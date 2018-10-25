const SpecialCharacter = {
    TableStart: "\u0010",
    TableEnd: "\u0011",
    RowStart: "\u0012",
    CellStart: "\u001C",
    BlockEnd: "\n",
    SplitExpression: /(\u0010|\u0012|\u001C|\u0011|\n)/
};

export default SpecialCharacter;
