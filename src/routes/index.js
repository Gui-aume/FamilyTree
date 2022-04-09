import {addTree, getTrees} from '$lib/database.js';

export async function get({request}) {
    const reqSymbol = Object.getOwnPropertySymbols(request)[1]

    console.log(request[reqSymbol].method)

    const trees = await getTrees()
    return {
        status: 200,
        body: {trees}
    }
}

export async function post({ request }) {
    const data = await request.json()
    if(data.name) {
        const item = await addTree(data.name)
        // redirect to the newly created item
        return {
            status: 303,
            headers: {
                location: `/tree/${item.id}`
            }
        }
    }
    
    // return validation errors
    return {
        status: 400
    }
   
    
}