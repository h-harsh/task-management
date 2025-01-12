import { TABLE_HEADERS } from "../../constants/table";
import { Table as MantineTable, Skeleton } from "@mantine/core";

const RowSkeleton = () => (
    <MantineTable.Tr>
        {TABLE_HEADERS.map((_, index) => (
            <MantineTable.Td key={index}>
                <Skeleton height={20} radius="sm" />
            </MantineTable.Td>
        ))}
    </MantineTable.Tr>
);

export default RowSkeleton;