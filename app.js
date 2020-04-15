'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const access_token = "EAAJOtQvjzZBkBAHa0ekfCZB0IZAuBlBEMbd9lc7JugszVpVsJaJ8xfjjt2VMGXO8EENe7dYotmxOrmEmaKbMA5yRKZB4ZAfBCQblojhNTtUQDqGShNAb9bQXqjp7OUuwh5Nb062ZAGaTZCVgp2DbeojXClKHCRDwtYRFNtBkfCDrwZDZD"

const app = express();

app.set('port' , 3000);
app.use(bodyParser.json());

app.get('/',function (req, response){
response.send('Hola LauraSarita');

})

app.get('/webhook',function(req,response){
// if para verificar informacion y token debe ser igual en tipo
// y en formato
//no revelar el token

if (req.query['hub.verify_token'] == 'construcciones_token'){
response.send(req.query['hub.challenge']);
}else {
response.send ('No tienes permiso para conectar');
}

});

app.post('/webhook', function(req, res){
const webhook_event = req.body.entry[0];

if(webhook_event.messaging) {
webhook_event.messaging.forEach(event => {
handleEvent(event.sender.id,event);
})
}
res.sendStatus(200);
});

//Se la enviamos desdel principio
//funcion manejo de eventos
function handleEvent(senderId, event){

if(event.message)
{
            handleMesssage(senderId,event.message)

}
else if(event.postback){
 handlePostback(senderId, event.postback.payload)

}

}




function handleMesssage(senderId,event){
    if(event.text){
        defaultMessage(senderId);
    } else if(event.attachments){
      handleAttachments(senderId, event);  
    }

}

//objeto que vamos a mandar como respuesta
function defaultMessage(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "!Hola soy un bot de messenger y te invito a utilizar nuestro menú! ",
            
        }
    }
    senderActions(senderId)
    callSendApi(messageData);
}



function handlePostback(senderId, payload) {
    console.log(payload)
          switch(payload){
            case "GET_STARTED_CONSTRUCCIONES":
                senderActions(senderId)
                defaultMessage(senderId);
            break;
            case "CONSTRUCCIONES_PAYLOAD":
                senderActions(senderId)
                showAptos(senderId);
            break;
            case "CALATAY_PAYLOAD":
                senderActions(senderId)
                tipoAptCalatay(senderId);
            break;
            case "ABOUT_PAYLOAD":
                senderActions(senderId)
                messageImage(senderId);
            break;
            case "CONTACTO_PAYLOAD":
                senderActions(senderId)
                contactSupport(senderId);
            break;
            case "SUCURSALES_PAYLOAD":
                senderActions(senderId)
                showLocations(senderId);
            break;
            case "CARANDU_PAYLOAD":
                senderActions(senderId)
                tipoAptCarandu(senderId);  
            break;
                case "MILA_PAYLOAD":
             senderActions(senderId)
            contactSupportMila(senderId);
            break;
            case "PROMOCIONES_PAYLOAD":
                contactSupportMila(senderId);
            break;               

          }    

}

//envio de acciones de escribiendo
function senderActions(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "sender_action":"typing_on"
    }
    callSendApi(messageData);
}



//Funcion de tipo de adjuntos
// let que tipo de adjunto estamos recibiendo
function handleAttachments(senderId,event)  {
    let attachment_type = event.attachments[0].type;
    switch (attachment_type) {
        case "video":
            console.log("VIDEO ->",attachment_type)
            break;
        case "audio":
            console.log("AUDIO ->",attachment_type)
            break;
        case "image":
            console.log("IMAGE ->",attachment_type)
            break;
        case "file":
            console.log("ARCHIVO ->",attachment_type)        
    }

}







//funcion para enviar mensajes
function callSendApi(response){
request({
"uri": "https://graph.facebook.com/me/messages/",
"qs": {
"access_token" : access_token
},
"method":"POST",
"json" : response

},
function(err){
if(err){
console.log("Ha ocurrido un error")
}else {
console.log("Mensaje enviado")
}
}

)
}



