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
        tree NUMBER,
        ext VARCHAR(10)
    )`)
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

export const deleteTree = id => new Promise((s,f) => {
    // delete characters of the tree, then the tree
    db.serialize(() => {
        db.exec(`DELETE FROM ${characterTable} WHERE tree=${id}`, e => { if(e) f() })
        db.exec(`DELETE FROM ${treeTable} WHERE id=${id}`, e => {
            if(e) f()
            s()
        })
    })
})

export const getCharacters = tree => new Promise((s,f) => {
    db.all(`SELECT * FROM ${characterTable} WHERE tree=${tree}`, (e,data) => {
        if(e) f(e)
        // console.log("Characters in tree %d : %o", tree, data)
        s(data)
    })
})

export const getExt = id => new Promise((s,f) => {
    db.all(`SELECT ext FROM ${characterTable} WHERE id=${id}`, (e, data) => {
        if(e) f(e)
        s(data?.length > 0 ? data[0] : undefined)
    })
})

export const addCharacter = (tree, char) => {
    if(!tree && !char) return

    return new Promise((s,f) => {
        db.serialize(function () {
            db.prepare(`INSERT INTO ${characterTable} (firstname, lastname, parent1, parent2, tree, ext) VALUES (?,?,?,?,?,?)`)
            .run(char.firstname, char.lastname, char.parent1 || 0, char.parent2 || 0, tree, char.ext, function (e) {
                if(e) f(e)
                // console.log('New character ID: ' + this.lastID)
                s({id: this.lastID, char})
            }).finalize()
        })
    })
}

export const getChar = id => new Promise((s,f) => {
    db.all(`SELECT * FROM ${characterTable} WHERE id=${id}`, (e, data) => {
        if(e) f(e)
        s(data?.length > 0 ? data[0] : undefined)
    })
})


export const updateChar = (id, newItem) => new Promise((s,f) => {
    db.serialize(() => {
        // console.log(newItem)
        const query = db.prepare(`UPDATE ${characterTable} SET firstname=?, lastname=?, parent1=?, parent2=? WHERE id=?`)
        query.run(newItem.firstname, newItem.lastname, newItem.parent1 || 0, newItem.parent2 || 0, id, e => {
            if(e) f(e)
            s()
        })
        .finalize()
    })
})

export const deleteChar = id => new Promise((s,f) => {
    db.serialize(() => {
        db.exec(`DELETE FROM ${characterTable} WHERE id=${id}`, e => {
            if(e) f()
            s()
        })
    })
})

export const updatePortrait = (id, ext) => new Promise((s,f) => {
    db.serialize(() => {
        const query = db.prepare(`UPDATE ${characterTable} SET ext=? WHERE id=?`)
        query.run(ext, id, e => {
            if(e) f(e)
            s()
        }).finalize()
    })
})

export const getTreeExists = id => new Promise((s,f) => {
    db.all(`SELECT EXISTS(SELECT id FROM ${treeTable} WHERE id=${id}) AS exist`, (e, data) => {
        if(e) f(e)
        s(data?.length > 0 && data[0].exist)
    })
})