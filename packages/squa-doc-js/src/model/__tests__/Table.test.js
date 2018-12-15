import Schema from "../Schema";

const schema = new Schema({
    isRowMark(name) {
        return name === "table-row-mark";
    },
    isCellMark(name) {
        return name === "table-cell-mark";
    }
});

describe("Table", () => {
    test("insert row", () => {
        expect(
            schema
                .createTable({
                    children: [
                        schema.createRow({
                            children: [schema.createCell(), schema.createCell()]
                        }),
                        schema.createRow({
                            children: [schema.createCell(), schema.createCell()]
                        })
                    ]
                })
                .insertRow(1)
                .getDelta()
        ).toEqual(
            schema
                .createTable({
                    children: [
                        schema.createRow({
                            children: [schema.createCell(), schema.createCell()]
                        }),
                        schema.createRow({
                            children: [schema.createCell(), schema.createCell()]
                        }),
                        schema.createRow({
                            children: [schema.createCell(), schema.createCell()]
                        })
                    ]
                })
                .getDelta()
        );
    });

    test("insert column", () => {
        expect(
            schema
                .createTable({
                    children: [
                        schema.createRow({
                            children: [schema.createCell(), schema.createCell()]
                        }),
                        schema.createRow({
                            children: [schema.createCell(), schema.createCell()]
                        })
                    ]
                })
                .insertColumn(1)
                .getDelta()
        ).toEqual(
            schema
                .createTable({
                    children: [
                        schema.createRow({
                            children: [
                                schema.createCell(),
                                schema.createCell(),
                                schema.createCell()
                            ]
                        }),
                        schema.createRow({
                            children: [
                                schema.createCell(),
                                schema.createCell(),
                                schema.createCell()
                            ]
                        })
                    ]
                })
                .getDelta()
        );
    });

    test("set row attributes", () => {
        expect(
            schema
                .createTable({
                    children: [
                        schema.createRow({
                            children: [schema.createCell()]
                        }),
                        schema.createRow({
                            children: [schema.createCell()]
                        }),
                        schema.createRow({
                            children: [schema.createCell()]
                        })
                    ]
                })
                .setRowAttributes(1, { "table-row-mark": true })
                .getDelta()
        ).toEqual(
            schema
                .createTable({
                    children: [
                        schema.createRow(),
                        schema
                            .createRow()
                            .setAttributes({ "table-row-mark": true }),
                        schema.createRow()
                    ]
                })
                .getDelta()
        );
    });

    test("set column attributes", () => {
        expect(
            schema
                .createTable({
                    children: [
                        schema.createRow({
                            children: [
                                schema.createCell(),
                                schema.createCell(),
                                schema.createCell()
                            ]
                        }),
                        schema.createRow({
                            children: [
                                schema.createCell(),
                                schema.createCell(),
                                schema.createCell()
                            ]
                        })
                    ]
                })
                .setColumnAttributes(1, { "table-cell-mark": true })
                .getDelta()
        ).toEqual(
            schema
                .createTable({
                    children: [
                        schema.createRow({
                            children: [
                                schema.createCell(),
                                schema
                                    .createCell()
                                    .setAttributes({ "table-cell-mark": true }),
                                schema.createCell()
                            ]
                        }),
                        schema.createRow({
                            children: [
                                schema.createCell(),
                                schema
                                    .createCell()
                                    .setAttributes({ "table-cell-mark": true }),
                                schema.createCell()
                            ]
                        })
                    ]
                })
                .getDelta()
        );
    });

    test("delete row", () => {
        expect(
            schema
                .createTable({
                    children: [
                        schema.createRow(),
                        schema.createRow(),
                        schema.createRow()
                    ]
                })
                .deleteRow(1)
                .getDelta()
        ).toEqual(
            schema
                .createTable({
                    children: [schema.createRow(), schema.createRow()]
                })
                .getDelta()
        );
    });

    test("delete column", () => {
        expect(
            schema
                .createTable({
                    children: [
                        schema.createRow({
                            children: [
                                schema.createCell(),
                                schema.createCell(),
                                schema.createCell()
                            ]
                        }),
                        schema.createRow({
                            children: [
                                schema.createCell(),
                                schema.createCell(),
                                schema.createCell()
                            ]
                        })
                    ]
                })
                .deleteColumn(1)
                .getDelta()
        ).toEqual(
            schema
                .createTable({
                    children: [
                        schema.createRow({
                            children: [schema.createCell(), schema.createCell()]
                        }),
                        schema.createRow({
                            children: [schema.createCell(), schema.createCell()]
                        })
                    ]
                })
                .getDelta()
        );
    });
});
