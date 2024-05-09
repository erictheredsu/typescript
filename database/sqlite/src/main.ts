import * as sqlite from "sqlite3";

//see https://github.com/TryGhost/node-sqlite3/wiki/API for sqlite API

const sqlite3: sqlite.sqlite3 = sqlite.verbose();
const db:sqlite.Database = new sqlite3.Database(':memory:');


db.serialize(function(){
    db.run('CREATE TABLE user (name TEXT)');

    const stmt = db.prepare("INSERT INTO user(name) VALUES (?)");
    const name:string[] = ['Alice', 'Eric', 'Alvin'];

    for(let i=0; i< name.length;i++){
        stmt.run(name[i]);
    }

    stmt.finalize();

    db.each('SELECT * FROM user', function(err, row){
        console.log(row);
    })


    db.close();
});

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// async function execute(sql:string, param?:any[]):Promise<any>{
//     console.log(`execture sql: $1`, sql );

//     await db.run
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const promise:Promise<any> = new Promise<any>((resolve, reject)=>{
//         this.db.run(sql, param, (err:Error, result:sqlite.RunResult) =>{
//             if(err){
//                 console.error(err);
//                 reject(err);
//             }
//             console.log(result);
//             resolve(result);
//         });
//     });
//     return promise
// }


// async function test(){
//     await execute('CREATE TABLE user (name TEXT)');

//     await execute( "INSERT INTO user(name) VALUES (?)", ['Alice']);

//     await execute("INSERT INTO user(name) VALUES (?)", ['Eric']);

//     //await execute('SELECT * FROM user');

//     // await db.run('UPDATE user SET name = ? WHERE name = ?', ['Alvin','Alice'], function(err){
//     //     if(err){
//     //         return console.log(err);
//     //     }
//     // })

//     await db.close(function (err){
//         if(err){
//             return console.log(err);
//         }
//     })

// }

