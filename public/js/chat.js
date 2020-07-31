window.onload=(()=>{
    const socket = io()
    //Elements
    const $messageForm=document.querySelector('#form-data')
    const $messageFormInput=$messageForm.querySelector('input')
    const $messageFormButton=$messageForm.querySelector('button')
    const $sendLocation=document.querySelector('#send-location')
    const $message=document.querySelector('#messages')
    const sideBarTemplate=document.querySelector('#sidebar-template').innerHTML



    //autoScroll
    const autoScroll=()=>{
        //new message element
        // const $newMessage=$message.lastElementChild
        //
        // //height of the new message
        // const newMessageStyles=getComputedStyle($newMessage)
        // const newMessageMargin=parseInt(newMessageStyles.marginBottom)
        // const newMessageHeight=$newMessage.offsetHeight+newMessageMargin
        //
        // //visible Height
        // const visibleHeight=$message.offsetHeight
        //
        // //Height of messages container
        // const containerHeight=$message.scrollHeight
        //
        // //how far have i scrolled
        // const scrollOffset=$message.scrollTop+visibleHeight
        //
        // if(containerHeight-newMessageHeight<=scrollOffset){
        //     $message.scrollTop=10
        // }
    }
    //Templates
    const messageTemplate=document.querySelector('#message-template').innerHTML

    const locationTemplate=document.querySelector('#location-template').innerHTML
    //options
    const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

    socket.on('locationMessage',({text,createdAt})=>{
        const html=Mustache.render(locationTemplate,{
            text,
            createdAt:moment(createdAt).format('LT')
        })
            $message.insertAdjacentHTML('beforeend',html)
        autoScroll()
    })
    socket.on('message',({text,createdAt,user})=>{
        if(text==''){
            return $messageFormButton.setAttribute('disabled','disabled')
        }
        const html=Mustache.render(messageTemplate,{
            user,
            text,
            createdAt:moment(createdAt).format('LT')
        })
        $message.insertAdjacentHTML('beforeend',html)
        autoScroll()
    })

    $messageForm.addEventListener('submit',(event)=> {

        event.preventDefault()

        $messageFormButton.setAttribute('disabled','disabled')

        const message = $messageFormInput.value

        socket.emit('sendMessage',message,(error)=>{

            $messageFormButton.removeAttribute('disabled')

            $messageFormInput.value=''

            $messageFormInput.focus()

            if(error){

            return console.log(error)

            }

        })
    })
    socket.on('roomData',({room,users})=>{
        document.querySelector('#sidebar').innerHTML=Mustache.render(sideBarTemplate, {
            room,
            users
        })

    })

    $sendLocation.addEventListener('click',()=>{

        if(!navigator.geolocation){

            return alert('Geolocation is not supported by your browser')
        }
        navigator.geolocation.getCurrentPosition((position)=>{

            $sendLocation.setAttribute('disabled','disabled')

            const latitude=position.coords.latitude

            const longitude=position.coords.longitude

                socket.emit('sendlocation',({latitude,longitude}),()=>{

                $sendLocation.removeAttribute('disabled')

                console.log(`location Shared`)
            })
        })
    })
    socket.emit('join',{username,room},(error)=>{

        if(error){
            alert(error)
            location.href='/'
        }
    })
})