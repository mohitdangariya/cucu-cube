
var mysql = require('mysql2');

var express = require('express');

var app = express();

var bodyParser = require('body-parser');

const ejs = require('ejs');




app.use(bodyParser.urlencoded({ extended: true }));

var connection = mysql.createConnection({

  host: 'localhost',

  user: 'root',

  password: 'root',

  database: 'job_application'

});

app.set('view engine', 'ejs');

connection.connect();



app.get('/', function (req, res) {


  var sql6 = `select * from candidate`;

  connection.query(sql6, function (err, result) {

    if (err) throw err;

    res.render('jobapplication.ejs', { data: result });

  })

})


// delacre a variable from the database;

app.post('/job', function (req, res) {

  let ref_id;

  var cfname = req.body.candidatefname;

  var clname = req.body.candidatelname;

  var cemail = req.body.candidate_email;

  var caddress = req.body.candidate_address;

  var ccontact = req.body.candidate_contact;

  var ccity = req.body.ct;

  var cstate = req.body.state;

  var cgender = req.body.gender;

  var czipcode = req.body.zipcode;

  var cdesignation = req.body.designation;

  var crelationship = req.body.relationship;

  var cdob = req.body.candidate_dob;

  var sql = `insert into candidate (candidate_fname,candidate_lname,candidate_email,candidate_address,candidate_contact,candidate_city,candidate_state,gender,zipcode,candidate_dob,relationship,designation) values
  ('${cfname}','${clname}','${cemail}','${caddress}','${ccontact}', '${ccity}','${cstate}','${cgender}',
   '${czipcode}','${cdob}','${crelationship}','${cdesignation}')`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    ref_id = result.insertId;


    // acadamic master 
    var coursename = req.body.coursename;
    var board = req.body.board;
    var percentage = req.body.percentage;
    var passingyear = req.body.passingyear;
    var sql7 = `insert into acadamic_master (coursename,board,percentage,passingyear,candidate_id)values('`;
    if(typeof(coursename)=="string")
{
sql7 +=`${coursename}','${board}','${percentage}','${passingyear}','${ref_id}')`
}
else{
for(i=0;i<coursename.length;i++){
  sql7 +=`${coursename[i]}','${board[i]}','${percentage[i]}','${passingyear[i]}','${ref_id}')`
if(i !=coursename.length-1){
sql7 += `,('`;
}
}
}
             
    connection.query(sql7, function (err, result1) {

      if (err) throw err;

      console.log(result1);

      console.log('record inserted successfully');
    })



    // experince master
    var companyname = req.body.company_name;
    var position = req.body.company_position;
    var joiningdate = req.body.joining_date;
    var leavingdate = req.body.leaving_date;
    var ctc = req.body.ctc;
    console.log(companyname,position,joiningdate,leavingdate,ctc);
    var sql8 = `insert into experince_master (company_name,company_position,joining_date,leaving_date,ex_createdate,ctc,
                candidate_id)
    values('${companyname}','${position}', '${joiningdate}', '${leavingdate}',NOW(),${ctc},${ref_id})`;

    connection.query(sql8, function (err, result2) {

      if (err) throw err;

      console.log(result2);

      console.log('record inserted successfully');

    })

    // reference master

    var refname = req.body.ref_name;
    var refcontact = req.body.ref_contact;
    var refemail = req.body.ref_email;

    console.log(ref_id);
    var sql12 = `insert into reference_master (ref_name,ref_contact,ref_email,candidate_id) 
    values('${refname}','${refcontact}','${refemail}',${ref_id})`;
    connection.query(sql12, function (err, result) {

       if (err) throw err;
       console.log(result);
       console.log('reference record inserted successfully');




      // language master


      var c_lan = req.body.c_lan;
      for (k = 0; k < c_lan.length; k++) {
        var c_all = req.body[c_lan[k]];
        var sql11 = `insert into language_master (l_name,l_value,l_createdate,candidate_id)
      values('${c_lan[k]}','${c_all}', NOW(), ${ref_id})`;
        connection.query(sql11, function (err, result) {
          if (err) throw err;
          console.log(sql11);
          console.log(result); 
          console.log('language record inserted successfully');
        })
      }

      // technologies_master
      var c_tech = req.body.c_tech;
      console.log(c_tech);

      for (l = 0; l < c_tech.length; l++) {
        var c_alltech = req.body[c_tech[l]]
        var sql12 = `insert into technology_master (tech_name ,tech_value,tech_createdate,candidate_id)
                       values('${c_tech[l]}','${c_alltech}',NOW(),${ref_id})`;
        connection.query(sql12, function (err, result) {
          if (err) throw err;
          console.log(sql12);
          console.log(result);
          console.log('technologies record inserted successfully');
        })
      }

      // preference_master

      var location = req.body.p_location;

      var noticeperiod = req.body.p_noticenotic;
      var cureentctc = req.body.p_currentctc;
      var p_expactedctc = req.body.p_expactedctc;
      var department = req.body.p_department;
      var sql9 = `insert into preferance_master (p_location,p_noticeperiod,p_expactedctc,p_currentctc,p_department,candidate_id) values 
  ('${location}',${noticeperiod},${p_expactedctc},${cureentctc},'${department}',${ref_id})`;
      connection.query(sql9, function (err, result3) {
        if (err) throw err;
        console.log(result3);
        console.log(' preference record inserted successfully');
        var sql10 = `select * from candidate`;
        connection.query(sql10, function (err, result4) {
          if (err) throw err;
          console.log(result4);
          res.render('searchingjob', { data: result4 });

        });
      });
    })
  });
});

