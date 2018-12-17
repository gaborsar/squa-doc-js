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
        const tableA = schema
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
            .insertRow(1);
        const tableB = schema.createTable({
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
        });
        expect(tableA.delta).toEqual(tableB.delta);
    });

    test("insert column", () => {
        const tableA = schema
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
            .insertColumn(1);
        const tableB = schema.createTable({
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
        });
        expect(tableA.delta).toEqual(tableB.delta);
    });

    test("set row attributes", () => {
        const tableA = schema
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
            .setRowAttributes(1, { "table-row-mark": true });
        const tableB = schema.createTable({
            children: [
                schema.createRow(),
                schema.createRow().setAttributes({ "table-row-mark": true }),
                schema.createRow()
            ]
        });
        expect(tableA.delta).toEqual(tableB.delta);
    });

    test("set column attributes", () => {
        const tableA = schema
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
            .setColumnAttributes(1, { "table-cell-mark": true });
        const tableB = schema.createTable({
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
        });
        expect(tableA.delta).toEqual(tableB.delta);
    });

    test("delete row", () => {
        const tableA = schema
            .createTable({
                children: [
                    schema.createRow(),
                    schema.createRow(),
                    schema.createRow()
                ]
            })
            .deleteRow(1);
        const tableB = schema.createTable({
            children: [schema.createRow(), schema.createRow()]
        });
        expect(tableA.delta).toEqual(tableB.delta);
    });

    test("delete column", () => {
        const tableA = schema
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
            .deleteColumn(1);
        const tableB = schema.createTable({
            children: [
                schema.createRow({
                    children: [schema.createCell(), schema.createCell()]
                }),
                schema.createRow({
                    children: [schema.createCell(), schema.createCell()]
                })
            ]
        });
        expect(tableA.delta).toEqual(tableB.delta);
    });
});
