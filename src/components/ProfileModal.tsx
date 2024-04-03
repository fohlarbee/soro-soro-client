import { ViewIcon } from '@chakra-ui/icons'
import { IconButton, Modal, ModalContent, Button, ModalOverlay, ModalHeader, ModalCloseButton, ModalFooter, ModalBody, Image, Text } from '@chakra-ui/react'
import {useDisclosure} from '@chakra-ui/hooks'

import React from 'react'
import { useHistory } from 'react-router-dom'

export const ProfileModal = ({user, children} :any) => {

    const history = useHistory();
    const {isOpen, onClose,  onOpen,} = useDisclosure();

    const logOut = () => {
        localStorage.removeItem('userInfo')
        window.location.reload()
        history.push('/')
    }
  return (
    <>
    {children ?(<span onClick={onOpen}>{children}</span>) : (
        <IconButton aria-label='' display={{base:'flex'}} icon={<ViewIcon/>} onClick={onOpen}/>
    )}
    <Modal size='lg' isCentered isOpen={isOpen} onClose={onClose} >
        <ModalOverlay />
        <ModalContent height='400px'>
          <ModalHeader
          fontSize='30px'
          fontFamily='Work sans'
          display='flex'
          justifyContent='center' 
          >{user.username}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display='flex'
          flexDir='column'
          alignItems='center'
          justifyContent='center' 

          >
           <Image
           alt={user.username}
           src={user.avatar}
           boxShadow={150}
           borderRadius='full'
           
           />
           <Text fontSize={{base:'20px', md:'12px'}} fontFamily='Work sans'><>Email</>: {user.email}</Text>

           </ModalBody>

          <ModalFooter>
            <Button colorScheme='green' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
