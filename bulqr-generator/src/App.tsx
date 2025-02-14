import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Divider,
  useColorModeValue,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
} from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import QRForm from './components/QRForm';
import QRList from './components/QRList';
import { ZippedUrlAndQR } from './types';
import SettingsProvider from './context/Settings.context';
import DownloadBulk from './components/DownloadBulk';
import Login from './components/Login';
import Main from './components/Main';
import Dashboard from './components/Dashboard';
import Edit from './components/Edit';

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update state to force render
  // An function that increment 👆🏻 the previous state like here
  // is better than directly setting `value + 1`
}
function App() {
  const bg = useColorModeValue('gray.50', 'gray.900');
  const [zippedCodes, setZippedCodes] = useState<ZippedUrlAndQR>([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const forceUpdate = useForceUpdate();
  console.log('token', localStorage.getItem('token'));

  useEffect(() => {
    forceUpdate();
  }, [token]);
  if (
    token == '' ||
    token == null ||
    token == undefined ||
    token == 'undefined'
  ) {
    //   localStorage.setItem('token', '')
    return <Login></Login>;
  } else {
    // localStorage.setItem('token', '')
    return (
      <BrowserRouter>
        <Header />
        <div>
          <Routes>
            <Route exact path="/" element={<Main />} />
            <Route exact path="/dashboard" element={<Dashboard />} />
            <Route exact path="/dashboard/edit/:id" element={<Edit />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
