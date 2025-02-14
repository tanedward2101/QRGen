import { useState } from 'react';
import {
    Input,
    Button
} from '@chakra-ui/react';
import logo from '../assets/logo.png'

import CryptoJS from "crypto-js"

export default function Login() {

    const [input, setInput] = useState('');
    const [aftersubmit, setAfterSubmit] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const handleUser = (event: any) => setUser(event.target.value)
    const handlePassword = (event: any) => setPassword(CryptoJS.AES.encrypt(event.target.value, '4g3nts3cr3t').toString())
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user, password:password, strategy: 'local' })
        };
      //  fetch('https://backapi.ktc-racing.com:8088/authentication', requestOptions)
        fetch('https://backapi.ktc-racing.com:8088/authentication', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data.accessToken)
                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('feathers-jwt', data.accessToken);

            }).then(() => window.location.reload(false));
        // 
    };
    return (
        <div>
            <div style={{ marginTop: 50 }}>
                <center><img src={logo} width={300}></img></center>
            </div>
            <form onSubmit={handleSubmit}>
                <div style={{ marginTop: 50, width:'60%',marginLeft:'20%' }}>
                    Email:<Input placeholder='example@someone.com' onChange={handleUser} />
                    Password:<Input placeholder='Password' type={'password'} onChange={handlePassword} />
                    <Button
                        type="submit"
                        size="lg"
                        display="flex"
                        mt="5"
                        mx="auto"
                        w="sm"
                        maxW="full"
                        isLoading={isSubmitting}>
                        Login
                    </Button>
                </div>
            </form>
        </div >
    );
}
