/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/ 

const { Router } = require('express');
const router = Router();

const { createUser, renewToken, loginUser } = require('../controllers/auth');

const{ check } =require('express-validator')

const { validarCampos } = require('../middlewares/field-valitators');
const { validarJWT } = require('../middlewares/jwt-valitators')


router.post(
    '/new',
    [
    // Middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El mail es incorrecto').isEmail(),
        check('password', 'El password debe contener mas de 6 caracteres').isLength({ min:6 }),
        validarCampos
    ],    
    createUser);

router.post(
    '/',
    [
    // Middlewares
        check('email', 'El mail es incorrecto').isEmail(),
        check('password', 'El password debe contener mas de 6 caracteres').isLength({ min:6 }),
        validarCampos
    
    ],  
    loginUser);

router.get('/renew',validarJWT, renewToken);


module.exports = router;


