import { useContext, useState } from "react";
import { chatContext } from "../context/ChatContext"
import { Box } from "@chakra-ui/react";
import { SideDrawer } from "../components/SideDrawer";
import { MycChats } from "../components/MyChats";
import { ChatBox } from "../components/ChatBox";

function Chats() {

  const {user} = useContext(chatContext);
  const [fetchAgain, setFetchAgain] = useState(false)
  
  return (
    <div style={{width:'100%'}}>
      {user && <SideDrawer/>}

      <Box 
      display='flex'
      justifyContent='space-between'
      width='100%'
      height='95.6vh'
      padding='10px'
      >
        {user && <MycChats fetchAgain={fetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>

    </div>
  )
}

export default Chats