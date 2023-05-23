import mysql from 'mysql'
import express, { query } from 'express'
import url from 'url'
import { Console } from 'console';
import cors from 'cors'

const connection = mysql.createConnection({
    host: "localhost", // "127.0.0.1"
    database: "test",
    user: "admin",
    password: "admin",
    multipleStatements: true
});


var app = express();
app.use(express.json());

const PORT = 3000;

app.listen(PORT, () => {
    console.log('SERVER  :  http://localhost:${PORT}');
    connection.connect((err) => {
        if (err) throw err;
        console.log("DATABASE CONNECTED");
    })
})


app.use(cors());


app.use("/all_account", (req, res) => {
    const sql_query = 'select * from  Bank'
    connection.query(sql_query, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

app.use("/create_account", (req, res) => {
    const sql_query = "INSERT INTO Bank (name, accno, accbal,credit) VALUES ('gokul', '108', '400', 'true')";
    connection.query(sql_query, (err, result) => {
        if (err) throw err;
        console.log('account created successfully');
        res.send(result);
    })
})

app.use("/get_account", (req, res) => {
    console.log(req.url);
    var accno = 101;
    var queryData = url.parse(req.url, true).query;
    console.log(queryData);
    const sql_query = 'SELECT * FROM Bank WHERE accno = ' + queryData.accno;
    console.log('SELECT * FROM Bank WHERE accno = ' + queryData.accno);
    connection.query(sql_query, (err, result) => {
        if (err) throw err;
        console.log("")
        res.send(result);

    })
})


app.use("/get_currentaccbal", (req, res) => {
    console.log(req.url);
    var accno = 101;
    var queryData = url.parse(req.url, true).query;
    console.log(queryData);
    const sql_query = 'SELECT name,accbal FROM Bank WHERE accno = ' + queryData.accno;
    console.log('SELECT accbal FROM Bank WHERE accno = ' + queryData.accno);
    connection.query(sql_query, (err, result) => {
        if (err) throw err;
        console.log("")
        res.send(result);

    })
})





app.use("/update", (req, res) => {
    console.log(req.url);
    var accno = 101;
    var queryData = url.parse(req.url, true).query;
    console.log(queryData);
    const sql_query = 'UPDATE Bank set accbal = ' + queryData.accbal + ' WHERE accno = ' + queryData.accno;
    console.log('UPDATE Bank set accbal = ' + queryData.accbal + 'WHERE accno = ' + queryData.accno);
    connection.query(sql_query, (err, result) => {
        if (err) throw err;
        console.log("Update unsuccessful");
        res.send(result);
    })
})


app.use("/transfer", (req, res) => {
    console.log(req.url);
    var queryData = url.parse(req.url, true).query;
    console.log(queryData);
    const sql_query = 'SELECT name,accbal FROM Bank WHERE accno = ' + queryData.toAcc;
    console.log('SELECT accbal FROM Bank WHERE accno = ' + queryData.toAcc);
    connection.query(sql_query, (err, result) => {
        if (err) throw err;
        console.log('result = ', result[0].accbal);
        console.log('queryData = ', queryData.amount);
        var new_accbal = result[0].accbal += + queryData.amount;
        console.log(new_accbal);
        const sql_query = 'UPDATE Bank set accbal = ' + new_accbal + ' WHERE accno = ' + queryData.toAcc;
        console.log('UPDATE Bank set accbal = ' + new_accbal + ' WHERE accno = ' + queryData.toAcc);
        connection.query(sql_query, (err, result) => {
            if (err) throw err;
            //    res.send(result);
            console.log(req.url);
            var queryData = url.parse(req.url, true).query;
            console.log(queryData);
            const sql_query = 'SELECT name,accbal FROM Bank WHERE accno = ' + queryData.fromAcc;
            console.log('SELECT accbal FROM Bank WHERE accno = ' + queryData.fromAcc);
            connection.query(sql_query, (err, result) => {
                if (err) throw err;
                console.log("Insufficient balance");
                console.log('result = ', result[0].accbal);
                console.log('queryData = ', queryData.amount);
                var new_accbal = result[0].accbal - queryData.amount;
                console.log(new_accbal);
                const sql_query = 'UPDATE Bank set accbal = ' + new_accbal + ' WHERE accno = ' + queryData.fromAcc;
                console.log('UPDATE Bank set accbal = ' + new_accbal + ' WHERE accno = ' + queryData.fromAcc);
                connection.query(sql_query, (err, result) => {
                    if (err) throw err;
                    res.send(result);
                   
                var sql_query = "INSERT INTO transaction_history (fromacc,toacc,amount,date) VALUES ?";
                const date = new Date();

                 let day = date.getDate();
                 let month = date.getMonth() + 1;
                 let year = date.getFullYear();


                   let currentDate = `${day}/${month}/${year}`;

                var values = [
                   [(queryData.fromAcc),(queryData.toAcc),(queryData.amount),(currentDate)]
                
                ];
                connection.query(sql_query, [values], function (err, result){
                    if (err) throw err;
                    console.log("Number of records inserted:" + result.affectedRows);
                })




                    })

                })
            })

        })


    })



    app.use("/delete_account", (req, res) => {
        console.log(req.url);
        var accno = 105;
        var queryData = url.parse(req.url, true).query;
        console.log(queryData);
        const sql_query = 'DELETE FROM Bank WHERE accno = ' + queryData.accno;
        console.log('DELETE FROM Bank WHERE accno = ' + queryData.accno);
        connection.query(sql_query, (err, result) => {
            if (err) throw err;
            res.send(result);
        })

    })
app.use("/transaction", (req, res) => {
    const sql_query = 'select * from  transaction_history'
    connection.query(sql_query, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})
   

app.use("/get_transaction", (req, res) => {
    console.log(req.url);
    var toAcc = 101;
    var queryData = url.parse(req.url, true).query;
    console.log(queryData);
    const sql_query = 'SELECT * FROM transaction_history WHERE toacc = ' + queryData.toAcc;
    console.log('SELECT * FROM transaction_history WHERE toacc = ' + queryData.toAcc);
    connection.query(sql_query, (err, result) => {
        if (err) throw err;
        console.log("")
        res.send(result);

    })
})



