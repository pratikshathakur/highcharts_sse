const express = require('express');
const router=express.Router();
const mongoose = require('mongoose');
const Vote = require('../models/vote')
const events=require('events');
var eventEmitter = new events.EventEmitter();

router.get('/',(req, res)=>{
    Vote.find().then(votes=>res.json({success: true,votes:votes}))
});

router.get('/eventSource',(req, res)=>{
    res.set('content-type', 'text/event-stream');
    res.set('Connection','keep-alive');
    res.set('Cache-Control','no-cache');
    res.set('Access-Control-Allow-Origin','*');
    eventEmitter.on('voteSaved',(e)=>{
        res.write(`id: 1\ndata: ${e.vote}\n\n`);
    })
});

router.post('/',(req, res)=>{
    console.log(req.body.os);
    let vote_obj=new Vote({
        os:req.body.os,
        points:1
    })
    vote_obj.save().then((vote)=>{
        const vote_saved=JSON.stringify(vote);
        eventEmitter.emit('voteSaved',{vote:vote_saved});
        res.json({msg:vote_saved});
    })
    
})

module.exports =router;