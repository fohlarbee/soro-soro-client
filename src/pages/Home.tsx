import { Box, Container, Text , Tabs, TabList, TabPanels, Tab, TabPanel} from "@chakra-ui/react"
import Login from "../components/auth/Login"
import Signup from "../components/auth/Signup"
import { useHistory } from "react-router-dom"
import { useEffect } from "react"

function Home() {

  const history = useHistory();
  
  useEffect(() => {
      const user = localStorage.getItem('userInfo');
      if(user) history.push('/chats')

      history.push('/');


  }, [history])
  return(
    <Container maxW='xl' bg='#' centerContent>
        <Box
        display='flex'
        justifyContent='center'
        w='100%'
        bg='#fff'
        margin='40px 0 15px 0'
        borderRadius='1g'
        borderWidth='1px'
        >
            <Text fontSize='4xl' fontFamily='Work Sans' color='#000'>Soro-Soro</Text>
        </Box>
        <Box
        bg='#fff'
        w='100%'
        p={4}
        borderRadius='1g'
        color='black'
        borderWidth='1px'
        >

          <Tabs variant='soft-rounded'>
            <TabList mb='1em'>
              <Tab w='50%'>Login</Tab>
              <Tab w='50%'>Sign up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login/>
              </TabPanel>
              <TabPanel>
                <Signup/>
              </TabPanel>
            </TabPanels>
          </Tabs>

        </Box>
    </Container>
  )
  
}

export default Home