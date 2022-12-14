const express = require("express");
const { open } = require("sqlite");

const sqlite3 = require("sqlite3");
const path = require("path");
const databasePath = path.join(__dirname, "cricketTeam.db");

const app = express();
app.use(express.json());

let database= null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server  running at http://localhost:3000/");
   );
  }catch (error) {
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
        FROM cricket_team;`;
  const playerArray = await database.all("getPlayersQuery");
  response.send(playerArray.map((eachPlayer)=>
      convertDbObjectIntoResponseObject(eachPlayer)
  )
  );
});

app.post("/players/",async(request,response)=>{
    const {playerName,jerseyNumber,role}=request.body;
    const postPlayerQuery=`
        insert INTO cricket_team(player_Name,jersey_Number,role)
        values('${playerName}',${jerseyNumber},'${role}');`;
    const player=await database.run(postPlayerQuery);
    response.send("Player Added To Team");

});
 
app.get("/players/:playerId/",async(request,response)=>{
    const {playerId}=request.params;
    const getPlayerIdQuery=`
            select * 
            From cricket_team
              where player_id=${playerId};`;
    const player=await database.get(getPlayerIdQuery);
    response.send(convertDbObjectIntoResponseObject(player));
});

app.put("/players/:playerId",async(request,response)=>{
    const{playerName,jerseyNumber,role}=request.body;
    const{playerId}=request.params;
    const updatePlayerQuery=`
       
    UPDATE
      cricket_team
         SET 
            player_name='${playerName}',
            jersey_number=${jerseyNumber},
            role='${role}'
         where
            player_id=${playerId};`;
             
    await database.run(updatePlayerQuery);
    response.send("player Details Updated");
         
});
 app.delete("/players/:playerId",async(request,response)=>{
     const{playerId}=request.params;
     const deletePlayerQuery=`
     DELETE FROM
         cricket_team
     Where 
        player_id=${playerId};`;
    await db.run(deletePlayerQuery)
    response.send("Player Removed");
 });
 module.exports=app;