// ---- AQUI VOY ---
function showAptos(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Calatay",
                            "subtitle": "Excelente vista",
                            "image_url": "https://construccionesrac.com/wp-content/uploads/2016/02/Calatay-min.jpg",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir Calatay",
                                    "payload": "CALATAY_PAYLOAD",
                                }
                            ]
                        },
                        {
                            "title": "Carandu",
                            "subtitle": "Conectado con la naturaleza",
                            "image_url": "https://construccionesrac.com/wp-content/uploads/2015/06/Carandu-min.jpg",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir Carandu",
                                    "payload": "CARANDU_PAYLOAD",
                                }
                            ]
                        },
                        {
                            "title": "Mila Plaza",
                            "subtitle": "Centro Multicomercial",
                            "image_url": "https://scontent.fpei1-1.fna.fbcdn.net/v/t1.0-9/84546747_1082820078717717_7440785700766613504_o.jpg?_nc_cat=102&_nc_sid=9267fe&_nc_ohc=Rwpw0CgT2HAAX9KL26o&_nc_ht=scontent.fpei1-1.fna&oh=adb220031173bc658db7a134cee2d0e7&oe=5EBD26D7",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir MilaPlaza",
                                    "payload": "MILA_PAYLOAD",
                                }
                            ]
                        }
                
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}

function tipoAptCalatay(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            attachment: {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    
                    "elements": [
                        {
                            "title": "Cocina",
                            "image_url": "https://scontent.fpei1-1.fna.fbcdn.net/v/t1.0-9/92466338_1132493137083744_3105026673699979264_n.jpg?_nc_cat=100&_nc_sid=a26aad&_nc_ohc=cIl_d5BVEkIAX-g6aJL&_nc_ht=scontent.fpei1-1.fna&oh=3e93029b35d07acb80f0099c32decb50&oe=5EB8738B",
                            
                            "subtitle": "Excelente cocina con isla",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Mas informacion",
                                    "payload": "MILA_PAYLOAD",
                                }
                            ]
                        },
                        {
                            "title": "Cuarto",
                            "image_url": "https://scontent.fpei1-1.fna.fbcdn.net/v/t1.0-9/92402960_1132493273750397_7195307931590459392_n.jpg?_nc_cat=105&_nc_sid=a26aad&_nc_ohc=2IB9qBknLK8AX8Sc983&_nc_ht=scontent.fpei1-1.fna&oh=bb3b661f0848bf4bd2c1886d4701c7b5&oe=5EB53FDB",
                            "subtitle": "Cuarto matrimonial",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Mas informacion",
                                    "payload": "MILA_PAYLOAD",
                                }
                            ]
                        },
                        {
                            "title": "Cuarto Numero 2",
                            "image_url": "https://scontent.fpei1-1.fna.fbcdn.net/v/t1.0-9/92605561_1132493240417067_9159537634446409728_o.jpg?_nc_cat=102&_nc_sid=a26aad&_nc_ohc=mhSKxZK5mnQAX-viCMj&_nc_ht=scontent.fpei1-1.fna&oh=3dbc2703d7b07d6df1c46328b57f1abd&oe=5EB673B8",
                            "subtitle": "Cuarto de 5mts2",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Mas informacion",
                                    "payload": "MILA_PAYLOAD",
                                }
                            ]
                        }


                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}


