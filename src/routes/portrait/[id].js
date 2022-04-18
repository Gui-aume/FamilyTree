import { savePortrait } from '$lib/utils'
import { getExt, updatePortrait } from '$lib/database.js'
import { rm } from 'fs/promises'

// Update character portrait
export async function post({ params, request }) {
    const {id} = params
    const body = await request.formData()
    const item = Object.fromEntries(body)

    let newExt
    const dir = 'src/portraits/' + item.tree

    try {
        if(!item.tree) throw('Missing tree param')
        newExt = item.file.name.split('.').pop()

        await savePortrait(item.file, `${id}.${newExt}`, dir)
    } catch (e) {
        console.error(e)
        return { status: 500}
    }

    try{
        const char = await getExt(id)
        // If different, update DB
        if(char && char.ext !== newExt) {
            await updatePortrait(id, newExt)
            // If old image: remove it
            if(char.ext) {
                rm(`${dir}/${id}.${char.ext}`)
                .then(() => console.log('Old pic delete'))
                .catch(console.error)
            }
        }
        
        return { status: 200}
    } catch(e) {
        console.error(e)
        return { status: 500}
    }
}