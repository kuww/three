var express = require('express');
var router = express.Router();
var mongodb=require('mongodb').MongoClient;
var db_str='mongodb://localhost:27017/dome'
var multiparty=require("multiparty")
var fs=require("fs")
var upload=require("./upload")



var ObjectID=require('mongodb').ObjectID;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/one',function (req,res) {//注册
    var str=req.body;
    var name=req.body.name;
    console.log(name);
    console.log(str);
    mongodb.connect(db_str,function(err,db){
        if(err){
            console.log(err);
        }else{
            console.log('success')
            //插入数据
            db.collection("user",function (err,coll) {
                    coll.find({name:name}) .toArray(function (err,result1) {
                        console.log(result1)
                        if(result1.length>0){
                            res.send("0")
                        }else {
                            coll.insert(str,function(result){
                            })
                            res.send("1");
                        }
                        db.close()
                    })

            })
            //数据库关闭

        }
})
    })

router.post('/two',function (req,res) {//登录
    var str=req.body;
    var user=req.body['name'];
    console.log(str);
    mongodb.connect(db_str,function(err,db){
        if(err){
            console.log(err)
        }else{
            console.log('success')
            //插入数据
            db.collection("user",function (err,coll) {
                coll.find(str).toArray((err,result)=>{
                    if(result.length>0){
                        console.log([result[0].name,result[0].xuan]);
                    req.session.user=[result[0].name,result[0].xuan];//记录登录状态
                        res.send("1");
                        }else {
                        res.send("0");
                        }
                })
                db.close();
            })
            //数据库关闭

        }
    })
})
router.post("/liu",function (req,res) {//往数据库传送留言
    var stt=req.body;
    console.log(stt);
    mongodb.connect(db_str,function(err,db){
        if(err){
            console.log(err)
        }else{
            console.log('success')
            //插入数据
            db.collection("liu",function (err,coll) {
                coll.insert(stt,function(result){
                    res.send("1")
                })

                db.close();
            })
            //数据库关闭

        }
    })

})

router.post("/update",function (req,res) {
    var stt=req.body["name"];
    var house=req.body["house"];
    var work=req.body["work"];
    var poser=req.body["poser"];
    console.log(stt);
    mongodb.connect(db_str,function(err,db){
        if(err){
            console.log(err)
        }else{
            console.log('success')
            // 插入数据
            db.collection("user",function (err,coll) {
                coll.update({name: stt}, {$set: {house: house, work: work, poser: poser}}, false, true);
                res.send("1")
                    db.close();
            })
            // 数据库关闭

        }
    })

})


router.post("/uploadImg",function (req,res) {
    upload(req,res)
})


router.post("/sou",function (req,res) {
    var name=req.body["name"];
    console.log(name)
    mongodb.connect(db_str,function (err,db) {
        if(err){
            console.log(err)
        }else{
            console.log('success')
            //插入数据
            db.collection("user",function (err,coll) {
                coll.find({"name": {$regex: name, $options:'i'}}).toArray(function (err,data) {
                    console.log(data);
                    res.send(data)
                })

                db.close();
            })
            //数据库关闭

        }
    })
})



// 学生信息更新
router.post("/xupdate",function (req,res) {
    var stt=req.body["id"];
    var math=req.body["math"];
    var china=req.body["china"];
    console.log(stt);
    mongodb.connect(db_str,function(err,db){
        if(err){
            console.log(err)
        }else{
            console.log('success')
            // 插入数据
            db.collection("xuesheng",function (err,coll) {
                coll.update({_id:ObjectID(stt)}, {$set: {math: math, china: china}}, false, true);
                res.send("1")
                db.close();
            })
            // 数据库关闭

        }
    })

})





//学生信息增加
router.post("/xzeng",function (req,res) {
    var data=req.body;
    console.log(data);
    mongodb.connect(db_str,function(err,db){
        if(err){
            console.log(err)
        }else{
            console.log('success')
            // 插入数据
            db.collection("xuesheng",function (err,coll) {
                coll.insert(data,function (result) {

                })
                res.send("1")
                db.close();
            // 数据库关闭

        })
    }
    })

})






    module.exports = router;
