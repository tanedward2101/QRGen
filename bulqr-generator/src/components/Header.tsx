import { Flex, IconButton, useColorMode, Button, Grid, GridItem } from '@chakra-ui/react';

import { MoonIcon, QRIcon, SunIcon } from './Icons';
import QRSettings from './QRSettings';
import { Link } from 'react-router-dom';
export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();

  const isDarkMode = colorMode === 'dark';

  return (
    <Flex as="header" justify="space-between" align="center" shadow="md" p="5">
      {/* <QRSettings /> */}
      <Button onClick={() => { localStorage.setItem('token', ''); window.location.reload(false)}}> LOGOUT</Button>
      {/* <Heading fontSize={['xl', '2xl', '4xl']}>
      QR Code Generator 
      {/* <QRIcon ml="2" fontSize="larger" /> 
      </Heading> */}
      <Grid templateColumns='repeat(5, 1fr)' gap={6}>
        <GridItem w='100%'><Link to="/"><b>Home</b></Link></GridItem>
        <GridItem w='100%'><Link to="/dashboard"><b>Dashboard</b></Link></GridItem>
      </Grid>




      <IconButton
        aria-label="Toggle theme"
        icon={isDarkMode ? <SunIcon /> : <MoonIcon />}
        onClick={toggleColorMode}
      />
    </Flex>
  );
}
