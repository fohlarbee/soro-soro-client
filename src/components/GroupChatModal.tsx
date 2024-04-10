import { Box, Button, FormControl, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { ReactNode, useContext, useState } from 'react'
import { chatContext } from '../context/ChatContext';
import { UserListItem } from './UserList';
import { ChatLoading } from './chatLoading';
import UserBadgeItem from './UserBadgeItem';

const GroupChatModal = ({children} :{children: ReactNode}) => {

  const {isOpen, onOpen, onClose} = useDisclosure()
  const [groupChatName, setGroupChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<any>([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false)

  const toast = useToast();
  const {user, chats, setChats} = useContext(chatContext)


  const handleSearch = async(query: any) => {
      try {
        setSearch(query);
        // console.log('this is search', query, search);
        if(!query){
          return toast({
            title:'Enter a search term',
            duration: 5000,
            isClosable:true,
            status: 'warning',
            position:'top'
          })
          }

          setLoading(true);
          const res =  await fetch(`${process.env.REACT_APP_ROOT_API_URL}/api/user?search=${query}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization':`Bearer ${user.data.Bearer}`

            }
          })
          const data = await res.json()
          // console.log(data)
          if(!res.ok){
              setLoading(false)
              return toast({
                  title:`${data.mssg}`,
                  description:'An Error occured',
                  status:'error',
                  duration:5000,
                  isClosable:true,
                  position:'top'
              })
          }
          setLoading(false)
          setSearchResult(data.users);
          // console.log('THis is data', data.users)

        
      } catch (error) {
        if(error instanceof Error){
          setLoading(false);
          return toast({
              title:`Something went wrong`,
              description:'Failed to load the search results',
              status:'error',
              duration:5000,
              isClosable:true,
              position:'top'
          })
      }  
        
      }

  }
  const handleSubmit = async() => {

    try {
      // console.log('Heres it',groupChatName, selectedUsers)
      if(!groupChatName || !selectedUsers ){
        return toast({
          title:'Please fill all fields',
          duration: 5000,
          isClosable:true,
          status: 'warning',
          position:'top'
        })
      }
  
     setLoading(true);
    const res =  await fetch(`${process.env.REACT_APP_ROOT_API_URL}/api/chat/group`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
       'Authorization':`Bearer ${user.data.Bearer}`
      },
      body: JSON.stringify({name:groupChatName, users: selectedUsers.map(( user: any) => user._id)})
    });
    const data = await res.json()
    // console.log(data)
    if(!res.ok){

        setLoading(false)
        return toast({
            title:`${data.mssg}`,
            description:'An Error occured',
            status:'error',
            duration:5000,
            isClosable:true,
            position:'top'
        })
    }
    setLoading(false)
    setChats([...chats,data.data]);
    onClose()
  
    toast({
      title:`${data.mssg}`,
      description:'New group chat created',
      status:'success',
      duration:5000,
      isClosable:true,
      position:'top'
  
    })
      
    } catch (error) {
      if(error instanceof Error){

        setLoading(false);
        return toast({
            title:`${error.message}`,
            description:'Failed to create group',
            status:'error',
            duration:5000,
            isClosable:true,
            position:'top'
        })
    }  
      
    }

  }


  const handleDelete = (user:any) => {
    setSelectedUsers(selectedUsers.filter(( u: any )=> u._id !== user._id))
  }
  
  const handleGroup = (user:any) => {
    if(selectedUsers.includes(user)){
      return toast({
        title:`${user.username} already added to group`,
        status:'warning',
        duration:5000,
        isClosable:true,
        position:'top'

      })
    }
    setSelectedUsers([...selectedUsers, user])

  }

  return (

    <>
    <span onClick={onOpen}>{children}</span>

    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>

      <ModalContent>
        <ModalHeader
        fontSize='23px'
        display='flex'
        fontFamily='Work sans'
        justifyContent='center'
        >Create Group Chat</ModalHeader>

        <ModalBody
          display='flex'
          flexDirection='column'
          alignItems='center'

        >
          <FormControl>
            <Input
            placeholder='chat name'
            mb={3}
            value={groupChatName}
            onChange={(e)  => setGroupChatName(e.target.value)}
            />
          </FormControl>

          <FormControl>
           <Input
           placeholder='Add users'
            mb={3}
           onChange={(e)  => handleSearch(e.target.value)}
            />
          </FormControl>
          {/* selected users */}
          <Box display='flex' flexDirection='row' flexWrap='wrap' width='100%'>
              {selectedUsers && selectedUsers.map((user:any) => (
               <UserBadgeItem key={user._id} user={user} handleFunction={() => handleDelete(user)}/>
 )            )}

          </Box>
         
         
         

          {/* render search users */}
          {loading ? (<ChatLoading/>) : 
          (searchResult.slice(0,4).map((user: any) =>(
            <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)}/>
          )))
          }

        </ModalBody>

        <ModalFooter>
          <Button
              colorScheme='green'
              onClick={handleSubmit}
          >
            Create Chat
          </Button>

        </ModalFooter>
      </ModalContent>
    </Modal>
    </>
  )
}

export default GroupChatModal