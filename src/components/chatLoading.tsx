import { Skeleton, } from '@chakra-ui/react'
import React from 'react'
import {Stack} from '@chakra-ui/layout'

export const ChatLoading = () => {
 return (

    <Stack height='100%' width='100%' display='flex' justifyContent='center'>
        <Skeleton  height='45px' width='100%'/>
        <Skeleton height='45px'/>
        <Skeleton height='45px'/>
        <Skeleton height='45px'/>
        <Skeleton height='45px'/>
        {/* <Skeleton height='45px'/> */}
        {/* <Skeleton height='45px'/> */}
        {/* <Skeleton height='45px'/> */}
        {/* <Skeleton height='45px'/> */}
       {/* <Skeleton height='45px'/> */}
        {/* <Skeleton height='45px'/> */}
        {/* <Skeleton height='45px'/> */}
 </Stack>
  )

// )
}