function tipoAptCarandu(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            attachment: {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    
                    "elements": [
                        {
                            "title": "Apartamento TIPO B",
                            "image_url": "https://scontent.fpei1-1.fna.fbcdn.net/v/t1.0-9/90008670_1116581915341533_4773981403635253248_o.jpg?_nc_cat=102&_nc_sid=a26aad&_nc_ohc=0oVMJzs6CpgAX8OSEpJ&_nc_ht=scontent.fpei1-1.fna&oh=8184d0085694aaeb496ec175c6328060&oe=5EBC14F7",
                            
                            "subtitle": "Area 46.50 mt2",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Mas informacion",
                                    "payload": "MILA_PAYLOAD",
                                }
                            ]
                        },
                        {
                            "title": "Apartamento TIPO A",
                            "image_url": "https://scontent.fpei1-1.fna.fbcdn.net/v/t1.0-9/90481735_1116581868674871_2713500942510063616_o.jpg?_nc_cat=105&_nc_sid=a26aad&_nc_ohc=XxNyb2mGk6UAX-3XWjY&_nc_ht=scontent.fpei1-1.fna&oh=6b4a4c62daf8de834176d25dda7d8355&oe=5EBB3DEA",
                            "subtitle": "60.14 mt2",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Mas informacion",
                                    "payload": "MILA_PAYLOAD",
                                }
                            ]
                        },
                        {
                            "title": "Conjunto",
                            "image_url": "https://scontent.fpei1-1.fna.fbcdn.net/v/t1.0-9/90351117_1116581778674880_7274760527304196096_o.jpg?_nc_cat=103&_nc_sid=a26aad&_nc_ohc=O65vCVB7UusAX8Rn1Zd&_nc_ht=scontent.fpei1-1.fna&oh=32c380fa693a28638f92a8460b0ce524&oe=5EBDAE11",
                            "subtitle": "Espectacular entrada",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Mas informacion",
                                    "payload": "MILA_PAYLOAD",
                                }
                            ]
                        }

                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}




// codigo para devover una imagen al usuario
function messageImage(senderId){
    const messageData = {
        "recipient": {
            "id" : senderId
        },
        "message": {
            "attachment" : {
                "type" :"image",
                "payload": {
                    "url":"https://media.giphy.com/media/3o85xA30i7z1LUIISY/giphy.gif"
                }
            }
        }
    }
    callSendApi(messageData);
}


function contactSupport(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type":"template",
                "payload":{
                    "template_type":"button",
                    "text":"Hola este es el canal de soporte , ¿Quieres llamarnos?",
                    "buttons": [
                        {
                            "type":"phone_number",
                            "title":"Llamar a un asesor",
                            "payload":"+573153585464"
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}

function contactSupportMila(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type":"template",
                "payload":{
                    "template_type":"button",
                    "text":"Comunicate para mas informacion!!",
                    "buttons": [
                        {
                            "type":"phone_number",
                            "title":"Llamar a un asesor",
                            "payload":"+573153585464"
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}






function showLocations(senderId){
    const messageData = {
        "recipient": {
            "id" : senderId
        },
        "message": {
            "attachment": {
                "type":"template",
                "payload": {
                    "template_type":"generic",
                    "elements": [
                        {
                            "title":"Sucursal Ibague",
                            "image_url" : "https://scontent.fpei1-1.fna.fbcdn.net/v/t1.0-9/74409244_1001391976860528_3064474150836895744_o.jpg?_nc_cat=108&_nc_sid=9267fe&_nc_ohc=8DlHCRh208gAX9TCXbF&_nc_ht=scontent.fpei1-1.fna&oh=4ec7ea6689a321d830aee8af4c35989f&oe=5EBAE81A",
                            "subtitle":"Av Ambala 60 Frente a la estacion",
                            "buttons": [
                                {
                                    "title":"Ver en el mapa",
                                    "type":"web_url",
                                    "url":"https://goo.gl/maps/4WCTmkwFmsJ1FdNz6",
                                    "webview_height_ratio":"full"
                                }
                            ]
                        }
                        
                    ]
                }
                
            }
        }
    }
    callSendApi(messageData);
}




app.listen(app.get('port'), function(){
console.log('Nuestro servidor esta funcionando en el puerto', app.get('port'));
});

//Se crea al webhook para conectar nuestra aplicacion con el servidor de
//facebook