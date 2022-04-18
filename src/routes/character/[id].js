import { deleteChar, updateChar } from "$lib/database"
import { removePortrait } from '$lib/utils'

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

    try {
        await removePortrait(id)
        await deleteChar(id)
        return { status: 200 }
    } catch (e) {
        console.error(e)
        return {status: 500}
    }
}