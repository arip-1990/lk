import React, {FC} from 'react';
import {useFetchInventoriesQuery} from "../../services/InventoryService";
import {Card} from "antd";

interface InventProps {
    id:string
}

const Cash: FC<InventProps> = ({id}) => {




    return (
        <Card>
            cash
        </Card>
    );
};

export default Cash;

