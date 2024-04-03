import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { AnyRecord } from 'dns';
import React, { EventHandler, ReactNode, useState } from 'react'
import getGoogleUrls from '../../utils/getGoogleUrls';
import { useToast } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';


export default function Login() {
    const [userData, setUserData] = useState({
        username:'',
        password:'',
    });
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const[avatar, setAvatar] = useState(null)
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();


    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
      };

      const handleClick = () => {
            setShow(!show)
      }
    
        const handleSubmit = async() => {
            try {
          
              console.log( username, password)
              setLoading(true)
              if(!username || !password){
                toast({
                  title:'PLease fill all fields',
                  status:'warning',
                  duration:5000,
                  isClosable:true,
                  position:'bottom'            
                })
              }
              const res = await fetch('http://localhost:8000/api/user/signin', {
                headers:{
                  "Content-type": "application/json"
                },
                method:'POST',
                body:JSON.stringify({username, password})
              });
    
              if(!res.ok){
                setLoading(false)
    
                const data = await res.json()
                console.log(data)
                return toast({
                  title:data.mssg,
                  status:'error',
                  duration:5000,
                  isClosable:true,
                  position:'bottom'
        
                })
              }
    
              const data = await res.json();
              localStorage.setItem('userInfo', JSON.stringify(data));
    
              toast({
                title:'Login succesful',
                status:'success',
                duration:5000,
                isClosable:true,
                position:'bottom'
      
              });
              setLoading(false)
              history.push('/chats')
      
      
              
            } catch (error) {
              if(error instanceof Error){
                setLoading(false)
    
                return   toast({
                  title:error.message,
                  status:'error',
                  duration:5000,
                  isClosable:true,
                  position:'bottom'
        
                });
              }

      }
    }


  return (
    <VStack color='#fff' spacing='5px'>
        <FormControl isRequired id='username'>
            <FormLabel color='#000'>Username</FormLabel>
            <Input
              color='#000'

            placeholder='enter your username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
        </FormControl>
        <FormControl isRequired id='password'>
            <FormLabel color='#000'>Password</FormLabel>
            <InputGroup>
                <Input
                color='#000'
                type={show? 'text': 'password'}
                placeholder='enter your password'
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                />
                <InputRightElement
                w='4.5rem'
            
                >
                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                        {show ?'Hide' : 'Show'}
                    </Button>

                </InputRightElement>
            </InputGroup>
            
        </FormControl>

        
        <Button
        colorScheme='blue'
        w='100%'
        marginTop={15}
        onClick={handleSubmit}
        >
            Login
        </Button>
        <Button
        colorScheme='green'
        w='100%'
        marginTop={15}
        // onClick={handleSubmit}
        >
            <a href={getGoogleUrls()}>
            Login with Google

            </a>
        </Button>
        <Button
        colorScheme='red'
        w='100%'
        marginTop={15}
        onClick={() => {
            setUsername('Fohlarbee')
            setPassword('Sammyola@1')
        }}
        >
          Guest
        </Button>
    </VStack>
  )
}
