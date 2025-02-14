import { useState,  } from 'react';
import {
    Box, Container, Divider, useColorModeValue, 
    
} from '@chakra-ui/react';


import QRForm from './QRForm';
import QRList from './QRList';
import { ZippedUrlAndQR } from '../types';
import SettingsProvider from '../context/Settings.context';
import DownloadBulk from './DownloadBulk';

function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update state to force render
    // An function that increment 👆🏻 the previous state like here 
    // is better than directly setting `value + 1`
}
function Main() {
    const bg = useColorModeValue('gray.50', 'gray.900');
    const [zippedCodes, setZippedCodes] = useState<ZippedUrlAndQR>([]);


    return (
        <SettingsProvider>
            <Box minH="full" bg={bg}>
              
                <Container maxW="container.xl" pt="10">
                    <QRForm onSubmit={setZippedCodes} />
                    <Divider my="10" />
                    {zippedCodes.length > 1 && (
                        <DownloadBulk zippedCodes={zippedCodes} display="flex" ml="auto" />
                    )}
                    {!!zippedCodes.length && (
                        <QRList
                            key={zippedCodes.length}
                            zippedCodes={zippedCodes}
                            py="10"
                        />
                    )}
                </Container>
            </Box>
        </SettingsProvider>
    );
}


export default Main;
