import { useState, useEffect, useRef } from 'react';
import { Group, TextInput, Select, ActionIcon } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useHotkeys } from '@mantine/hooks';
import { TABLE_HEADERS } from '../../constants/table';
import { useUiStore } from '../../store';

const SearchBar = () => {
    const { searchFilter, setSearchFilter, clearSearch } = useUiStore();
    const [searchColumn, setSearchColumn] = useState<string | null>(searchFilter.column);
    const [searchValue, setSearchValue] = useState(searchFilter.value);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Register hotkeys
    useHotkeys([
        ['/', (event) => {
            // Prevent "/" character from being typed when focusing
            event.preventDefault();
            searchInputRef.current?.focus();
        }],
    ]);

    // To keep local state in sync with store
    useEffect(() => {
        setSearchColumn(searchFilter.column);
        setSearchValue(searchFilter.value);
    }, [searchFilter]);

    const handleSearch = (value: string) => {
        setSearchValue(value);
        setSearchFilter({
            column: searchColumn || 'name',
            value
        });
    };

    const handleColumnChange = (column: string | null) => {
        setSearchColumn(column);
        setSearchFilter({
            column: column || 'name',
            value: searchValue
        });
    };

    const handleClearSearch = () => {
        setSearchValue('');
        setSearchColumn('name');
        clearSearch();
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
                ref={searchInputRef}
                size="sm"
                placeholder="Search... (Press '/' to focus)"
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                leftSection={<IconSearch size={16} />}
                rightSection={
                    searchValue && (
                        <ActionIcon size="sm" variant="subtle" onClick={handleClearSearch}>
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