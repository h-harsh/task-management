import { TABLE_HEADERS } from "../../constants/table";
import { Table as MantineTable } from "@mantine/core";
import { ITask } from "../../types";

const Table = ({ tasks }: { tasks: ITask[] }) => {
    console.log(tasks);
    return (
        <div>
            <MantineTable>
                <MantineTable.Thead>
                    <MantineTable.Tr>
                        {TABLE_HEADERS.map((header) => <MantineTable.Th key={header}>{header}</MantineTable.Th>)}
                    </MantineTable.Tr>
                </MantineTable.Thead>
                <MantineTable.Tbody>
                    {tasks.map((task) => <MantineTable.Tr key={task.id}>
                        {TABLE_HEADERS.map((header) => <MantineTable.Td key={header}>{task[header as keyof ITask]}</MantineTable.Td>)}
                    </MantineTable.Tr>)}
                </MantineTable.Tbody>
            </MantineTable>
        </div>
    )
}

export default Table;