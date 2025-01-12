import { useState } from 'react';
import { Group, TextInput, Select, ActionIcon } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { TABLE_HEADERS } from '../../constants/table';

interface SearchBarProps {
    onSearch: (column: string, value: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [searchColumn, setSearchColumn] = useState<string | null>('name');
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (value: string) => {
        setSearchValue(value);
        onSearch(searchColumn || 'name', value);
    };

    const handleColumnChange = (column: string | null) => {
        setSearchColumn(column);
        if (searchValue) {
            onSearch(column || 'name', searchValue);
        }
    };

    const clearSearch = () => {
        setSearchValue('');
        onSearch(searchColumn || 'name', '');
    };

    return (
        <Group gap="xs">
            <Select
                size="sm"
                placeholder="Select column"
                data={TABLE_HEADERS.map(header => ({
                    value: header.toLowerCase(),
                    label: header.charAt(0).toUpperCase() + header.slice(1)
                }))}
                value={searchColumn}
                onChange={handleColumnChange}
                style={{ width: 150 }}
            />
            <TextInput
                size="sm"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                leftSection={<IconSearch size={16} />}
                rightSection={
                    searchValue && (
                        <ActionIcon size="sm" variant="subtle" onClick={clearSearch}>
                            <IconX size={16} />
                        </ActionIcon>
                    )
                }
                style={{ width: 300 }}
            />
        </Group>
    );
};

export default SearchBar;