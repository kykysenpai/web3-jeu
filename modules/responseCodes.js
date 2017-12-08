exports.errorCodes = [
    {"id":"mdpRegexKo", "code" : "MDP_REGEX_KO", "status" : 400, "message" : "Le mot de passe doit comporter entre 4 et 8 caractères."},
    {"id":"mdpKo", "code" : "MDP__KO", "status" : 400, "message" : "Le mot de passe n'est pas correct."},
    {"id":"playerNotFound", "code" : "PLAYER_NOT_EXISTS", "status" : 400, "message" : "Le joueur possédant ce login n'existe pas."},
    {"id":"inscriptionKo", "code" : "INSCRIPTION_KO", "status" : 400, "message" : "L'inscription a échoué."},
    {"id":"errFind", "code" : "ERROR_FIND_MONGO", "status" : 400, "message" : "Find player a renvoyé une erreur."},
    {"id":"DbKO", "code" : "DB_KO", "status" : 400, "message" : "La base de données ne répond pas."},
    {"id":"loginExists", "code" : "LOGIN_EXISTS", "status" : 400, "message" : "Ce login est deja présent, connectez vous ou choissisez un autre login."},
    {"id":"ErrCreate", "code" : "ERR_CREATE", "status" : 400, "message" : "Erreur mongoose create"}
];

exports.okCodes = [
    {"id":"mdpOk", "code" : "MDP_REGEX_OK", "status" : 200, "message" : "Mot de passe correct."},
    {"id":"inscriptionOk", "code" : "INSCRIPTION_OK", "status" : 201, "message" : "L'inscription a réussi."},
    {"id":"connexionOk", "code" : "INSCRIPTION_OK", "status" : 201, "message" : "La connexion a réussi. Bienvenue"},
    {"id":"findOk","code":"PLAYERFOUND","status": 200, "message":"PLayer trouvé et infos passée"}
];

