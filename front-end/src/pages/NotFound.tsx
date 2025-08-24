import {
    Box,
    Flex,
    Text
} from "@mantine/core";

export const NotFound = () => {
    return (
        <Box id="not-found">
            <Flex
                justify="center"
                align="center"
                direction="column"
                h="100%">
                <Text
                    fz="h1"
                    c="blue"
                    fw="bold">
                    404
                </Text>
                <Text
                    size="xl"
                    fw="bold">
                    Page Not Found
                </Text>
            </Flex>
        </Box>
    )
}