import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { AnyRecord } from 'dns';
import React, { EventHandler, ReactNode, useState } from 'react'
import { useToast } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google';




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
    const [authLoading,setAuthLoading ] = useState(false);
    const toast = useToast();
    const history = useHistory();

    const connectWithBackend = async(code: string) => {

      try {
        // console.log(code)
        setAuthLoading(true);
        const res = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/api/user/google/oauth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code
          }),
        })

        const data = await res.json();

        if(!res.ok){
          setAuthLoading(false)
          return toast({
            title: `${data.mssg}`,
            description: 'Something went wrong',
            status: 'error',
            duration: 9000,
            isClosable: true,
          })

        }

        localStorage.setItem('userInfo', JSON.stringify(data));

        toast({
          title:'Login succesful',
          status:'success',
          duration:5000,
          isClosable:true,
          position:'bottom'

        });
        setAuthLoading(false)
        history.push('/chats')

        

      } catch (error) {
        if(error instanceof Error) {
          setAuthLoading(false)
          return toast({
            title: error.message,
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
        }
        
      }
    }

    const googleLogin = useGoogleLogin({

      onSuccess: codeResponse => { 
        console.log(codeResponse)
      
        connectWithBackend(codeResponse.code)
      },
      onError: codeResponse => console.log(codeResponse),
      flow: 'auth-code',
      include_granted_scopes:true
    });


    // const handleInputChange = (e: any) => {
    //     const { name, value } = e.target;
    //     setUserData({ ...userData, [name]: value });
    //   };

      const handleClick = () => {
            setShow(!show)
      }

      const handleLoginWIthGoogle = () => {
      }
    
        const handleSubmit = async() => {
            try {
              // localStorage.removeItem('userInfo')

          
              // console.log( username, password)
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
              const res = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/api/user/signin`, {
                headers:{
                  "Content-type": "application/json"
                },
                method:'POST',
                body:JSON.stringify({username, password})
              });
    
              if(!res.ok){
                setLoading(false)
    
                const data = await res.json()
                // console.log(data)
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
        isLoading={loading}
        >
            Login
        </Button>
        <Button
        colorScheme='green'
        w='100%'
        marginTop={15}
        onClick={() => googleLogin()}
        isLoading={authLoading}
        >
            {/* <a onClick={handleLoginWIthGoogle} > */}
            Login with Google

        </Button>
        <Button
        colorScheme='red'
        w='100%'
        marginTop={15}
        onClick={() => {
            setUsername('Fohlarbee')
            setPassword('Sammyola246@1')
        }}
        >
          Guest
        </Button>
    </VStack>
  )
}
