

function getGoogleUrls(){

    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth' 

    const options = {
        // redirect_uri:process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URL_FOR_SIGNIN as string,
        redirect_uri:'http://localhost:8000/api/user/auth/google/sessions',
        client_id:'474140377958-rku8lsed3h2k9qfck424ickdg2lv5bcq.apps.googleusercontent.com',
        access_type:'offline',
        response_type:'code',
        prompt:'consent',
        scope:[
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',


        ].join(" ")
    }

    const qs = new URLSearchParams(options)
    // console.log('this is client id', process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URL_FOR_SIGNIN)

    // console.log(qs.toString())
    // console.log(options)
    return `${rootUrl}?${qs.toString()}`;
}

export default getGoogleUrls

// GOOGLE_CLIENT_ID=796987730760-t8u7e4ih4mq1a05vkrfi9shr3uikcq9h.apps.googleusercontent.com
// SERVER-ENDPOINT=http://localhost:8000
// GOOGLE_OAUTH_REDIRECT_URL_FOR_SIGNIN=http://localhost:8000/api/v2/user/signin/sessions/oauth/google

