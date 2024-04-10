import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
// import cloudinary from '../../service/cloudinaryConfig';
import { useToast } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';



export default function Login() {


    const [userData, setUserData] = useState({
        username:'',
        email:'',
        password:'',
    });

    const [username, setUsername] = useState('');
    const [email ,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const[avatar, setAvatar] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();

    const [show, setShow] = useState(false);


    const connectWithBackend = async(code: any) => {

      try {
        setLoading(true);
        const res = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/api/user/google/oauth`, {
          method: 'Post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code
          }),
        })

        const data = await res.json();

        if(!res.ok){
          setLoading(false)
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
        setLoading(false)
        history.push('/chats')

        

      } catch (error) {
        if(error instanceof Error) {
          setLoading(false)
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
      
        connectWithBackend(codeResponse.code)
      },
      onError: codeResponse => console.log(codeResponse),
      flow: 'auth-code',
      include_granted_scopes:true
    });

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
      };

      const handleClick = () => {
            setShow(!show)
      }
      const handleSubmit = async() => {
        try {
          if(!avatar){
            toast({
              title:'PLease select an image',
              status:'warning',
              duration:5000,
              isClosable:true,
              position:'bottom'            
            })
            return;
  
          }
          // console.log(email, username, password, avatar)
          setLoading(true)
          if(!username || !email || !password  || !avatar ){
            toast({
              title:'PLease fill all fields',
              status:'warning',
              duration:5000,
              isClosable:true,
              position:'bottom'            
            })
          }

          //signup request
          const res = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/api/user/signup`, {
            headers:{
              "Content-type": "application/json"
            },
            method:'POST',
            body:JSON.stringify({username, email, password, avatar})
          });

          if(!res.ok){
            setLoading(false)

            const data = await res.json()
            return toast({
              title:data.mssg,
              status:'error',
              duration:5000,
              isClosable:true,
              position:'bottom'
    
            });
          }
          //signin request
          const response = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/api/user/signin`, {
                headers:{
                  "Content-type": "application/json"
                },
                method:'POST',
                body:JSON.stringify({username, password})
              });
    
              if(!response.ok){
                setLoading(false)
    
                const data = await response.json()
                return toast({
                  title:data.mssg,
                  status:'error',
                  duration:5000,
                  isClosable:true,
                  position:'bottom'
        
                })
              }
    
              const userInfo = await response.json();
              localStorage.setItem('userInfo', JSON.stringify(userInfo));
    
              toast({
                title:'Registration successful',
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
          } }

        


       
  
        
      }
      const uploadAvatar = async(ava: any) => {
        try {
          setLoading(true);
        if(ava === undefined){
          toast({
            title:'PLease Select an Image',
            status:'warning',
            duration:5000,
            isClosable:true,
            position:'bottom'
          });
          return;
        }


        if(ava.type === 'image/jpeg' || 'image/jpg' || 'image/png'){
          const data = new FormData();
          data.append('file', ava);
          data.append('upload_preset', 'soro-soro');
          data.append('cloud_name', 'mediacloud-24');
         const res = await fetch('https://api.cloudinary.com/v1_1/mediacloud-24/upload',{
          method:'POST',
          body: data
         }
          );

          const resINJson = await res.json();
          // console.log(resINJson)

          // const userImg = await cloudinary.v2.uploader.upload(ava, {upload_preset:'soro-soro', public_id:username ? `${username}-avatar` : `${Date.now()}-avatar` })
          setAvatar(resINJson.url);
          toast({
            title:'Avatar uplaoded',
            status:'success',
            duration:5000,
            isClosable:true,
            position:'bottom'
          });
          setLoading(false);

        }else{
          toast({
            title:'PLease Select an Image',
            status:'error',
            duration:5000,
            isClosable:true,
            position:'bottom'
          });
          setLoading(false);
          
        }
          
        } catch (error) {
          setLoading(false)
          console.log(error)
          
        }
      }


  return (
    <VStack color='#fff' spacing='5px'>
        <FormControl isRequired id='username'>
            <FormLabel color='#000'>Username</FormLabel>
            <Input
              color='#000'

            placeholder='enter your username'
            // value={userData.username}
            // value={}
            onChange={(e) => setUsername(e.target.value)}
            />
        </FormControl>

        <FormControl isRequired id='email'>
            <FormLabel color='#000'>Email:</FormLabel>
            <Input
              color='#000'

            placeholder='jonDoe@gmail.com'
            // value={userData.email}
            onChange={(e) => setEmail(e.target.value)}
            />
        </FormControl>
        <FormControl isRequired id='password'>
            <FormLabel color='#000'>Password</FormLabel>
            <InputGroup>
                <Input
                color='#000'
                type={show? 'text': 'password'}
                placeholder='enter your password'
                // value={userData.password}
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

        <FormControl isRequired id='avatar'>
            <FormLabel color='#000'>Select avatar</FormLabel>
            <Input
              color='#000'
              type='file'
              p={1.5}
              accept='image/*'

            onChange={(e: any) => uploadAvatar(e.target.files[0])}
            />
        </FormControl>
        <Button
        colorScheme='blue'
        w='100%'
        marginTop={15}
        onClick={handleSubmit}
        isLoading={loading}
        >
        
            Signup
        </Button>
        <Button
        colorScheme='green'
        w='100%'
        marginTop={15}
        onClick={() => googleLogin()}
        
        >
         Signup with Google
          
        </Button>

      
    </VStack>
  )
}
