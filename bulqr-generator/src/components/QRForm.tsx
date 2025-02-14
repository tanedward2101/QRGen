import { useMemo, useState, useEffect } from 'react';
import {
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Flex,
} from '@chakra-ui/react';
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';
import { CSVLink } from 'react-csv';
import QRInput from './QRInput';
import { ZippedUrlAndQR } from '../types';
import { MAX_CODES } from '../config';
import { useSettings } from '../context/Settings.context';
import pluralize from '../utils/pluralize';
import md5 from 'md5';
const createQRWorker = createWorkerFactory(() => import('../utils/qr.worker'));

type QRFormProps = {
  onSubmit: (zippedValues: ZippedUrlAndQR) => void;
};

export default function QRForm({ onSubmit }: QRFormProps) {
  const qrWokrer = useWorker(createQRWorker);
  const [input, setInput] = useState('');
  const [aftersubmit, setAfterSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { settings } = useSettings();
  const [amount, setAmount] = useState(0);
  const [huruf, setHuruf] = useState('');
  const [dari, setDari] = useState(0);
  const [sampai, setSampai] = useState(0);
  const [tipe, setTipe] = useState('');
  const [rndResult, setRandom] = useState([]);
  const [rand, setRand] = useState('');
  const [existingno, setExisting] = useState([]);
  const [arraygen, setArrayGen] = useState<string[]>([]);
  const [warraygen, setwArrayGen] = useState<string[]>([]);
  useEffect(() => {
    var ex: any = [];
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    };
    // fetch('https://backapi.ktc-racing.com:8088/qrdb', requestOptions)
    //   .then(response => response.json())
    //   .then(data => {
    //     for (let o = 0; o < data.length; o++) {
    //       //   console.log(data[o].code)
    //       ex.push(data[o].code);
    //     }
    //     setExisting(ex);
    //   });
  }, []);

  useEffect(() => {
    var ex: any = [];
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    };
    // fetch('https://backapi.ktc-racing.com:8088/qrdb', requestOptions)
    //   .then(response => response.json())
    //   .then(data => {
    //     for (let o = 0; o < data.length; o++) {
    //       //  console.log(data[o].code)
    //       ex.push(data[o].code);
    //     }
    //     setExisting(ex);
    //   });
  }, [arraygen]);
  // const format = (val: any) => `$` + val
  const parse = (val: any) => val.replace(/^\$/, '');
  const makeid = (length: any) => {
    var result = '';
    var characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  const handleChangeHuruf = (event: any) => setHuruf(event.target.value);
  const handleChangeTipe = (event: any) => setTipe(event.target.value);
  const handleChangeAmount = (event: any) => setAmount(event.target.value);
  const pushData = () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify({ title: input, tipe: tipe }),
    };
    fetch('https://backapi.ktc-racing.com:8088/qrdb/', requestOptions)
      .then(response => response.json())
      .then(data => {
        alert(data);
        setIsSubmitting(false);
      });
  };

  const randomNumber = (amount: any, tipe: any) => {
    var nomor: any = [];
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    };
    var tR: any = '';
    var strRandom: any = '';
    var tStrRandom: any = '';
    var arragen = [];
    var webarrgen=[];
    for (var x = 0; x < amount; x++) {
      var qrraw = tipe + '' + x + '' + new Date();
      var gen = md5(qrraw);
   //   console.log(gen);
      arragen.push({ code: gen });
      webarrgen.push({code:"https://verifikasi.ktc-racing.com?code="+gen})
      if (x != amount - 1) {
        tStrRandom += gen + '\n';
        tR += "'" + gen + "',";
      } else {
        tStrRandom += gen;
        tR += "'" + gen + "'";
      }
    }
    setArrayGen(arragen);
    setwArrayGen(webarrgen)
    setInput(tStrRandom);
    setAfterSubmit(false);
  };

  // const randomNumber = (from: number, to: number, amount: any, initial: any) => {
  //   var nomor: any = [];
  //   const requestOptions = {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer ' + localStorage.getItem('token')
  //     }
  //   };

  //   fetch('https://backapi.ktc-racing.com:8088/qrdb', requestOptions)
  //     .then(response => response.json())
  //     .then(data => {
  //       for (let o = 0; o < data.length; o++) {
  //       //  console.log(data[o].code)
  //         nomor.push(data[o].code)
  //       }

  //       var strRandom: any = "";
  //       var tStrRandom: any = "";
  //       var tR: any = "";
  //       var arragen = [];

  //       for (var z = 0; z < amount; z++) {
  //         var random1 = Math.random()
  //         var random2 = random1 * (to - from);
  //         var random3: number = random2 + Math.floor(from);
  //         var RandomNumber = Math.floor(random3);

  //         if (RandomNumber < 100000) {
  //           if (RandomNumber < 10000) {
  //             if (RandomNumber < 1000) {
  //               if (RandomNumber < 100) {
  //                 if (RandomNumber < 10) {
  //                   strRandom = "00000" + RandomNumber
  //                 }
  //                 else {
  //                   strRandom = "0000" + RandomNumber
  //                 }
  //               } else {
  //                 strRandom = "000" + RandomNumber
  //               }
  //             } else {
  //               strRandom = "00" + RandomNumber
  //             }
  //           } else {
  //             strRandom = "0" + RandomNumber
  //           }
  //         } else {
  //           strRandom = "" + RandomNumber
  //         }
  //         var checker = initial + makeid(1) + strRandom

  //         if (nomor.includes(checker)) {
  //       //    console.log("EX", checker)
  //           z--;
  //         }
  //         else {
  //         //  console.log("PUSH:", checker)
  //           arragen.push({ "code": checker })
  //           nomor.push(checker)
  //           if (z != amount - 1) {
  //             tStrRandom += checker + "\n";
  //             tR += "'" + checker + "',"
  //           }
  //           else {
  //             tStrRandom += checker;
  //             tR += "'" + checker + "'"
  //           }
  //         }

  //       }
  //       setArrayGen(arragen);
  //       //  console.log(tR)
  //       setInput(tStrRandom)
  //       setAfterSubmit(false)
  //     });

  // }

  const values = useMemo(() => input.split('\n').filter(Boolean), [input]);

  const numberOfQRCodes = values.length;
  const isInvalid = numberOfQRCodes > MAX_CODES;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;
    setIsSubmitting(true);
    console.log(values)
    var urlcode=[];
    for(var x=0;x<values.length;x++){
      urlcode.push("https://verifikasi.ktc-racing.com?code="+values[x])
    }

    const qrCodeImages = await qrWokrer.generateImages(urlcode, settings);
    const zippedUrlandQR = values.map((url, idx) => [url, qrCodeImages[idx]]);
    onSubmit(zippedUrlandQR);
    pushData();

    var ex: any = [];
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    setAfterSubmit(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      Jumlah:
      <Input placeholder="Jumlah QR" onChange={handleChangeAmount} />
      Tipe Barang:
      <Input placeholder="Tipe Barang" onChange={handleChangeTipe} />
      <br />
      <Flex
        as="header"
        justify="space-between"
        align="center"
        shadow="md"
        p="5"
      >
        <Button
          onClick={() => {
            randomNumber(amount, tipe);
          }}
        >
          {' '}
          Generate
        </Button>
        <CSVLink data={warraygen}>Download CSV</CSVLink>
      </Flex>
      <QRInput value={input} onChange={setInput} isInvalid={isInvalid} />
      <Button
        type="submit"
        disabled={!input || isInvalid || aftersubmit}
        size="lg"
        display="flex"
        mt="5"
        mx="auto"
        w="sm"
        maxW="full"
        isLoading={isSubmitting}
      >
        Generate {numberOfQRCodes} QR {pluralize('code', numberOfQRCodes)}{' '}
        {numberOfQRCodes ? '🚀' : '😢'}
      </Button>
    </form>
  );
}
