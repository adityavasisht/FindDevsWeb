const authUser = (req,res,next)=>{
    const token = "xyx";
    const Authorised = token === "xyx";
    if(!Authorised){
        res.statu(401).send("user not found");    }
    else{
        next();
    }
}

const authAdmin = (req,res,next)=>{
    const token = "yui";
    const Authorised = token === "yui";
    if(!Authorised){
        res.status(401).send("user not found !");
    }
    else{
        next();
    }

}

module.exports={
    authAdmin,
    authUser
}