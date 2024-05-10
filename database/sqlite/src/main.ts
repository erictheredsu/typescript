import * as sqlite from "sqlite3";
import * as util from "util";

//see https://github.com/TryGhost/node-sqlite3/wiki/API for sqlite API

const sqlite3: sqlite.sqlite3 = sqlite.verbose();
const db:sqlite.Database = new sqlite3.Database(':memory:');


// version 1: db.serialize run with order
// db.serialize(function(){
//     db.run('CREATE TABLE user (name TEXT)');

//     const stmt = db.prepare("INSERT INTO user(name) VALUES (?)");
//     const name:string[] = ['Alice', 'Eric', 'Alvin'];

//     for(let i=0; i< name.length;i++){
//         stmt.run(name[i]);
//     }

//     stmt.finalize();

//     db.each('SELECT * FROM user', function(err, row){
//         console.log(row);
//     })


//     db.close();
// });

//version 2: async 
//don't know why util.promisify doesn't work
//const db_run = util.promisify(db.run);
//const db_prepare = util.promisify(db.prepare);
//const db_each = util.promisify(db.each);

async function executeQuery(db:sqlite.Database, sql:string, params?:any[]):Promise<any>{
    console.log(`executeQuery:${sql}`);
    return new Promise((resolve, reject)=>{
        db.all(sql,params, function(err:Error, rows:any[]){
            if(err){
                reject(err);
            }
            else{
                resolve(rows);
            }
        });
    });
}

async function executeNonQuery(db:sqlite.Database, sql:string, params?:any[]):Promise<void>{
    console.log(`executeNoQuery:${sql}`);
    return new Promise((resolve, reject)=>{
        db.run(sql, params, function(err:Error){
            if(err){
                reject(err);
            }else{
                resolve();
            }
        });
    });
}


async function test(){

    try {
        await executeNonQuery(db,'CREATE TABLE user (name TEXT)');
        
        const insert_sql = "INSERT INTO user(name) VALUES ";
        const name:string[] = ['Alice', 'Eric', 'Alvin'];
        for(let i:number=0;i<name.length;i++){
            const tmpQuery = `${insert_sql} (\'${name[i]}\') `;
            await executeNonQuery(db,tmpQuery);
        }

        const rows = await executeQuery(db, 'SELECT * FROM user');
        console.log(rows);

    } catch (error) {
        console.log(error)
    }

    db.close();
}

test();

