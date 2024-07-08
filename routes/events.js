
const { Router } = require('express');
const router = Router();

const { validarJWT } = require("../middlewares/jwt-valitators");
const { validarCampos } = require('../middlewares/field-valitators');
const { isDate } = require('../helpers/isDate');
const { check } = require('express-validator');


const { getEvents, createEvents, deleteEvents, updateEvents } = require('../controllers/events');


// Todas tienen que pasar por la validacion del JWT
router.use( validarJWT )
// router.use( validarCampos )


// Obtener eventos
router.get('/', getEvents)

// Crear un nuevo evento
router.post(
    '/', 
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','La fecha de inicio es obligatoria').custom(isDate),
        check('title','la fecha de fin es obligatoria').not().isEmpty(),
        validarCampos
    ],
    createEvents)


// Actualizar  evento
router.put('/:id', updateEvents)

// Borrar evento
router.delete('/:id', deleteEvents)

  
module.exports = router;