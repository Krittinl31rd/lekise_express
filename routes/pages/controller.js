const express=require("express");
const router=express.Router();
const { authMiddleware, authAdmin }=require('../../middleware/auth')
const sql=require('../../config/sql');

const memberLayout="../views/layouts/member";

router.get("/controller", authMiddleware, async (req, res) => {
    const { site }=req.store;
    let devicesByGateway=[]
    const data=await createSiteGatewayDevices(site)
    const sitesData=data.devices.filter(item => item.GatewayID!==undefined);
    const deviceData=data.devices.filter(item => item.MemberID!==undefined);

    sitesData.forEach(site => {
        const matchingDevices=deviceData.filter(device => device.MemberID===site.GatewayID);

        const devicesWithMarkers=matchingDevices.map(device => {
            const marker={};
            return {
                ...device,
                marker
            };
        });

        devicesByGateway.push({
            ...site,
            devices: devicesWithMarkers,
        });
    });

    res.render('map', {
        layout: memberLayout,
        tab: 'controller',
        title: 'LeKise The Lamp',
        store: req.store,
        currentRoute: '/controller',
        data: devicesByGateway,
        messages: req.flash()
    })
})


const createSiteGatewayDevices=async (site) => {
    let data={
        site: {
        },
        contract: [],
        group: [],
        devices: []
    }

    const [siteData]=await sql.read('LampSite',
        'SiteID = :SiteID',
        { SiteID: site }
    )
    data.site=siteData

    const groupData=await sql.read('LampGroup',
        'SiteID = :SiteID',
        { SiteID: site }
    )
    data.group=groupData

    const lampContract=await sql.read(
        'LampContract',
        'SiteID = :SiteID',
        { SiteID: site },
    );
    data.contract=lampContract;

    const contractDevice=await sql.read(
        'LampContractDevice',
        'LampContractDevice.SiteID = :SiteID',
        { SiteID: site },
        [
            {
                type: 'INNER',
                table: 'LampContract',
                on: 'LampContractDevice.SiteID = LampContract.SiteID AND LampContractDevice.ContractID = LampContract.ContractID'
            }
        ]
    );

    const groupDevice=await sql.read(
        'LampGroup',
        'LampGroup.SiteID = :SiteID',
        { SiteID: site },
        [
            {
                type: 'INNER',
                table: 'LampGroupDetail',
                on: 'LampGroup.SiteID = LampGroupDetail.SiteID AND LampGroup.GroupID = LampGroupDetail.GroupID'
            }
        ]
    )


    const promises=contractDevice.map(async (cd) => {
        data.devices.push(cd);
        const devices=await sql.read('Devices',
            'MemberID = :MemberID AND DeviceStyleID = :DeviceStyleID',
            {
                MemberID: cd.GatewayID,
                DeviceStyleID: 3
            });

        devices.forEach(d => {
            data.devices.push(d)
        })
    })
    await Promise.all(promises);



    const devicesControl=await sql.read(
        'DevicetControl'
    )

    const controlsMap=devicesControl.reduce((map, control) => {
        const key=`${control.MemberID}-${control.DeviceID}`;
        if (!map[key]) {
            map[key]=[];
        }
        map[key].push(control);
        return map;
    }, {});

    const groupMap=groupDevice.reduce((map, group) => {
        const key=`${group.GatewayID}-${group.DeviceID}`;
        map[key]={ GroupID: group.GroupID, GroupName: group.GroupName };
        return map;
    }, {});


    data.devices=data.devices.map((device) => {
        const controlsKey=`${device.MemberID}-${device.DeviceID}`;
        const controls=controlsMap[controlsKey]||undefined;

        const groupKey=`${device.MemberID}-${device.DeviceID}`;
        const groupInfo=groupMap[groupKey]||{};

        return {
            ...device,
            ...groupInfo,
            controls,
        };
    });

    return data;
}



module.exports=router;