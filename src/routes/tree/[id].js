import {addCharacter, getCharacters} from '$lib/database.js';

export async function get({ params, request }) {
    // `params.id` comes from [id].js => tree id
    
    // const reqSymbol = Object.getOwnPropertySymbols(request)[1]
    // console.log(request[reqSymbol].method)

    try {
        const characters = await getCharacters(params.id)
    
        // return characters
        return {
            body: { tree: params.id, characters }
        }
    } catch (e) {
        console.error(e)
        return {
            status: 500
        }
    }
}

export async function post({ params, request }) {
    // params contains the url params, here params.id = tree ID
    try {
        const data = await request.json()
        if(data.firstname) {
            const newCharacter = await addCharacter(params.id, data)
            return { status: 200 }
        }
        return { status: 400 }
    } catch (e) {
        console.error(e)
        return {
            status: 500
        }
    }
}