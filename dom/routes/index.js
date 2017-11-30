var express = require('express');
var router = express.Router();
var async=require('async');
var mongodb=require('mongodb').MongoClient;
var db_str='mongodb://localhost:27017/dome'
var ObjectID=require('mongodb').ObjectID;
//coll.remove({_id:ObjectID('5a1e4d34f1d54b112ccc7642')})
// /* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title:req.session.user});//显示主页登录人员
});
router.get('/one', function(req, res) {
    res.render('one', {});
});
router.get('/two', function(req, res) {
    res.render('two', {});
});
router.get('/liu', function(req, res) {//分页缓存

    mongodb.connect(db_str,function(err,db){
        //	页码
        let paged=req.query['paged'];
        paged=paged?paged:1;
//	每页展示的数据量
        let pagesize=3;
//	总的页数
        let pagez=0;

        let zong=0;

        if(err){
            console.log(err)
        }else{
            console.log('success')
            //插入数据与分页
            db.collection("liu",function (err,coll) {

                async.series([
                    function (callback) {
                        coll.find().toArray(function (err,data) {
                             zong=data.length;//留言总数
                             pagez=Math.ceil(zong/pagesize);//总的页数
                        })
                        callback(null,'');
                    },
                    function (callback) {
                        coll.find().sort({_id: -1}).skip((paged - 1) * pagesize).limit(pagesize).toArray(function (err, result) {
                            callback(null, result)
                        })
                    }
                ],function (err,result) {
                    console.log(paged)
                    res.render("liu",{result:result[1],pagez:pagez,paged:paged,pagesize:pagesize})
                    }
                )

            })
        }
        db.close();
    })
    //数据库关闭
});
router.get('/rtwo', function(req, res) {//退出登录状态
    req.session.destroy(function (err) {
        if(err){
            console.log(err)
        }else {
            res.redirect('/')
        }
    })
});











    router.get('/shan', function (req, res) {//删除用户
        let id = req.query['id'];
        mongodb.connect(db_str, function (err, db) {
        console.log(id)
        db.collection("user", function (err, coll) {
            coll.remove({name: id});
            res.send("1");
            db.close();
        })
    })
})


router.get('/xiangqing', function(req, res) {//详情
    mongodb.connect(db_str, function (err, db) {
        let id = req.query['id']-0;
        db.collection("liu", function (err, coll) {
            coll.find({}).sort({_id: -1}).toArray(function (err, result) {
                console.log(id);
                res.render('xiangqing', {result:result[id]});
                db.close();
            })
        })

    })

})


