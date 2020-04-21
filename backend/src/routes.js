const { Router } = require('express');
const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

const routes = Router();

// Query Params: request.query(Filtros, Ordenação, Paginação e outros)
// Route Params: request.params(Identificar um recurso na alteraçaõ ou remoção)
// Body: request.body (Dados para criação ou alteração de um registro)

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);
routes.get('/devs/:github_username', DevController.read);
routes.put('/devs/:github_username', DevController.update);
routes.delete('/devs/:github_username', DevController.destroy);

routes.get('/search', SearchController.index)

// Exporta o module de routes
module.exports = routes;
