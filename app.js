const express = require("express");
const { open } = require("sqlite");

const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");

const app = express();
app.use(express.json());

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      fileName: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running at http://localhost:3000");
    });
  } catch (error) {
    console.log(`DB Error:${error.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

const convertDbObjectIntoResponseObject=(dbObject)=>{
    return{
        playerId:dbObject.player_id,
        playerName:dbObject.player_name,
        jerseyNumber:dbObject.jersey_number,
        role:dbObject.role
    };


};

app.get("/players/", async(request, response) => {
  const getPlayersQuery = `
        select *
        FROM cricket_Team`;
  const playerArray = await db.all("getPlayersQuery");
  response.send(playerArray.map((eachPlayer)=>
      convertDbObjectIntoResponseObject(eachPlayer)
  )
  );
});

app.post("/players/",async(request,response)=>{
    const {playerName,jerseyNumber,role}=request.body;
    const postPlayerQuery=`
        insert INTO cricket_Team(player_Name,jersey_Number,role)
        values(`${playerName}`,${jerseyNumber},`${role}`);`;
    const player=await db.run(postPlayerQuery);
    response.send("Players Added To Team");

});
 
app.get("/players/:playerId/",async(request,response)=>{
    const {playerId}=request.params;
    const getPlayerIdQuery=`
            select * 
            From cricket_Team
              where player_id=${player_Id};`;
    const player=await db.get(getPlayerIdQuery);
    response.send(convertDbObjectIntoResponseObject(player));
});

app.put("/players/:playerId",async(request,response)=>{
    const{playerName,jerseyNumber,role}=request.body;
    const{playerId}=request.params;
    const updatePlayerQuery=`
       
    UPDATE
      cricketTeam
         SET 
            player_name='${playerName}',
            jerseyNumber=${jerseyNumber},
            role='${role}'
         where
            player_id=${playerId};`;
             
    await db.run(updatePlayerQuery);
    response.send("player Details Updated");
         
});
 app.delete("/players/:playerId",async(request,response)=>{
     const{playerId}=request.params;
     const deletePlayerQuery=`
     DELETE FROM
         cricket_Team
     Where 
        player_id=${playerId};`;
    await db.run(deletePlayerQuery)
    response.send("Player Removed");
 });
 module.exports=app;