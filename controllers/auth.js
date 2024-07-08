const{ response } = require('express');
const bcrypt = require('bcryptjs') 
const User = require('../models/User');

const { generarJWT } = require('../helpers/jwt')


const createUser = async (req,res =  response) => {

    const { email, password } = req.body;


    try{

        let user = await User.findOne({ email })

        if(user){
            return res.status(400).json({
                ok:false,
                msg: 'Un usuario existe con ese correo'
            })
        }

        user = new User(req.body)

        // Encriptar password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password , salt);

        await user.save(); 
       
        //Generar JWT
        const token = await generarJWT(user.id,user.name)


        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            ok:false,
            msg: 'Por favor hable con el administrador'
        })
    }



}

const loginUser = async (req, res = response) => {
    
    const { email, password } = req.body

    try{
        const user = await User.findOne({ email })
        console.log(user.id, user.name)
        if(!user){
            return res.status(400).json({
                ok:false,
                msg: 'Un usuario ingresado no existe'
            })
        }
        // Confirmar los passwords
        const validPassword = bcrypt.compareSync(password, user.password);

        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg: 'Password incorrecto'
            })
        }
        console.log(req)
        //generar nuesto JWT json web token
        const token = await generarJWT(user.id,user.name)

        res.status(200).json({
            ok:true,
            uid: user.id.toString(),
            name: user.name,
            token
        })

    }catch(error){
        res.status(500).json({
            ok:false,
            msg: 'Por favor hable con el administrador'
        })
    }     
}

const renewToken = async (req, res = response) => {
    
    const {uid, name} = req

    // generar un nuevo JWT 
    const token = await generarJWT(uid, name)


    res.status(200).json({
        ok: true,
        uid, 
        token
    })
}


module.exports = {createUser,loginUser,renewToken}