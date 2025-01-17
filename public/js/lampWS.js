var deviceList=[]

class Gateway {
    constructor() {
        this.GatewayID;
        this.DeviceType;
        this.Img;
        this.Name;
        this.Status;
        this.Device=[];
    }
}

class Dimmer {
    constructor() {
        this.type=3;
        this.id=0;
        this.name="Dimmer";
        this.online=0;
        this.bright=0;
        this.status=0;
    }
}

function connectWS() {
    ws=new WebSocket("ws://localhost:8000/echo");
    console.log("Connection : "+ws.url);

    ws.onmessage=(event) => {
        // console.log("data : "+event.data);
        const obj=JSON.parse(event.data);
        checkCommand(obj.cmd, obj.param);
    }
    ws.onopen=(event) => {
        console.log("onopen : "+JSON.stringify(event));
        sendLogin();
    }
    ws.onclose=(event) => {
        console.log("onclose : code("+event.code+"), reason("+event.reason+")");
    }

}

function sendLogin() {
    const data=JSON.stringify({ "cmd": 1, "param": { "Username": "bird", "Password": "123456789" } })
    ws.send(data);
}

function getFriendInformation() {
    const data=JSON.stringify({ "cmd": 32, "param": {} })
    ws.send(data);
}

function initData(Member) {
    Object.entries(Member).map(([gatewayID, gatewayData]) => {
        let gateway=new Gateway();
        gateway.GatewayID=parseInt(gatewayID);
        gateway.DeviceType=gatewayData.DeviceType;
        gateway.Img=gatewayData.Img;
        gateway.Name=gatewayData.Name;
        gateway.Status=gatewayData.Status;

        Object.entries(gatewayData.Device).forEach(([deviceID, deviceData]) => {
            if (deviceData.DeviceStyleID==3) {
                let dimmer=new Dimmer();
                dimmer.id=parseInt(deviceID);
                dimmer.name=deviceData.DeviceName;
                dimmer.online=deviceData.Control["0"].Value;
                dimmer.bright=deviceData.Control["1"].Value;
                dimmer.status=deviceData.Control["2"].Value;
                gateway.Device.push(dimmer);
            }
        });

        deviceList.push(gateway);
    });

}

function checkCommand(cmd, payload) {
    console.log("Command:"+cmd);
    if (cmd==1) {
        // res.LoginResult
        if (payload.Success==1) {
            getFriendInformation();
        }
        console.log("Login :"+(payload.Success==1? "Logedin":"Failed"));
    } else if (cmd==34) {
        // res.FriendInformation
        const { Member, Message, Success }=payload
        if (Member!=undefined) {
            initData(Member)
        }
    } else if (cmd==31) {
        // res.Control
        const { Ctrl, Device, Member, V }=payload
        console.log({ Ctrl, Device, Member, V })
        const devices=deviceList.find(dev => dev.GatewayID==Member);

        let dev=null;
        devices.Device.forEach(item => {
            if (item.type==3) {
                dev=devices.Device.find(dev => dev.id==Device)
            }
        })

        if (dev!=null) {
            if (dev.type==3) {
                if (Ctrl==0) {
                    // online
                    dev.online=V;
                    const lableStatus=document.getElementById(`status${Member}${Device}`)
                    if (V==0) {
                        lableStatus.innerText=translations.offline;
                        lableStatus.classList.remove('text-green-500');
                        lableStatus.classList.add('text-red-500');
                    } else {
                        lableStatus.innerText=translations.online;
                        lableStatus.classList.remove('text-red-500');
                        lableStatus.classList.add('text-green-500');
                    }
                } else if (Ctrl==1) {
                    // bright
                    if (dev.bright!=V) {
                        dev.bright=V;
                        const lableBright=document.getElementById(`bright${Member}${Device}`)
                        lableBright.innerText=V+"%";

                        const InputBright=document.getElementById(`number-input${Member}${Device}`);
                        if(InputBright){
                            InputBright.value = V
                        }
                    }
                } else if (Ctrl==2) {
                    // status
                    dev.status=V;
                    const lablePower=document.getElementById(`power${Member}${Device}`)
                    if (V==0) {
                        lablePower.innerText=translations.poweroff;
                        lablePower.classList.remove('text-green-500');
                        lablePower.classList.add('text-red-500');
                    } else {
                        lablePower.innerText=translations.poweron;
                        lablePower.classList.remove('text-red-500');
                        lablePower.classList.add('text-green-500');
                    }
                }
            }
        }
    }
}



connectWS()