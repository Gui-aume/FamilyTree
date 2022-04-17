import { getChar, updateChar } from "$lib/database"

///// TODO : empêcher de mettre un enfant comme parent (ça fout le sbeul en mode infinite loop)

// => recuperer les parent1 et parent2 envoyés et regarder qui sont leurs parents, si c'est le character actuel on drop

// Update character values
export async function post({ params, request }) {
    const {id} = params
    const item = await request.json()

    try {
        await updateChar(id, item)
        return { status: 200 }
    } catch (e) {
        console.error(e)
        return { status: 500 }
    }
}

export async function del({ params }) {
    const {id} = params

    // REMOVE PORTRAIT 
    const item = await getChar(id)

    try {
        // await deleteChar(id)
        return { status: 200 }
    } catch (e) {
        console.error(e)
        return {status: 500}
    }
}