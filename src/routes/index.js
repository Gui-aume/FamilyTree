import {addTree, getTrees, deleteTree} from '$lib/database.js'
import { removeTreePortraits } from '$lib/utils'

// send tree list
export async function get({request}) {
    // const reqSymbol = Object.getOwnPropertySymbols(request)[1]
    // console.log(request[reqSymbol].method)

    const trees = await getTrees()
    return {
        status: 200,
        body: {trees}
    }
}

// Adding a new tree
export async function post({ request }) {
    const data = await request.json()
    if(data.name) {
        try {
            const item = await addTree(data.name)
            return { status: 200 }
        } catch (e) {
            console.error(e)
            return { status: 500 }
        }
    }
    
    // return validation errors
    return {
        status: 400
    }
}

// delete a tree
export async function del({ request }) {
    const data = await request.json()

    if(data.tree) {
        try {
            await removeTreePortraits(data.tree)
            await deleteTree(data.tree)
            return { status: 200 }
        } catch (e) {
            console.error(e)
            return {status: 500}
        }
    } else 
        return {status: 400}
}