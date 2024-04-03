import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useContext, useState } from 'react'
import { chatContext } from '../context/ChatContext';
import { ProfileModal } from './ProfileModal';
import { useHistory } from 'react-router-dom';
import { ChatLoading } from './chatLoading';
import { UserListItem } from './UserList';

export const SideDrawer = () => {
    const [search, setSearch] = useState('')
    const [searchResult, setsearchResult] = useState([]);
    const [loading, setloading] = useState(false)
    const [loadingChat, setloadingChat] = useState(false);
    const history = useHistory()
    const {isOpen, onClose,  onOpen,} = useDisclosure();
    const toast = useToast()
    const {user, setSelectedChat, selectedChat, chats, setChats} = useContext(chatContext)


const accessChat = async(user_id: any) => {
    try {
        setloadingChat(true)
        const res =  await fetch(`http://localhost:8000/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${user.data.Bearer}`
            },
            body: JSON.stringify({
                user_id: user_id
            })
        });

        // console.log(res.ok)
        const data = await res.json()
        if(!res.ok){
            setloadingChat(false)
            return toast({
                title: `${data.mssg}`,
                status:'error',
                duration:5000,
                isClosable:true,
                position:'top-left'

            })
        }
        // console.log('data re',data.data)
        if(!chats.find((c:any) => c._id === data.data._id)){
            setChats([...chats, data.data])
            setSelectedChat(data.data)
            console.log('okay',data.data)

        }
        // setSelectedChat(data.data)
        setloadingChat(false)
        onClose()
        
    } catch (error) {
        setloadingChat(false)
        return toast({
            title: 'An error occurred',
            status:'warning',
            duration:5000,
            isClosable:true,
            position:'top-left'
        })
        
    }


}
    // console.log(user.data.Bearer)
    const logOut = () => {
        // console.log('logout')
        localStorage.removeItem('userInfo')
        // window.location.reload()
        history.push('/')
    };


    const handleSearch = async() => {
        if(!search){
            return toast({
                title:'Enter a user to search',
                status:'warning',
                duration:5000,
                isClosable:true,
                position:'top-left'
            })
        }
        try {
            setloading(true);

            const res =  await fetch(`http://localhost:8000/api/user?search=${search}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${user.data.Bearer}`
                }
            })

            const data = await res.json()
            // console.log(data)
            if(!res.ok){
                setloading(false)
                return toast({
                    title:`${data.mssg}`,
                    description:'An Error occured',
                    status:'error',
                    duration:5000,
                    isClosable:true,
                    position:'top-left'

                })
            }
            setloading(false)

            setsearchResult(data.users);
            // console.log('THis is data', data.users)
            
        } catch (error:any) {
            if(error instanceof Error){
                setloading(false);
                return toast({
                    title:`Something went wrong`,
                    description:'Failed to load the search results',
                    status:'error',
                    duration:5000,
                    isClosable:true,
                    position:'bottom-left'
                })

            }  
        }
   }

  return (
    <>
    <Box 
    display='flex'
    justifyContent='space-between'
    alignItems='center'
    bg='#fff'
    width='100%'
    padding='5px 10px 5px 10px'
    borderWidth='5px'
    style={{color:'#fff'}}>
        <Tooltip hasArrow placement='bottom-end' label='Quick search for users'>
            <Button variant='ghost' onClick={onOpen}>
                {/* <i class=''></i> */}
            <i className="fas fa-search"></i>
            <Text
            // d={{base:'none', md:'flex'}}
            display={{ base:'none', md:'flex'}}
            px='4'
            >Search user</Text>
            </Button>

        </Tooltip>
        <Text fontSize='2xl' fontFamily='Work sans' textColor='#000'>
            Soro-Soro

        </Text>
        <div>
            <Menu> 
                <MenuButton padding={1}>
                    <BellIcon textColor='#000' fontSize='20px'/>
                    {/* <MenuList></MenuList> */}
                </MenuButton>
            </Menu>
            <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                    <Avatar size='sm' cursor='ponter' name={user.data.user.username} src={user.data.user.avatar}/>
                    <MenuList>
                        <ProfileModal user={user}>
                             <MenuItem>My profile</MenuItem>
                        </ProfileModal>
                        <MenuDivider/>
                        <MenuItem  onClick={logOut}>Logout</MenuItem>
                        <MenuItem onMouseDown={(e) => {e.stopPropagation(); console.log('yes')}}>
                        press
                   </MenuItem>
                    </MenuList>
                    
                </MenuButton>
            </Menu>
           
        </div>
    </Box>
    <Drawer placement='left' isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay/>
        <DrawerContent>
            <DrawerHeader borderBottomWidth='1px'>

                Serach users
            </DrawerHeader>
            <DrawerBody
            display='flex'
            flexDirection='column'
            >
                <Box display='flex' paddingBottom={2}>
                        <Input
                        placeholder='search by name or email'
                        marginRight={2}
                        value={search}
                        onChange={(e: any) => setSearch(e.target.value)}
                        />
                        <Button onClick={handleSearch}>search</Button>
                </Box>
                 {loading ?  <ChatLoading/> :(
                    searchResult?.map( (nigga: any) => 
                    <UserListItem user={nigga} key={nigga._id}  handleFunction={() => accessChat(nigga?._id)}/>

                    )
                 )}
                 {loadingChat && <Spinner ml='auto' display='flex' />}


            </DrawerBody>
        </DrawerContent>


    </Drawer>
    </>
 
)}