router.get("/three",function (req,res) {
    let conn = req.query['title'];
    let cla = req.query["class"];
    if (!conn) {
        conn = "shou"
    }

    mongodb.connect(db_str, function (err, db) {
        let zz = 0;
        let zchu = 0;
        let zzhong = 0;
        let zgao = 0;
        let xuezong=0;
        let xz1=0;
        let xz2=0;
        let xz3=0;
        let xz4=0;
        let xz5=0;
        let xz6=0;
        var brr=[];
        let paged=req.query['paged'];
        paged=paged?paged:1;
//	每页展示的数据量
        let pagesize=3;
        let xpagesize=6;//学生一页展现的数量
//	总的页数
        let pagez=0;

        let zong=0;
        if (err) {
            console.log(err)
        } else {
            console.log('success')
            if (conn == "shou") {
                // 获取学生信息
                db.collection("xuesheng",function (err ,coll) {
                    coll.find({}).toArray(function (err,data) {
                        xuezong=data.length;
                       for (var i in data){
                           console.log(data[i].class)
                           if(data[i].class=="1"){
                               xz1=xz1+1;
                           }
                           if(data[i].class=="2"){
                               xz2=xz2+1;
                           }
                           if(data[i].class=="3"){
                               xz3=xz3+1;
                           }
                           if(data[i].class=="4"){
                               xz4=xz4+1;
                           }
                           if(data[i].class=="5"){
                               xz5=xz5+1;
                           }
                           if(data[i].class=="6"){
                               xz6=xz6+1;
                           }
                       }
                    })
                })

                // 获取新闻信息
                db.collection("new",function (err ,coll) {
                    coll.find({}).sort({_id:-1}).limit(5).toArray(function (err,data) {
                        brr=data;
                        console.log(data)
                    })
                })


                    //获取老师信息
                db.collection("user", function (err, coll) {
                    async.series([
                        function (callback) {
                            coll.find({}).toArray(function (err, data) {
                                zz = data.length;//人员总数
                                console.log(zz)
                            })
                            callback(null, "");
                        },
                        function (callback) {
                            coll.find({xuan: "1"}).toArray(function (err, data) {
                                zchu = data.length;
                                console.log(zchu)
                            })
                            callback(null, "")
                        },
                        function (callback) {
                            coll.find({xuan: "2"}).toArray(function (err, data) {
                                zzhong = data.length;
                                console.log(zzhong)
                            })
                            callback(null, "")
                        },
                        function (callback) {
                            coll.find({xuan: "3"}).toArray(function (err, data) {
                                zgao = data.length;
                                callback(null, zgao);//最后的一个必须是把callback放在函数里面
                            })

                        }
                    ], function (err, result) {
                        console.log(result)
                        console.log(brr);
                        res.render("three", {
                            title: "",
                            name: req.session.user,//用户名
                            zz: zz,//用户总数
                            zchu: zchu,//初级教师总数
                            zzhong: zzhong,//中级
                            zao: zgao,//高级
                            xuezong:xuezong,//学生总数
                            xz1:xz1,//一年级总数
                            xz2:xz2,//二年级总数
                            xz3:xz3,//三年级总数
                            xz4:xz4,//4总
                            xz5:xz5,//5总
                            xz6:xz6,//6总
                            nes:brr//新闻列表
                        })

                    })
                })


            }     //首页渲染
            if (conn == "xiang") {

                db.collection("user",function (err ,coll) {



                    async.series([
                        function (callback) {
                            coll.find().toArray(function (err,data) {
                                zong=data.length;//留言总数
                                pagez=Math.ceil(zong/pagesize);//总的页数
                            })
                            callback(null,'');
                        },
                        function (callback) {
                            coll.find().sort({_id: -1}).skip((paged - 1) * pagesize).limit(pagesize).toArray(function (err, result) {
                                callback(null, result)
                            })
                        }
                    ],function (err,result) {
                        console.log(paged);
                        res.render("three",{title: "xiang",
                            name: req.session.user,
                            yonghu:result[1],
                            pagez:pagez,
                            paged:paged,
                            pagesize:pagesize})
                    })

                    })

            }


            if (conn == "xuesheng") {
                    //链接学生数据库
                db.collection("xuesheng",function (err ,coll) {


                    async.series([
                        function (callback) {
                            coll.find().toArray(function (err,data) {
                                zong=data.length;//学生总数
                                pagez=Math.ceil(zong/xpagesize);//总的页数
                            })
                            callback(null,'');
                        },
                        function (callback) {
                        if(cla){
                            coll.find({class:cla}).sort({_id: -1}).skip((paged - 1) * xpagesize).limit(xpagesize).toArray(function (err, result) {
                                callback(null, result)
                            })
                        }else {
                            coll.find().sort({_id: -1}).skip((paged - 1) * xpagesize).limit(xpagesize).toArray(function (err, result) {
                                callback(null, result)
                            })
                        }
                        }
                    ],function (err,result) {
                        console.log(result[1]);//选择1 是因为第一个是空数组
                        res.render("three",{title: "xuesheng",
                            name: req.session.user,
                            xuesheng:result[1],
                            pagez:pagez,
                            paged:paged,
                            pagesize:xpagesize
                            }
                        )
                    })

                })

            }



















            db.close();
        }


    })
})



















router.get("/jiaoxiang",function (req,res) {          //查看教师
    let id=req.query["id"]-0;
    mongodb.connect(db_str, function (err, db) {
        console.log(id)
        db.collection("user", function (err, coll) {
            coll.find({}).sort({_id:-1}).toArray(function (err,data) {
                console.log(data[id])
               res.render("jiaoxiang",{data:data[id]})
            });

            db.close();
        })
    })

})



router.get("/update",function (req,res) {          //更新信息
    let id=req.query["id"]-0;
    mongodb.connect(db_str, function (err, db) {
        console.log(id)
        db.collection("user", function (err, coll) {
            coll.find({}).sort({_id:-1}).toArray(function (err,data) {
                console.log(data[id])
                res.render("update",{data:data[id]})
            });

            db.close();
        })
    })

})



router.get("/cha",function (req,res) {          //搜索查看教师
    let id=req.query["id"];//用户名
    mongodb.connect(db_str, function (err, db) {
        console.log(id)
        db.collection("user", function (err, coll) {
            coll.find({_id:ObjectID(id)}).toArray(function (err,data) {
                console.log(data[0])
                res.render("jiaoxiang",{data:data[0]})
            });
            db.close();
        })
    })

})






router.get("/supdate",function (req,res) {          //搜索更新信息
    let id=req.query["id"];
    mongodb.connect(db_str, function (err, db) {
        console.log(id)
        db.collection("user", function (err, coll) {
            coll.find({_id:ObjectID(id)}).toArray(function (err,data) {
                console.log(data[0])
                res.render("update",{data:data[0]})
            });

            db.close();
        })
    })

})






router.get("/xupdate",function (req,res) {          //更新信息
    let id=req.query["id"];
    mongodb.connect(db_str, function (err, db) {
        console.log(id)
        db.collection("xuesheng", function (err, coll) {
            coll.find({_id:ObjectID(id)}).toArray(function (err,data) {
                console.log(data[0])
                res.render("xupdate",{data:data[0]})
            });

            db.close();
        })
    })

})


router.get('/xshan', function (req, res) {//删除用户
    let id = req.query['id'];
    mongodb.connect(db_str, function (err, db) {
        console.log(id)
        db.collection("xuesheng", function (err, coll) {
            coll.remove({_id: ObjectID(id)});
            res.send("1");
            db.close();
        })
    })
})

router.get("/xzeng",function (req,res) {
    res.render("xzeng",{})
})





module.exports = router;
