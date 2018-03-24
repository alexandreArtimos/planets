var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var PlanetaSchema = new Schema({
    nome: String,
    clima: String,
    terreno: String,
    quantidadeAparicoesFilmes: Number
});
 
module.exports = mongoose.model('Planeta', PlanetaSchema);