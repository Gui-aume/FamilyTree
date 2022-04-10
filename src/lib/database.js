import sqlite3 from 'sqlite3'

const treeTable = 'trees'
const characterTable = 'characters'

const db = new sqlite3.Database('DB/trees.db')

db.serialize(() => {
    db.exec(`CREATE TABLE IF NOT EXISTS ${treeTable} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(50)
    )`)
    db.exec(`CREATE TABLE IF NOT EXISTS ${characterTable} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname VARCHAR(50),
        lastname VARCHAR(50),
        parent1 NUMBER,
        parent2 NUMBER,
        tree NUMBER
    )`)
    // db.exec(`INSERT INTO ${treeTable} (name) VALUES ('bob'), ('albert')`)
    // db.exec(`INSERT INTO ${characterTable} (firstname, lastname, tree) 
    // VALUES ('bob','morane',1),('abra','kadabra',1),('albert','couille',2)`)
})

export const addTree = async function(name) {
    return new Promise((s,f) => {
        db.serialize(function () {
            db.run(`INSERT INTO ${treeTable} (name) VALUES ('${name}')`, function (e) {
                if(e) f(e)
                s({id: this.lastID, name})
            })
        })
    })
}

export const getTrees = () => new Promise((s,f) => {
    // const req = `SELECT ${treeTable}.id, ${treeTable}.name, count(DISTINCT ${characterTable}.id) as number FROM trees
    // LEFT JOIN ${characterTable} ON ${treeTable}.id = ${characterTable}.tree GROUP BY ${characterTable}.tree`

    db.all(`SELECT * FROM ${treeTable}`, (e,trees) => {
        if(e) f(e)
        s(trees)
    })
})

export const addCharacter = (tree, char) => {
    console.log('Add : %o in %d', char, tree )
    if(!tree && !char) return

    return new Promise((s,f) => {
        db.serialize(function () {
            db.prepare(`INSERT INTO ${characterTable} (firstname, lastname, parent1, parent2, tree) VALUES (?,?,?,?,?)`)
            .run(char.firstname, char.lastname, char.parent1 || 0, char.parent2 || 0, tree, function (e) {
                if(e) f(e)
                // console.log('New character ID: ' + this.lastID)
                s({id: this.lastID, char})
            }).finalize()
        })
    })
}

export const getCharacters = tree => new Promise((s,f) => {
    db.all(`SELECT * FROM ${characterTable} WHERE tree=${tree}`, (e,data) => {
        if(e) f(e)
        // console.log("Characters in tree %d : %o", tree, data)
        s(data)
    })
})