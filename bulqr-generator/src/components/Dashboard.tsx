import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import {
  Box,
  useColorModeValue,
  Button,
  Icon,
  Input,
  Heading,
  Stack,
  Grid,
  GridItem,
  Select,
  Checkbox,
  CheckboxGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import './pagination.css';
import { FiTrash2, FiEdit2, FiUser, FiCheckCircle, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router';
function formatDate2(date: Date) {
  var monat = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];

  var month = monat[date.getMonth()];
  var day = '' + date.getDate();
  var year = date.getFullYear();

  if (day.length < 2) day = '0' + day;
  //console.log([year, month, day].join('-'));
  return [day, month, year].join('-');
}
function Dashboard() {
  var itemsPerPage = 10;
  const history = useNavigate();
  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);
  const [existing, setExisting] = useState<QR[]>([]);
  const [filterValue, setFilterValue] = useState('');
  const [filter, setFilter] = useState({});

  const [alert, setAlert] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [cdSelected, setSelectCode] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState([true, true]);
  const [codeStr, setCodeStr] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [chosenId, setChosen] = useState(0);
  const [method, setMethod] = useState(0);
  const [verified, setVerified] = useState(0);

  function Items({ currentItems }) {
    return (
      <div class="container">
        <table class="table table-dark">
          <tr>
            <th scope="col"></th>
            <th scope="col">No</th>
            <th scope="col">Tipe</th>
            <th scope="col">Code</th>
            <th scope="col">Created Date</th>
            <th scope="col">Fraud</th>
            <th scope="col">Verified</th>
            <th scope="col">Action</th>
          </tr>
          {currentItems &&
            currentItems.map(item => (
              <tr>
                <th scope="row">
                  <Checkbox
                    colorScheme="green"
                    onChange={e => {
                      if (e.target.checked) {
                        setSelected([...selected, item.id]);
                        setSelectCode([...cdSelected, item.code]);
                      } else {
                        var y = selected.filter(data => data != item.id);
                        setSelected(y);
                        var x = cdSelected.filter(data => data != item.code);
                        setSelectCode(x);
                      }
                    }}
                    isChecked={selected.includes(item.id)}
                  />
                </th>
                <th scope="row">{item.id}</th>
                <td>{item.tipe}</td>
                <td width={400}>{item.code}</td>
                <td> {formatDate2(new Date(item.created_date))}</td>
                <td>{item.fraud}</td>
                <td>{item.scanned}</td>
                <td>
                  <Button
                    colorScheme="gray"
                    onClick={() => {
                      setChosen(item.id);
                      setMethod(0);
                      onOpen();
                    }}
                    size="sm"
                  >
                    <Icon as={FiTrash2} fontSize="20" />
                  </Button>
                  <Button
                    colorScheme="gray"
                    onClick={() => EditData(item.id)}
                    size="sm"
                  >
                    <Icon as={FiEdit2} fontSize="20" />
                  </Button>
                </td>
              </tr>
            ))}
        </table>
      </div>
    );
  }
  useEffect(() => {
    console.log(selected);
  }, [selected]);
  useEffect(() => {
    var code = '';
    for (var i = 0; i < cdSelected.length; i++) {
      if (i == cdSelected.length - 1) {
        code += cdSelected[i];
      } else {
        code += cdSelected[i] + ',';
      }
    }
    setCodeStr(code);
  }, [cdSelected]);
  function EditData(id: number) {
    history('edit/' + id);
  }

  function Delete(id: number) {
    setAlert('');
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    };
   fetch('https://backapi.ktc-racing.com:8088/qrdb/' + id, requestOptions)
   // fetch('https://backapi.ktc-racing.com:8088/qrdb/' + id, requestOptions)
      .then(response => response.json())
      .then(data => {
        setAlert('Data Deleted');
      });
  }

  function DeleteBatch() {
    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify({ id: selected }),
    };
   fetch('https://backapi.ktc-racing.com:8088/qrdb', requestOptions)
    //fetch('https://backapi.ktc-racing.com:8088/qrdb', requestOptions)
      .then(response => response.json())
      .then(data => {
        setAlert('Data Deleted');
      });
    setCodeStr('');
  }

  const handleFilter = (event: any) => setFilterValue(event.target.value);
  const handlePage = (event: any) => {
    setPage(parseInt(event.target.value));
  };
  useEffect(() => {
    var ex: any = [];
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    };
    var url = 'https://backapi.ktc-racing.com:8088/qrdb'
    //var url = 'https://backapi.ktc-racing.com:8088/qrcount';
    var verif = 0;

    fetch(url, requestOptions)
      .then(response => response.json())
      .then(data => {
        //console.log("TOTAL",data[0].id)
        setTotal(data[0].id);
        setPageCount(Math.ceil(data[0].id / itemsPerPage));
      });
  }, []);

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    var ex: any = [];

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    };
    var url = 'https://backapi.ktc-racing.com:8088/qrdb'
    //var url = 'https://backapi.ktc-racing.com:8088/qrdb';
    url += '?limit=10';

    var offset = (page ) * 10;
    url += '&offset=' + offset;
    if (filter == 'Code') {
      url += '&code[$like]=';
    } else if (filter == 'Tipe') {
      url += '&tipe[$like]=';
    }

    if (filterValue != '' || filter != '') {
      url += filterValue;
    }

    if (filterValue == '' && filter == '') {
      if (checkedItems[0] == true && checkedItems[1] == false) {
        url += '&fraud=0';
      } else if (checkedItems[0] == false && checkedItems[1] == true) {
        url += '&fraud=1';
      } else if (checkedItems[0] == true && checkedItems[1] == true) {
      } else if (checkedItems[0] == false && checkedItems[1] == false) {
        url += '&fraud=2';
      }
    } else {
      if (checkedItems[0] == true && checkedItems[1] == false) {
        url += '&fraud=0';
      } else if (checkedItems[0] == false && checkedItems[1] == true) {
        url += '&fraud=1';
      } else if (checkedItems[0] == true && checkedItems[1] == true) {
      } else if (checkedItems[0] == false && checkedItems[1] == false) {
        url += '&fraud=2';
      }
    }

    console.log(url);
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.code == 401) {
          //console.log(data.code);
          localStorage.setItem('token', '');
        }
        for (let o = 0; o < data[0].length; o++) {
          ex.push(data[0][o]);
        }
        setCurrentItems(ex);
       
        setVerified(data[2][0].verified)
        setTotal(data[1][0].total);
        setPageCount(Math.ceil(data[1][0].total / itemsPerPage));
      });

    setPageCount(Math.ceil(total / itemsPerPage));
  }, [page, filterValue, checkedItems, filter, alert]);

  // Invoke when user click to request another page.
  const handlePageClick = event => {
    const newOffset = (event.selected * itemsPerPage) % total;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`,
    );
    setItemOffset(newOffset);
    setPage(event.selected);
  };

  return (
    <>
      <Box>
        <div class="container">
          <Heading size="sm" as="h3">
            List of Code
          </Heading>
          <br />
          <Grid templateColumns="repeat(5, 1fr)" gap={4}>
            <GridItem colSpan={3}>
              <div style={{ display: 'flex' }}>
                <div style={{ width: 200 }}>
                  <Select
                    placeholder="Select option"
                    onChange={e => {
                      setFilter(e.target.value);
                    }}
                  >
                    <option value="Tipe">Tipe</option>
                    <option value="Code">Code</option>
                  </Select>
                </div>{' '}
                <Input
                  placeholder={'Value'}
                  onChange={handleFilter}
                  style={{ width: 400 }}
                  value={filterValue}
                />
              </div>
            </GridItem>
            <GridItem colSpan={2}>
              <Stack spacing={5} direction="row">
                <Checkbox
                  onChange={e =>
                    setCheckedItems([e.target.checked, checkedItems[1]])
                  }
                  isChecked={checkedItems[0]}
                >
                  No Fraud
                </Checkbox>
                <Checkbox
                  onChange={e =>
                    setCheckedItems([checkedItems[0], e.target.checked])
                  }
                  isChecked={checkedItems[1]}
                >
                  Fraud
                </Checkbox>
              </Stack>
            </GridItem>
            <GridItem colSpan={2}>
              Verified: {verified} of {total}
            </GridItem>
          </Grid>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Delete Data</ModalHeader>
              <ModalCloseButton />
              <ModalBody>Do You Want to Delete The Data</ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  No
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (method == 1) {
                      DeleteBatch();
                      onClose();
                    } else if (method == 0) {
                      Delete(chosenId);
                      onClose();
                    }
                  }}
                >
                  Yes
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      </Box>
      <Box mt="6">
        <div class="container">
          <Button
            onClick={() => {
              setMethod(1);
              onOpen();
            }}
          >
            {' '}
            Delete Selected
          </Button>
        </div>
        <Items currentItems={currentItems} />
        <div class="container">
          <ReactPaginate
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            previousLabel="< previous"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
            renderOnZeroPageCount={null}
          />
        </div>
      </Box>
    </>
  );
}

// Add a <div id="container"> to your HTML to see the componend rendered.
export default Dashboard;