var resultcombo = [];

app.get('/job', (req, res) => {

  var sql2 = `select option_key from option_master where select_id=1`;

  connection.query(sql2, (err, result) => {

    if (err) throw err;

    resultcombo[0] = result;

    // console.log( resultcombo[0]);

  })
  
  var state_ans;
  var state =`select * from state_master`;
  connection.query(state,function(err,result){
  if (err) throw err;
  state_ans = result;

})
  var sql3 = `select option_key from option_master where select_id=2`;

  connection.query(sql3, (err, result1) => {

    if (err) throw err;

    resultcombo[1] = result1;

    // console.log(resultcombo[1]);

  })

  var sql4 = `select option_key from option_master where select_id=5`;

  connection.query(sql4, (err, result2) => {



    if (err) throw err;

    resultcombo[2] = result2;

    // console.log(resultcombo[2]);

  })
  // 
  var sql5 = `select option_key from option_master where select_id=6`;

  connection.query(sql5, (err, result3) => {

    if (err) throw err;

    resultcombo[3] = result3;

    // console.log(resultcombo[3]);

  })

  var sql6 = `select option_key from option_master where select_id=7`;

  connection.query(sql6, (err, result4) => {

    if (err) throw err;

    resultcombo[4] = result4;


    

    // console.log(resultcombo[4]);



  })

  var sql8 = `select option_key from option_master where select_id=9`;

  connection.query(sql8, (err, result6) => {

    if (err) throw err;

    resultcombo[6] = result6;


  })

  var sqlx = `select option_key from option_master where select_id=10`;

  connection.query(sqlx, (err, result7) => {


    if (err) throw err;

    resultcombo[7] = result7;
  })




  // technology

  var sqla = `select option_key from option_master where select_id=8`;

  connection.query(sqla, (err, result5) => {
    if (err) throw err;

    resultcombo[5] = result5;
    // console.log(resultcombo[5]);
    console.log(state_ans);
    res.render('jobapplication.ejs', { data: resultcombo, state_ans });


  });
})

