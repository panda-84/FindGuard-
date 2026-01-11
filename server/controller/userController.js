import { Users } from "../model/userModel.js";

export const getAll= async(req,res) =>{
    try{
        const user = await Users.findAll();
        res.status(200).send({data: user, message: "Data retrieved successfully"});
    }catch(error){
        res.status(500).send({message: error.message});
    }

}


export const save= async(req,res) =>{
    const body=req.body;
    console.log(body);
    try{
          const users= await Users.create(body);
          res.status(200).send({data: users, message: "Data saved successfully"});

    }catch(e){
        res.send({message: e.message});
    
        
    }
}

export const getById=async (req,res)=>{
     try{
        const{id=null}= req.params;
        const user=await Users.findOne({where:{id}});

        if(!user){
            res.status(500).send({message:"User Not Found"});
            return;
        }
        res.status(500).send({data:user,message:"Data Retreived Successfully"});
        }catch(e){
            res.status(500).send({message:e.message});
        }
}

export const updateById= async(req,res)=>{
    const body=req.body;
    console.log(body);
    try{
        const{id=null}= req.params;
        const user= await Users.findOne({where:{id}});

        if(!user){
            res.status(500).send({message:"User Not Found"});
            return;
        }

        user.customerName= body.customerName;
        user.customerEmail= body.customerEmail;
        user.customerPassword= body.customerPassword;
        user.customerPhone= body.customerPhone;
        user.customerDob= body.customerDob;

        await user.save();
        res.status(200).send({data:user,message:"Data Updated Successfully"});
    }catch(e){
        res.status(500).send({message:e.message});
    }
}

export const deleteById= async(req,res)=>{
    try{
        const{id=null}= req.params;
        const user= await Users.findOne({where:{id}});
        if(!user){
            res.status(500).send({message:"User Not Found"});
            return;
        }
        user.destroy();
        res.status(200).send({data:user,message:"Data Deleted Successfully"});
    }catch(e){
        res.status(500).send({message:e.message});
    }
}

