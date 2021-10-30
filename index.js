//#region imports
    import express from 'express';
    import { readFile } from 'fs/promises';
    import path from 'path'
    import favicon from 'serve-favicon'

    import { fileURLToPath } from 'url';
    import { dirname } from 'path';

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
//#endregion

//#region constantes
    const json = JSON.parse(await readFile(new URL('./data/data.json', import.meta.url)));
    //const jsonArray = Object.keys(json).map(i => JSON.parse(json[Number(i)]));
    const app = express();
    const PORT = 3000;
//#endregion

//#region Middlewares
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    //disponibilizar pasta de forma statica
    app.use('/images/', express.static('images'));  
    app.use(favicon(path.join(__dirname, 'images', 'favicon.ico')))  
//#endregion


//#region endpoints comuns
    app.route('/item')

        .get((req, res) => {
            res.send(json)
        })

        .post((req, res) => {
            res.send(`a post request with /newItem route on port ${PORT}`)
        })

        .put((req, res) => {
            res.send(`a put request with /item route on port ${PORT}`)
        })

        .delete((req, res) => {
            res.send(`a delete request with /item route on port ${PORT}`)
        })
//#endregion

//#region Endpoints com parametros
    app.get('/item/:id', (req, res) => {
        res.send(json.find(x => x.id == req.params.id));
    });

    app.post('/item', (req, res) => {
        var index = json[json.length -1].id + 1;
        
        var newUser = {
            'id': index,
            'first_name': req.first_name,
            'last_name': req.body.last_name,
            'email': req.body.email,
            'gender': req.body.gender,
            'ip_address': req.body.ip_address            
        }

        json.push(newUser);

        console.log(json)
        
        res.send(json.find(x => x.id == newUser.id));
    });

    app.post('/urlencoded', (req, res) => {
        res.send(req.body);
    })
//#endregion

//#region Tratamento de erros

//erro retornando uma mensagem formatada com u mpouco de estilo
app.use((err, req, res, next) => {
    console.error('Ocorreu algum erro');
    res.send(`OCORREU ALGUM ERRO NO BACK <hr/> Stack do erro:<p style="color:red;">${err.stack}<p/> `);
})
//#endregion

app.listen(PORT, () => {
    console.log(`Your server is running on port ${PORT}`)
})