app.post('/search', (req, res) => {

  str = req.body.search;
  // sign = req.query.sign;
  // console.log(sign);
  console.log(str);

  let symbol = ['$', '&', '#', '~', '@'];
  let newStr = '';

  var count = 0;

  for (var i = 0; i < str.length; i++) {

    if (symbol.includes(str[i])) {
      newStr += " " + str[i];
      count++;
    } else {
      newStr += str[i];
    }
  }
  


  //  spllit function use for searching 



  var splitarr = newStr.split(' ');
  console.log(splitarr);
  var queryans = 'where';

  for (var j = 0; j < splitarr.length; j++) {

    if (splitarr[j][0] == '$') {

      count--;
      if (count) {
        queryans += ` candidate_fname LIKE '${splitarr[j].substring(1)}%'
and`
      } else {
        queryans += ` candidate_fname LIKE '${splitarr[j].substring(1)}%'
`
      }
    }


    if (splitarr[j][0] == '&') {

      count--;
      if (count) {
        queryans += ` candidate_lname LIKE '${splitarr[j].substring(1)}%'
and`
      } else {
        queryans += ` candidate_lname LIKE '${splitarr[j].substring(1)}%'
`
      }
    }


    if (splitarr[j][0] == '#') {

      count--;
      if (count) {
        queryans += ` candidate_email LIKE '${splitarr[j].substring(1)}%'
and`
      } else {
        queryans += ` candidate_email LIKE '${splitarr[j].substring(1)}%'
`
      }
    }


    if (splitarr[j][0] == '~') {

      count--;
      if (count) {
        queryans += ` candidate_contact LIKE '${splitarr[j].substring(1)}%' and`
      } else {
        queryans += ` candidate_contact LIKE '${splitarr[j].substring(1)}%' `
      }
    }

    if (splitarr[j][0] == '@') {

      count--;
      if (count) {
        queryans += ` candidate_city LIKE  '${splitarr[j].substring(1)}%' and`
      } else {
        queryans += ` candidate_city LIKE '${splitarr[j].substring(1)}%'  `
      }
    }
  }


  console.log(queryans);

  connection.query(`select  candidate_fname,candidate_lname,candidate_email,candidate_contact,candidate_city from candidate ${queryans};`, (err, result1) => {

    res.render('searchingjob', { data: result1 });
  });


});


// render data for the backend 


app.get('/state',function(req,res){
  var state =`select * from state_master`;
connection.query(state,function(err,result){
  if (err) throw err;
  console.log(result);
  res.render('state', { data: result });
})
})
  
app.post('/job', function(req,res){
var candidate = `select * from candidate_master where name = 'hetal'`;
connection.query(state,function(err,result){
  if(err) throw err;
  console.log (result);
  res.render('state', {data: result})
})
})


app.get('/changecity',(req,res)=>{

var id =req.query.state_id
console.log(id);
 var city = `select city_value from city_master where state_id =${id}`;
  connection.query(city,function(err,result){
    if (err) return console.log(err);
    res.json(result);
  })
})


app.get('/show',(req,res)=>{
     var sql13 =`select * from candidate where candidate_id != 1`;
     connection.query(sql13,(err,result) =>{
      if(err) throw err;
      // console.log(result);
      res.render('searchingjob.ejs', {data: result});
     })
})


app.get('/delete',(req,res) => {
  var id = req.query.id;
  console.log(id);
  var sql14 = `update candidate set isdeleted = 1 where candidate_id = '${id}'`;
  // var sql14 = `delete from candidate where candidate_id = ${id};
  connection.query(sql14,(err,result) => {
    if (err) throw err;
    console.log(err);
    console.log(result);
    res.redirect('/show');
  })



})

app.get("/deleterecord",(req,res)=>{
  var candidate_id=req.query.candidate_id;
  
  conn.query(`update candidate set isdeleted= 1 where
  candidate_id in (${candidate_id})`,(err,result)=>{
  if(err) throw err;
  res.redirect('/show');
  })
  })

app.listen(3000, function () {

  console.log('Server is running on port 3000');

})



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

 
 
 
 
 

































