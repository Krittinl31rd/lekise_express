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


router.post('/login', async (req, res) => {
    const { email, password }=req.body
    try {
        // check email
        const [member]=await sql.read('Member',
            'Email = :email',
            { email: email },
            [
                { type: 'INNER', table: 'LampMemberRole', on: 'Member.MemberID = LampMemberRole.MemberID' },
            ]);
        if (!member) {
            req.flash('error', i18n.__('passwordInvalid'));
            return res.redirect("/");
        }
        // check password
        const isMatch=await bcrypt.compare(password, member.Password)
        if (!isMatch) {
            req.flash('error', i18n.__('passwordInvalid'));
            return res.redirect("/");
        }
        console.log(member)
        // create payload
        const payload={
            id: member.MemberID,
            email: member.Email,
            username: member.MemberName,
            role: member.RoleID,
            site: member.SiteID
        }
        // generate token
        jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) {
                return res.status(500).json({ message: "Server Error" })
            }
            res.cookie("token", token, { httpOnly: true });
            req.flash('success', i18n.__('loginSuccess'));
            res.redirect("/");
        })

    } catch (err) {
        console.log(err);
        res.status(500).send('Internet Server Error');
    }
})

router.post('/register', async (req, res) => {
    const { username, password, membername, email }=req.body
    try {
        // find already member
        const isMember=await sql.read('Member',
            'Username = :username OR email = :email',
            { username: username, email: email });
        if (isMember.length>0) {
            return res.status(400).json({ message: "username or email is already exits!!!" })
        }
        // hash password
        const hashPassword=await bcrypt.hash(password, 10)
        // created member
        const member=await sql.create('Member', {
            Username: username,
            Password: hashPassword,
            Membername: membername,
            Email: email,
            DeviceType: 1
        })
        res.status(200).json({
            message: "Register success!!!!",
        })
    } catch (err) {
        console.log(err);
        res.status(500).send('Internet Server Error')
    }
})

router.get('/logout', async (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
})


module.exports=router;