const express = require("express");
const router = express.Router();
const database = require("../config/database");
const validasi_data = require("./validasi_data");
const verifikasi_validasi_data = require("../middleware/verifikasi_validasi_data");

router.get('/all', async (req,res) =>{
    try {
        const result = await database.select("*").from('petugas');
        if(result.length > 0){
            return res.status(200).json({
                status :1,
                message : "berhasil",
                result : result
            })
        }else{
           return res.status(400).json({
               status : 0,
               message : "data tidak ditemukan",
          })
        }   
    } catch (error) {
        return res.status(500).json({
            status : 0,
            message : error.message
        })
    }
});

router.post('/simpan', validasi_data.data, verifikasi_validasi_data, async (req,res) =>{
    const data = req.body;
    const input = {
        ...data,
        status: "on"
    }
    try {
        const simpan = await database("petugas").insert(input);
        if(simpan){
            return res.status(200).json({
                status : 1,
                message : "Berhasil",
                result : {
                    id_add : simpan[0],
                    ...input
                }
            })
        }else{
           return res.status(400).json({
               status : 0,
               message : "gagal simpan",
          })
        }   
    } catch (error) {
        return res.status(500).json({
            status : 0,
            message : error.message
        })
    }
});

router.put('/edit/:id_petugas',validasi_data.edit_data,verifikasi_validasi_data, async (req,res) =>{
    const data = req.body;
    try {
        const result = await database("petugas").where('id_petugas',req.params.id_petugas).first();
        if (result){
            await database("petugas").update(data).where('id_petugas',req.params.id_petugas);
            return res.status(200).json({
                status : 1,
                message : "Berhasil"
            })
        } else {
            return res.status(400).json({
                status : 0,
                message : "Data tidak ditemukan",
            })
        }
    } catch (error) {
        return res.status(500).json({
            status : 0,
            message : error.message
        });
    }
});

router.delete('/delete/:id_petugas', async (req,res) =>{
    try {
        const update = await database("petugas").update("status", "on").where('id_petugas' ,req.params.id_petugas);
        if(update){
            return res.status(200).json({
                status :1,
                message : "berhasil",
            })
        }else{
           return res.status(400).json({
               status : 0,
               message : "gagal",
          })
        }   
    } catch (error) {
        return res.status(500).json({
            status : 0,
            message : error.message
        })
    }
});


module.exports = router;