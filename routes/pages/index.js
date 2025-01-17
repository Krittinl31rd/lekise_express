const express=require("express");
const router=express.Router();

router.get("/login", (req, res) => {
    res.render('login', {
        layout: false,
        title: 'Login page',
        messages: req.flash()
    })
})

router.get('/test', (req, res) => {
    res.render('controller', {
        layout: false,
        messages: req.flash()
    })
})


module.exports=router;