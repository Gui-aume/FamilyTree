import {addCharacter, getCharacters, getTreeExists} from '$lib/database.js'
import { savePortrait } from '../../lib/utils'

export async function get({ params }) {
    // `params.id` comes from [id].js => tree id
    
    // const reqSymbol = Object.getOwnPropertySymbols(request)[1]
    // console.log(request[reqSymbol].method)

    try {
        const treeExists = await getTreeExists(params.id)
        if(!treeExists)
            return { status: 404 }
    } catch (e) {
        console.error(e)
        return {
            status: 500
        }
    }

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
        // Convert form data to JS Object
        const body = await request.formData()
        const item = Object.fromEntries(body)

        if(!item.firstname) return { status: 400 }

        // insert in DB
        if(item.firstname) {
            if(item.file) {
                item.ext = item.file.name.split('.').pop()
            }
            ///// TODO : empêcher de mettre un enfant comme parent (ça fout le sbeul en mode infinite loop)
            const newCharacter = await addCharacter(params.id, item)
            
            // Write file async if it exists
            if(newCharacter.id && item.file) {
                const dir = 'src/portraits/' + params.id
                savePortrait(item.file, `${newCharacter.id}.${item.ext}`, dir)
            }
        }
        return {
            status: 303,
            headers: {
                location: `/tree/${params.id}`
            }
        }
    } catch (e) {
        if( e.code !== 'ENOENT') // File doesn't exist: triggered with 'stat' func
            console.error(e)
        return {
            status: 500
        }
    }
}