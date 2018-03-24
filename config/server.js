
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
/** Porta onde será executada a nossa aplicação */
var port = process.env.PORT || 8000;

//Configuração Base da Aplicação:
//====================================================================================
var mongoose = require('mongoose'); 
 
mongoose.connect('mongodb://@localhost:27017/dbPlanetas');

var Planeta = require('../app/models/planeta');
 
//Iniciando o Servidor (Aplicação):
//==============================================================
app.listen(port);
console.log('Iniciando a aplicação na porta ' + port);
 

//Rotas da nossa API:
//==============================================================
 
/* Instâncias das Rotas do Express */
var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'Seja Bem-Vindo a nossa API de Planetas' });
});
 

router.route('/planetas')
 
    /* 1) Método: Criar Planeta (acessar em: POST http://localhost:8000/api/planetas */
    .post(function(req, res) {

        var quantidadeAparicoesFilmes;
        let got = require('got');
 
        got('https://swapi.co/api/planets/?search=' + req.body.nome, { json: true })
        .then(function(response) {
          //console.log(response)
          var planeta = new Planeta();
 
          planeta.nome = req.body.nome;
          planeta.clima = req.body.clima;
          planeta.terreno = req.body.terreno;
          planeta.quantidadeAparicoesFilmes = response.body.results.length > 0 ? response.body.results[0].films.length : 0;
   
          planeta.save(function(error) {
              if(error)
                  res.send(error);
   
              res.json({'planeta' : planeta, message: 'Planeta criado com sucesso.' });
          });
        });

     
    })/* 2) Método: Selecionar Todos (acessar em: GET http://locahost:8000/api/planetas) */
    .get(function(req, res) {
        Planeta.find(function(err, planetas) {
            if(err)
                res.send(err);
 
            res.json(planetas);
        });
    });

// Rotas que irão terminar em '/planetas/:planeta_id' - (servem tanto para GET by Id, PUT, &amp; DELETE)
router.route('/planetas/:planeta_id')
    
    /* 3) Método: Selecionar Por Id (acessar em: GET http://localhost:8000/api/planetas/:planeta_id) */
    .get(function(req, res) {

        //Função para Selecionar Por Id e verificar se há algum erro:
        Planeta.findById(req.params.planeta_id, function(error, planeta) {
            if(error)
                res.send(error);

            res.json(planeta);
        });
    })  /* 4) Método: Excluir (acessar em: http://localhost:8000/api/planetas/:planeta_id) */
    .delete(function(req, res) {

        Planeta.remove({
        _id: req.params.planeta_id
        }, function(error) {
            if(error)
                res.send(error);

            res.json({ message: 'Planeta excluído com sucesso.'});
        });
    });

    // Rotas que irão terminar em '/planetas/:planeta_nome' - (servem tanto para GET by nome, PUT, &amp; DELETE)
router.route('/planetas/nome/:planeta_nome')
    
    /* 3) Método: Selecionar Por nome (acessar em: GET http://localhost:8000/api/planetas/nome/:planeta_nome) */
    .get(function(req, res) {
        //console.log(Planeta.schema.tree.nome);
        Planeta.findOne({'nome':req.params.planeta_nome}, function(error, planeta) {
            if(error)
                res.send(error);

            res.json(planeta);
        });
    }) 
/* Todas as nossas rotas serão prefixadas com '/api' */
app.use('/api', router);