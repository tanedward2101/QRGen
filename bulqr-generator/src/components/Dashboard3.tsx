import { useState, useEffect } from 'react';
import {
    Box, useColorModeValue,
    Button,
    Icon,
    Input,
    Heading,
    Stack, Grid, GridItem,
    Select, Checkbox, CheckboxGroup, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton, useDisclosure
} from '@chakra-ui/react';
import { FiTrash2, FiEdit2, FiUser, FiCheckCircle, FiX } from "react-icons/fi";
import { Table } from "react-chakra-pagination";
import { ZippedUrlAndQR } from '../types';


import { useNavigate } from 'react-router';

type QR = {
    id: number;
    tipe: string;
    created_date: Date;
    code: string;
    scanned: string;
    fraud: string;
};

function formatDate2(date: Date) {
    var monat = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

    var month = monat[date.getMonth()];
    var day = '' + date.getDate();
    var year = date.getFullYear();

    if (day.length < 2)
        day = '0' + day;
    //console.log([year, month, day].join('-'));
    return [day, month, year].join('-');
}

function Dashboard() {
    const history = useNavigate();
    const bg = useColorModeValue('gray.50', 'gray.900');
    const [zippedCodes, setZippedCodes] = useState<ZippedUrlAndQR>([]);
    const [existing, setExisting] = useState<QR[]>([]);
    const [filterValue, setFilterValue] = useState('');
    const [filter, setFilter] = useState({})
    const [page, setPage] = useState<number>(1);
    const [alert, setAlert] = useState("");
    const [selected, setSelected] = useState<number[]>([]);
    const [cdSelected, setSelectCode] = useState<string[]>([])
    const [checkedItems, setCheckedItems] = useState([true, true])
    const [codeStr, setCodeStr] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [chosenId, setChosen] = useState(0);
    const [method, setMethod] = useState(0);
    const [verified, setVerified] = useState(0);
    const [total, setTotal] = useState(0);
    useEffect(() => { console.log(selected) }, [selected])
    useEffect(() => {
        var code = "";
        for (var i = 0; i < cdSelected.length; i++) {

            if (i == cdSelected.length - 1) {
                code += cdSelected[i]
            }
            else {
                code += cdSelected[i] + ","
            }
        }
        setCodeStr(code)

    }, [cdSelected])


    const tableData = existing.map((existing) => ({
        button: (
            <Checkbox onChange={(e) => {
                if (e.target.checked) {
                    setSelected([...selected, existing.id])
                    setSelectCode([...cdSelected, existing.code])
                }
                else {
                    var y = selected.filter(data => data != existing.id)
                    setSelected(y);
                    var x = cdSelected.filter(data => data != existing.code)
                    setSelectCode(x);

                }
            }} isChecked={selected.includes(existing.id)} />),
        id: existing.id,
        tipe: existing.tipe,
        code: existing.code,
        Created: formatDate2(new Date(existing.created_date)),
        fraud: existing.fraud == '1' ? 'FRAUD' : 'NO',
        verified: existing.scanned == '0' ? <Icon as={FiX} fontSize="20" /> : <Icon as={FiCheckCircle} fontSize="20" />,
        action: (
            <div>
                <Button
                    colorScheme="gray"
                    onClick={() => { setChosen(existing.id); setMethod(0); onOpen(); }}
                    size="sm"
                >
                    <Icon as={FiTrash2} fontSize="20" />
                </Button>
                <Button
                    colorScheme="gray"
                    onClick={() => EditData(existing.id)}
                    size="sm"
                >
                    <Icon as={FiEdit2} fontSize="20" />
                </Button>
            </div>
        )
    }));
    useEffect(() => {
        var ex: any = [];
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        };
        //var url = 'https://backapi.ktc-racing.com:8088/qrdb'
        var url = 'https://backapi.ktc-racing.com:8088/qrdb'
        var verif = 0

        // fetch(url, requestOptions)
        //     .then(response => response.json())
        //     .then(data => {
        //         for (let o = 0; o < data.length; o++) {
        //             ex.push(data[o])
        //             if (data[o].scanned != 0) {
        //                 verif++;
        //             }
        //         }
        //         setVerified(verif);
        //         setTotal(data.length);
        //         setExisting(ex);
        //         setPage(1)
        //     });
    }, [])

    useEffect(() => {
        var ex: any = [];
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        };
        //var url = 'https://backapi.ktc-racing.com:8088/qrdb'
        var url = 'https://backapi.ktc-racing.com:8088/qrcount'
        var verif = 0

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {

                //console.log("TOTAL",data[0].id)
             setTotal(data[0].id)
             //console.log("TOTAL",total)
            });
    }, [])


    useEffect(() => {
        var ex: any =[];

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        };
        //var url = 'https://backapi.ktc-racing.com:8088/qrdb'
        var url = 'https://backapi.ktc-racing.com:8088/qrdb'
        if (filter == 'Code') {
            url += '?code[$like]='
        }
        else if (filter == 'Tipe') {
            url += '?tipe[$like]='
        }

        if (filterValue != '' || filter != '') {
            url += filterValue
        }

        if (filterValue == '' && filter == '') {
            if (checkedItems[0] == true && checkedItems[1] == false) {
                url += '?fraud=0'
            } else if (checkedItems[0] == false && checkedItems[1] == true) {
                url += '?fraud=1'
            }
            else if (checkedItems[0] == true && checkedItems[1] == true) {

            }
            else if (checkedItems[0] == false && checkedItems[1] == false) {
                url += '?fraud=2'
            }
        } else {
            if (checkedItems[0] == true && checkedItems[1] == false) {
                url += '&fraud=0'
            } else if (checkedItems[0] == false && checkedItems[1] == true) {
                url += '&fraud=1'
            }
            else if (checkedItems[0] == true && checkedItems[1] == true) {

            }
            else if (checkedItems[0] == false && checkedItems[1] == false) {
                url += '&fraud=2'
            }
        }
        url+='?limit=100000';

        var offset= page*10;
        url+='&offset='+offset
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.code == 401) {
                    //console.log(data.code);
                    localStorage.setItem('token', '')
                }
                console.log(data)
                setExisting(data);
             //   setPage(1)
            });
    }, [filterValue, checkedItems, filter, alert,page])

    function EditData(id: number) {
        history("edit/" + id)
    }

    function Delete(id: number) {
        setAlert("")
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        };
        //fetch('https://backapi.ktc-racing.com:8088/qrdb/' + id, requestOptions)
        fetch('https://backapi.ktc-racing.com:8088/qrdb/' + id, requestOptions)
            .then(response => response.json())
            .then(data => {
                setAlert("Data Deleted")
            });
    }

    function DeleteBatch() {
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            body: JSON.stringify({ 'id': selected })
        };
        //fetch('https://backapi.ktc-racing.com:8088/qrdb', requestOptions)
        fetch('https://backapi.ktc-racing.com:8088/qrdb', requestOptions)
            .then(response => response.json())
            .then(data => {

                setAlert("Data Deleted")
            });
        setCodeStr("");
    }

    const handleFilter = (event: any) => setFilterValue(event.target.value)
    const handlePage = (event: any) => { setPage(parseInt(event.target.value)) }
    const tableColumns = [
        {
            Header: "Select",
            accessor: "button" as const
        },
        {
            Header: "No",
            accessor: "id" as const
        },
        {
            Header: "Tipe",
            accessor: "tipe" as const
        },
        {
            Header: "Code",
            accessor: "code" as const
        },
        {
            Header: "Created Date",
            accessor: "Created" as const
        }, {
            Header: "Fraud",
            accessor: "fraud" as const
        }, {
            Header: "Verified",
            accessor: "verified" as const
        }, {
            Header: "Action",
            accessor: "action" as const
        }
    ];

    return (
        <Box p="12">
            <Heading size="sm" as="h3">
                List of Code
            </Heading>
            <br />
            <Grid
                templateColumns='repeat(5, 1fr)'
                gap={4}
            >
                <GridItem colSpan={3} >
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: 200 }}><Select placeholder='Select option' onChange={(e) => {
                            setFilter(e.target.value)
                        }}>
                            <option value='Tipe'>Tipe</option>
                            <option value='Code'>Code</option>

                        </Select>
                        </div> <Input placeholder={"Value"} onChange={handleFilter} style={{ width: 400 }} value={filterValue} /></div>
                </GridItem>
                <GridItem colSpan={2} >
                    <Stack spacing={5} direction='row'>
                        <Checkbox onChange={(e) => setCheckedItems([e.target.checked, checkedItems[1]])} isChecked={checkedItems[0]}>
                            No Fraud
                        </Checkbox>
                        <Checkbox onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked,])} isChecked={checkedItems[1]}>
                            Fraud
                        </Checkbox>
                    </Stack>
                </GridItem>
                <GridItem colSpan={2} >

                    Verified: {verified} of {total}

                </GridItem>
            </Grid>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete Data</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Do You Want to Delete The Data
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            No
                        </Button>
                        <Button variant='ghost' onClick={() => {
                            if (method == 1) {
                                DeleteBatch(); onClose();
                            } else if (method == 0) {
                                Delete(chosenId); onClose();
                            }

                        }}>Yes</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Box mt="6">
                <Button onClick={() => { setMethod(1); onOpen(); }}> Delete Selected</Button>
                <Table
                    colorScheme="blue"
                    emptyData={{
                        icon: FiUser,
                        text: "No Data is registered"
                    }}
                    totalRegisters={total}
                    page={page}
                    onPageChange={(page) => {setPage(page) }}
                    columns={tableColumns}
                    data={tableData}
                />
            </Box>
            <div> Selected: {codeStr}</div>
            <div> Page: <Input type="number" placeholder={"Page"} onChange={(handlePage)} style={{ width: 200 }} value={page} /></div>
        </Box >
    );
}


export default Dashboard;
