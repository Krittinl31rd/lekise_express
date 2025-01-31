const express=require("express");
const router=express.Router();
const sql=require('../../config/sql');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const i18n=require('i18n');

router.post('/addlatlng/:id', async (req, res) => {
    const latlngData=req.body
    try {
        latlngData.forEach(async (data) => {
            await sql.update('Devices',
                { Latitude: data.lat, Longitude: data.lng },
                'DeviceID = :DeviceID AND MemberID = :MemberID',
                {
                    DeviceID: data.id,
                    MemberID: Number(req.params.id),
                }
            )
        });
        console.log('success')
        res.send(200)
    } catch (err) {
        console.log(err)
        res.send(500)
    }
})

// {
//     "gatewayid": 1018,
//     "deviceid": 2,
//     "type": 1, // 1=usage, 2=error
//     "volt": 220,
//     "watt": 60,
//     "batt": 75,
//     "bright": 99,
//     "message": "success", // error
//     "timestamp": "2025-01-21 09:31:50"
// }

router.post('/logs', async (req, res) => {
    const { }=req.body
    try {
        console.log(req.body)
        res.sendStatus(200)
    } catch (err) {
        console.log(err);
    }
})


module.exports=router;