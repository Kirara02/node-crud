const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine','ejs')
app.set('views', 'views')

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'))
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'))

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'node_crud'
})

db.connect((err) => {
    if(err) throw err
    console.log('database connect..')

    app.get('/', (req, res) => {
        const sql = "select * from siswa"
        db.query(sql, (err, result) => {
            const users = JSON.parse(JSON.stringify(result))
            res.render('index', {users: users, title: 'Node CRUD'})
        })
    })

    app.post('/tambah', (req, res)=> {
        const Sql = `insert into siswa(nama,kelas) values ('${req.body.nama}','${req.body.kelas}');`
        db.query(Sql, (err, result) => {
            if(err) throw err
            res.redirect('/');
        })
    })

    app.post('/edit/:id', (req, res)=> {
        const Sql = `update siswa set nama='${req.body.nama}', kelas='${req.body.kelas}' where id='${req.params.id}';`
        db.query(Sql, (err, result) => {
            if(err) throw err
            res.redirect('/');
        })
    })

    app.get('/detail/:id', (req, res) => {
        const sql = `select * from siswa where id='${req.params.id}';`
        db.query(sql, (err, result) => {
            if(err) throw err
            const users = JSON.parse(JSON.stringify(result))
            res.json({
                'data' : users
            })
            console.log(users)
        })
    })

    app.get('/hapus/:id', (req, res) => {
        const deleteSql = `delete from siswa where id='${req.params.id}';` 
        db.query(deleteSql, (err, result) => {
            if(err) throw err
            res.redirect('/')
        })
    })

})


app.listen(5000, () => console.log('Server ready....'))