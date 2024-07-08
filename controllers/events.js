const { response } = require("express");
const Event = require('../models/Event');


const getEvents = async (req, res = response) => {

    const events = await Event.find()
                              .populate('user','name') // .populate me expande el user, me da toda su info en el json

    return res.status(200).json({
        ok: true,
        events 
    })
}


const createEvents = async (req, res = response) => {

    const event = new Event(req.body)

    try{
        
        event.user = req.uid

        const savedEvent = await event.save()
        
        res.json({
            ok:true,
            event: savedEvent 
        })
        
    }catch(error){
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }
}


const updateEvents = async (req, res = response) => {

    const eventId = req.params.id
    const uid = req.uid

    try{

        const event = await Event.findById(eventId)

        if (!event) {
            res.status(404).json({
                ok: false,
                msg: 'No existe evento con ese id'
            })
        }

        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok:false,
                msg: 'No tiene privilegio de editar este evento'
            })
        }

        const temporalEvent = {
            ...req.body,
            user: uid
        }

        const updatedEvent = await Event.findByIdAndUpdate( eventId, temporalEvent, {new: true} )

        res.json({
            ok:true,
            event: updatedEvent
        })


    }catch(error){
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }

}

const deleteEvents = async (req, res = response) => {

    const eventId = req.params.id
    const uid = req.uid

    try{

        const event = await Event.findById(eventId)

        if (!event) {
            res.status(404).json({
                ok: false,
                msg: 'No existe evento con ese id'
            })
        }

        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok:false,
                msg: 'No tiene privilegio de borrar este evento'
            })
        }

        await Event.findByIdAndDelete(eventId) 
        res.json({
            ok:true,
        })

    }catch(error){
        console.log(error)
        res.status(404).json({
            ok:false,
            msg: 'No existe evento con ese id'
        })
    }



    
}



module.exports = {getEvents, createEvents, updateEvents, deleteEvents}
