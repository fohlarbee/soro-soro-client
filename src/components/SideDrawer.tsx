import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Image, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, Tooltip, useDisclosure, useToast, Modal } from '@chakra-ui/react';
import React, { useContext, useState } from 'react'
import { chatContext } from '../context/ChatContext';
import { ProfileModal } from './ProfileModal';
import { useHistory } from 'react-router-dom';
import { ChatLoading } from './chatLoading';
import { UserListItem } from './UserList';
import { getSender, getSenderFull } from '../services/chatLogic';
// import {} from 'react-notification-badge';
// import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge';


export const SideDrawer = () => {
    const [search, setSearch] = useState('')
    const [searchResult, setsearchResult] = useState([]);
    const [loading, setloading] = useState(false)
    const [loadingChat, setloadingChat] = useState(false);
    const history = useHistory()
    const {isOpen, onClose,  onOpen,} = useDisclosure();
    const toast = useToast()
    const {user, setSelectedChat, selectedChat, chats, setChats, notifications, setNotifications} = useContext(chatContext)


    const handleProfileView = () =>{
        console.log('yes')
    }


const accessChat = async(user_id: any) => {
    try {
        // console.log(user_id)
        setloadingChat(true)
        const res =  await fetch(`${process.env.REACT_APP_ROOT_API_URL}/api/chat`, {
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

        // console.log('this is it', data.data)
        if(!chats.find((c:any) => c._id === data.data._id)){
            // console.log('this is it', data.data)

            setChats([data.data, ...chats])
            // setChats([data.data, ...chats])
            setSelectedChat(data.data)
            // console.log('okay',data.data)

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
        // window.location.reload()
        localStorage.removeItem('userInfo')
        history.push('/')
    }


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

            const res =  await fetch(`${process.env.REACT_APP_ROOT_API_URL}/api/user?search=${search}`, {
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
        <Box>
            <Menu> 
                <MenuButton padding={1}>
                    <div style={{position:'absolute', 
                    background:'red', 
                    width:15, 
                    height:15, 
                    border:1, 
                    borderRadius:15, 
                    alignItems:'center', 
                    justifyContent:'center'}}>
                    <Text 
                    fontSize={10}>{notifications.length}</Text>

                    </div>
                  
                    
                    <BellIcon textColor='#000' fontSize='20px'/>
                </MenuButton>

                <MenuList color='#000' pl={2}>
                    {!notifications.length && 'No new messages'}
                    {notifications.map((notf: any) => (
                        // console.log(notf)
                        <MenuItem key={notf._id} onClick={() => {
                            setSelectedChat(notf.chat);
                            setNotifications(notifications.filter((n: any) => n !== notf))
                        }} >
                            {notf.chat.isGroupChat ? `New mesage in ${notf.chat.chatName}`
                            : ` New message from ${getSender({loggedUser:user, users: notf.chat.users})}`}
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
            <Menu>
                {({ isOpen }) => (
                    <>
                    
                    <MenuButton isActive={isOpen} as={Button} rightIcon={<ChevronDownIcon />}>
                    <Avatar
                    src={user.data.user.avatar}
                    size='sm'
                    />
                        {/* {isOpen ? 'Close' : 'Open'} */}
                    </MenuButton>
                    <MenuList>
                        <ProfileModal user={user.data.user}>
                        <MenuItem fontFamily='Work sans' color='#000'>

                        My Profile
                        </MenuItem>

                        </ProfileModal>

                        <MenuDivider/>
                        <MenuItem fontFamily='Work sans'  color='#000' onClick={logOut}>Logout</MenuItem>
                    </MenuList>
                    </>
                )}
            </Menu>
           
        </Box>
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



  

    {/* <Modal size='lg' isCentered isOpen={isOpen} onClose={onClose} >
        <ModalOverlay />
        <ModalContent height='400px'>
          <ModalHeader
          fontSize='30px'
          fontFamily='Work sans'
          display='flex'
          justifyContent='center' 
          >{user.data.user.username}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display='flex'
          flexDir='column'
          alignItems='center'
          justifyContent='center' 

          >
           <Image
           alt={user.data.user.username }
           src={user.data.user.avatar}
           boxShadow={150}
           borderRadius='full'
           
           />
           <Text fontSize={{base:'20px', md:'12px'}} fontFamily='Work sans'><>Email</>: {user.data.user.email}</Text>

           </ModalBody>

          <ModalFooter>
            <Button colorScheme='green' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
    </>
 
)}

