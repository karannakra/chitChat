const request=require('request')

const location=(latitude,longitude,callback)=>{
    const url=`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1Ijoia2FyYW5uYWtyYSIsImEiOiJja2Q2MHVsNHkwNmpmMnJuNWVpOXU0ZGswIn0.WRC5qoChlxcPmUgfC0EOpA`
    request({url:url,json:true},(error, {body})=>{
        callback(undefined,body.features[0].place_name)
    })
}
module.exports=location