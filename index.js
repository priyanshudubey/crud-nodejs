const mysql = require('mysql');
const express = require('express');
var app = express();

const bodyparser = require('body-parser');
app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '12345',
    database : 'employee',
    multipleStatements : true
});

mysqlConnection.connect((err)=>{
    if(!err)
    console.log('Connections established');
    else
    console.log('Connection failed \n Error: '+JSON.stringify(err, undefined, 2));
});

app.listen(3000, ()=>console.log('Express server is running'));

//Get all employee
app.get('/employees', (req, res)=>{
    mysqlConnection.query('SELECT * FROM employe', (err, rows, fields)=>{
        if(!err)
        res.send(rows);
        //console.log(rows[0].EmpID);
        else
        console.log(err);
    })
});

//Get an emloyee
///employe/1
app.get('/employees/:id', (req, res)=>{
    mysqlConnection.query('SELECT * FROM employe WHERE EmpID = ?',[req.params.id], (err, rows, fields)=>{
        if(!err)
        res.send(rows);
        //console.log(rows[0].EmpID);
        else
        console.log(err);
    })
});

//Delete an employee
app.delete('/employees/:id',(req, res)=>{
    mysqlConnection.query('DELETE * FROM employe WHERE EmpID = ?', [req.params.id], (err, rows, fields)=>{
        if(!err)
        res.send('Data deleted');
        else
        res.send(err);
    })
});

//Insert an employees
app.post('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @EmpID = ?;SET @EmpName = ?;SET @EmpCode = ?;SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpID,@EmpName,@EmpCode,@Salary);";
    mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted employee id : '+element[0].EmpID);
            });
        else
            console.log(err);
    })
});


//Update an employee
app.put('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @EmpID = ?;SET @EmpName = ?;SET @EmpCode = ?;SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpID,@EmpName,@EmpCode,@Salary);";
    mysqlConnection.query(sql, [emp.EmpID, emp.EmpName, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            console.log(err);
    })
});