import { CheckCircleIcon, ViewIcon } from '@chakra-ui/icons'
import { Box, Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast, Text, FormControl, Input } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import { chatContext } from '../context/ChatContext'
import UserBadgeItem from './UserBadgeItem'
import { UserListItem } from './UserList'
import { ChatLoading } from './chatLoading'

const UpdateGroupChatModal = ({fetchAgain, setFetchAgain, fetchMessages}: any) => {
    const {isOpen, onOpen, onClose} = useDisclosure()

    const [groupChatName, setGroupChatName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<any>([]);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)
    const toast = useToast();
    const {user, selectedChat, setSelectedChat} = useContext(chatContext)

    const handleRemove = async(userToRemove: any) => {
        try {
            if(selectedChat.groupAdmin._id !== user.data.user._id && userToRemove._id !== user.data.user._id ){
                return toast({
                    title:'You are not group admin',
                    status:'warning',
                    duration:5000,
                    isClosable:true,
                    position:'top'
                })
            }
            if(selectedChat.groupAdmin._id === userToRemove._id){
                return toast({
                    title:'You cannot remove group admin',
                    status:'warning',
                    duration:5000,
                    isClosable:true,
                    position:'top'
                })
            }
            // if(selectedChat.groupAdmin._id === user.data.user._id){
                // return toast({
                    // title:'You cannot remove yourself as an Adnin, Kinldy leave the group',
                    // status:'warning',
                    // duration:5000,
                    // isClosable:true,
                    // position:'top'
                // })
            // }
            
            setRenameLoading(true)
            const res =  await fetch(`${process.env.REACT_APP_ROOT_API_URL}/api/chat/removefromgroup`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization':`Bearer ${user.data.Bearer}`
                },
                body: JSON.stringify({user_id:userToRemove._id, chat_id: selectedChat._id})
              })
              const data = await res.json()
              if(!res.ok){
                setRenameLoading(false)
                return toast({
                    title:`${data.mssg}`,
                    description:'An Error occured',
                    status:'error',
                    duration:5000,
                    isClosable:true,
                    position:'top'
                })
              }
            //   console.log('this is it', data)
              userToRemove._id === user.data.user._id ? setSelectedChat('') : setSelectedChat(data.data)
              setFetchAgain(!fetchAgain);
              fetchMessages();
              setRenameLoading(false);

            
        } catch (error) {
            if(error instanceof Error) {
                setRenameLoading(false)
                return toast({
                    title:`${error.message}`,
                    description:'An Error occured',
                    status:'error',
                    duration:5000,
                    isClosable:true,
                    position:'top'
                })
            }
        }

    }
    const handleAddUser = async(userToAdd: any) => {

        try {
            if(selectedChat.users.find((user: any) => user._id === userToAdd._id)){
                return toast({
                    title:`${userToAdd.username} already added to group`,
                    status:'warning',
                    duration:5000,
                    isClosable:true,
                    position:'top'
                })
            }
            if(selectedChat.groupAdmin._id !== user.data.user._id){
                return toast({
                    title:`${userToAdd.username} is not group admin`,
                    status:'warning',
                    duration:5000,
                    isClosable:true,
                    position:'top'
                })
            }

            setLoading(true)
            const res =  await fetch(`${process.env.REACT_APP_ROOT_API_URL}/api/chat/addtogroup`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization':`Bearer ${user.data.Bearer}`
                },
                body: JSON.stringify({user_id:userToAdd._id, chat_id: selectedChat._id})
              })

              const data = await res.json()
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
            //   console.log('this is it', data)
              setSelectedChat(data.data)
              setFetchAgain(!fetchAgain)
              setLoading(false)

            
        } catch (error) {
            if(error instanceof Error) {
                setLoading(false)
                return toast({
                    title:`${error.message}`,
                    description:'Failed to add user',
                    status:'error',
                    duration:5000,
                    isClosable:true,
                    position:'top'
                })
            
            }
       }
    }

    const handleRename = async() => {
        if(!groupChatName) return;
        try {
              setRenameLoading(true);

              const res =  await fetch(`${process.env.REACT_APP_ROOT_API_URL}/api/chat/renamegroup`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization':`Bearer ${user.data.Bearer}`
                },
                body: JSON.stringify({chatName:groupChatName, chat_id: selectedChat._id})
              })
            //   console.log(res.ok)
              const data = await res.json()

              if(!res.ok){
                setRenameLoading(false)
                return toast({
                    title:`${data.mssg}`,
                    description:'An Error occured',
                    status:'error',
                    duration:5000,
                    isClosable:true,
                    position:'top'
                })
              }

            //   console.log('this is it', data)
              setSelectedChat(data.data)
              setFetchAgain(!fetchAgain)
              setRenameLoading(false)
            
        } catch (error) {
            if(error instanceof Error){
                setRenameLoading(false)
                setGroupChatName('')
                return toast({
                    title:`${error.message}`,
                    description:'Failed to rename group',
                    status:'error',
                    duration:5000,
                    isClosable:true,
                    position:'top'
                })
            }
            
        }




    }
    
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

    const handleLeave = async(userToLeave: any) => {

        try {
            setRenameLoading(true)
            const res =  await fetch(`${process.env.REACT_APP_ROOT_API_URL}/api/chat/removefromgroup`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization':`Bearer ${user.data.Bearer}`
                },
                body: JSON.stringify({user_id:userToLeave._id, chat_id: selectedChat._id})
              })
              const data = await res.json()
              if(!res.ok){
                setRenameLoading(false)
                return toast({
                    title:`${data.mssg}`,
                    description:'An Error occured',
                    status:'error',
                    duration:5000,
                    isClosable:true,
                    position:'top'
                })
              }
            //   console.log('this is it', data)
              userToLeave._id === user.data.user._id ? setSelectedChat('') : setSelectedChat(data.data)
              setFetchAgain(!fetchAgain)
              setRenameLoading(false)
            
        } catch (error) {
            if(error instanceof Error) {
                setRenameLoading(false)
                return toast({
                    title:`${error.message}`,
                    description:'An Error occured',
                    status:'error',
                    duration:5000,
                    isClosable:true,
                    position:'top'
                 })
            
             }
       }


    }

  return (
    <>
    < IconButton icon={<ViewIcon/>} onClick={onOpen} aria-label='full' />

    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
        fontFamily='Work sans'
        display='flex'
        justifyContent='center'
        >{selectedChat.chatName.toUpperCase()}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <Text
            pb={2}
            fontFamily='Work sans'
            >Group members</Text>
            <Box 
            width='100%'
            display='flex'
            flexWrap='wrap'
            
            >
                {selectedChat.users.map((user: any) => (
                     <UserBadgeItem key={user._id} user={user} handleFunction={() => handleRemove(user)}/>

                ))}
            </Box>
            <FormControl display='flex'>
                <Input
                placeholder='Chat Name'
                mb={3}
                value={groupChatName}
                onChange={(e)  => setGroupChatName(e.target.value)}
                />
                
                <IconButton icon={<CheckCircleIcon/>} aria-label='' colorScheme='green'
                isLoading={renameLoading}
                ml={2}
                onClick={handleRename}
                / >
                

            </FormControl>
            <FormControl display='flex'>
            <Input
            
             placeholder='Add members'
              mb={3}
             onChange={(e)  => handleSearch(e.target.value)}
             />
     
             </FormControl>
             {loading ? (<ChatLoading/>) : 
                (   searchResult.slice(0,4).map((user: any) =>(
                 <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)}/>
                )))
            }
            
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='red' mr={3} onClick={() => handleLeave(user.data.user)}>
            Leave Group
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>  
  )
}

export default UpdateGroupChatModal