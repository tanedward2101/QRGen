import { useState, useEffect } from 'react';
import {
    Box, Stack, Input, Radio, RadioGroup
    , Button, Grid, GridItem
} from '@chakra-ui/react';
import { useParams } from "react-router-dom";

import { useNavigate } from 'react-router';
import QRCode from 'qrcode.react';


function Edit(props) {
    let navi = useNavigate();
    let { id } = useParams();
    const [tipe, setTipe] = useState('')
    const [code, setCode] = useState('')
    const [scan, setScanned] = useState(0)
    const [fraud, setFraud] = useState('0')
    const [create_date, setCreate] = useState('');
    const [last_scan, setLastScan] = useState('');
    const [first_scan, setFirstScan] = useState('')
    const downloadQRCode = () => {
        const qrCodeURL = document.getElementById('qrCodeEl')
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        console.log(qrCodeURL)
        let aEl = document.createElement("a");
        aEl.href = qrCodeURL;
        aEl.download = "QR_Code.png";
        document.body.appendChild(aEl);
        aEl.click();
        document.body.removeChild(aEl);
    }
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    };
    const requestOptions2 = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        body: JSON.stringify({ 'id': id, 'code': code, 'tipe': tipe, 'fraud': fraud })
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetch('https://backapi.ktc-racing.com:8088/qrdb/' + id, requestOptions2)
            .then(response => response.json())
            .then(data => {
                console.log(data)
            });
        navi("/dashboard")
    };
    const handleChangeTipe = (event: any) => setTipe(event.target.value)
    const handleChangeCode = (event: any) => setCode("https://verifikasi.ktc-racing.com?code="+event.target.value)
    useEffect(() => {
        fetch('https://backapi.ktc-racing.com:8088/qrdb/' + id, requestOptions)
            .then(response => response.json())
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    console.log(data[i])
                    setTipe(data[i].tipe)
                    setCode("https://verifikasi.ktc-racing.com?code="+data[i].code)
                    setFraud('' + data[i].fraud)
                    setCreate(data[i].created_date)
                    setScanned(data[i].scanned)
                    setLastScan(data[i].last_verify_date)
                    setFirstScan(data[i].first_verify_date)
                }
            });
    }, [])
    return (
        <Box p="12">
            <Button
                onClick={() => navi("../dashboard")}
                size="lg"
                mt="5"
                mx="auto"


            > Back </Button> <br />
            <form onSubmit={handleSubmit}>

                Tipe:<Input placeholder={tipe} value={tipe} onChange={handleChangeTipe} disabled />
                <br /><br />
                Code:<Input placeholder={code} value={code} onChange={handleChangeCode} disabled />
                <br /><br />
                Fraud: <RadioGroup onChange={setFraud} value={fraud}  >
                    <Stack direction='row'>
                        <Radio value='0'>No</Radio>
                        <Radio value='1'>Yes</Radio>

                    </Stack>

                </RadioGroup>

                <Button
                    type="submit"
                    size="lg"
                    mt="5"
                    mx="auto"


                > Update </Button></form>
            <br /><br></br>
            <Grid templateColumns='repeat(5, 1fr)' gap={6}>
                <GridItem w='100%' colSpan={2} h='10'>
                    <QRCode id="qrCodeEl" value={code} size={250} style={{ border: '6px solid #fff' }} />
                    <br></br>
                    <Button onClick={downloadQRCode}> Download QR</Button><br></br><br></br>
                </GridItem>
                <GridItem colSpan={2} w='100%' h='10'>
                    <Box p="12" style={{ border: '6px solid #fff' }}>
                        <b>INFORMATION</b>
                        <br></br>
                        <br></br>
                        Created Date: {create_date.split("T")[0]}
                        <br />
                        Created Time: {create_date.replace('Z', '').replace('.000', '').split("T")[1]}
                        <br />
                        Verified : {scan == 0 ? "No" : "Yes"}
                        <br />
                        First Scan : {first_scan != null ? first_scan.replace('Z', '').replace('.000', '').replace("T", ' ') : ''}
                        <br />
                        Last Scan : {last_scan != null ? last_scan.replace('Z', '').replace('.000', '').replace("T", ' ') : ''}
                        <br />
                    </Box>
                </GridItem>

            </Grid>
        </Box>
    );
}


export default Edit;
