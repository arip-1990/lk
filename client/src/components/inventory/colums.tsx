
interface openClose{
    open:string,
    close:string
}

interface stores{
    id: string,
    name: string,
    phone: string,
    schedule: openClose[]|null,
    sort: number,
    status: number,
    created_at: null|any,
    "updated_at": null|any,
    location_id: string,
    "company_id": number
}

export const columns = [
    {
        title: "№",
        width: 10,
        dataIndex: "id",
        align: "center" as const,
        render: (_: any, __: any, index: number) => <p>{index + 1}</p>,
    },
    {
        title: "Наименование назначение и краткая характеристика",
        width: 200,
        align: "center" as const,
        dataIndex: "description",
        render: (text: string) => <p>{text}</p>,
    },
    {
        title: "Адрес аптеки",
        width: 100,
        align: "center" as const,
        dataIndex: "store",
        render: (store: stores|null) => <p>{store?.name || "Офис"}</p>,
    },
    {
        title: "Инвентарный номер",
            width: 80,
        dataIndex: "inventory_number",
        align: "center" as const,
        render: (text: string | undefined) => <p>{text}</p>,
    },
    {
        title: "line 1",
            width: 70,
        dataIndex: "line1",
        align: "center" as const,
        render: (text: string | undefined) => <p>{text}</p>,
    },
    {
        title: "line 2",
            width: 70,
        dataIndex: "line2",
        align: "center" as const,
        render: (text: string | undefined) => <p>{text}</p>,
    },
    {
        title: "barcode",
            width: 90,
        dataIndex: "barcode",
        align: "center" as const,
        render: (barcode: string | undefined) => <p>{barcode}</p>,
    },
    {
        title: "sheet",
            dataIndex: "sheet",
        align: "center" as const,
        width: 30,
        render: (sheet: string | undefined) => <p>{sheet}</p>,
    },
];