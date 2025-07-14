import {
    ActionIcon,
    Card,
    Group,
    TextInput
} from "@mantine/core";
import { MagnifyingGlass } from "@phosphor-icons/react";

interface SearchBarProps {
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
    onSearch: () => void;
}

export const SearchBar = ({ value, placeholder, onChange, onSearch }: SearchBarProps) => {
    return (
        <Card
            shadow="none"
            padding="xs"
            withBorder>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSearch();
                }}>
                <Group>
                    <TextInput
                        variant="unstyled"
                        placeholder={placeholder}
                        width="100%"
                        flex={1}
                        value={value}
                        onChange={(e) => onChange(e.currentTarget.value)} />
                    <ActionIcon size="lg" type="submit">
                        <MagnifyingGlass width="70%" height="70%" />
                    </ActionIcon>
                </Group>
            </form>
        </Card>
    )
}