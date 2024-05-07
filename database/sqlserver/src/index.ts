import * as mssql from "mssql";

const dbConfig: mssql.config = {
    server: '10.59.147.225',
    database: 'SBO-COMMON',
    user: 'sa',
    password: 'Initial0',
    options:{
       trustServerCertificate:true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let connection: mssql.ConnectionPool;

async function initConnection(): Promise<mssql.ConnectionPool>{
    try{
        const pool = new mssql.ConnectionPool(dbConfig);
        return await pool.connect()
    }catch(error){
        throw new Error (`Failed to connect to DB ${dbConfig.server}: ${error}`)
    }
}

function closeConnection(){
    if(connection != null){
        connection.close();
    }

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function executeQuery(query: string) : Promise<any[]>{
    try{
        const result = await connection.query(query);
        return result.recordset;
    }catch(error){
        throw new Error(`Failed to execute query ${error}`);
    }

}

async function executeNonQuery(query: string): Promise<void>{
    try{
        await connection.query(query);
    }catch(error){
        throw new Error(`Failed to execute non-query ${error}`);
    }
}

const selectQuery = 'SELECT  * FROM SLIC'
async function selectData(){
    try{
        const selectResult = await executeQuery(selectQuery);
        console.log(selectResult);
    }catch(error){
        console.error('select query went wrong:', error);
    }
}

async function insertData(){
    const insertQuery = 'INSERT INTO SLIC ("LSRV") values (\'10.59.147.225:40000\')';
    try{
        await executeNonQuery(insertQuery);
        console.log('insert data success');
    }catch(error){
        console.error('insert data went wrong:', error);
    }
}


async function updateData(){
    const updateQuery = 'UPDATE SLIC SET "AliasUpd" = \'20240425\' where "LSRV" = \'10.59.147.225:40000\'';
    try{
        await executeNonQuery(updateQuery);
        console.log('udpate data success');
    }catch(error){
        console.error('update data went wrong:', error);
    }
}



async function deleteData(){
    const deleteQuery = 'DELETE FROM SLIC  where "LSRV" = \'10.59.147.225:40000\'';
    try{
        await executeNonQuery(deleteQuery);
        console.log('delete data success');
    }catch(error){
        console.error('delete data went wrong:', error);
    }
}

async function  main(){
 
    connection = await initConnection();

    await insertData();
    await selectData();
    
    await updateData();
    await selectData();
    
    await deleteData();
    await selectData();

    closeConnection();
}

main();

