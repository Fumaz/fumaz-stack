import {Card, Center, Image, Stack, useMantineTheme} from "@mantine/core";
import {Outlet} from "@remix-run/react";

export default function Route() {
    const {primaryColor} = useMantineTheme();

    return (
        <Stack h={'100%'} w={'100%'} bg={primaryColor} justify={'center'} align={'center'} p={'md'}>
            <Card w={'100%'} maw={450} bg={'white'} p={'lg'} withBorder>
                <Stack gap={'xl'}>
                    <Outlet/>
                </Stack>
            </Card>
        </Stack>
    );
}
