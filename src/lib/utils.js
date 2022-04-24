import { mkdir, rm, stat, writeFile} from 'fs/promises'
import { Buffer } from 'buffer'
import { getChar } from '$lib/database'

const defaultDir = 'src/portraits'

export const savePortrait = async (file, filename, dir=defaultDir) => {
    // Create the dir if it doesn't exist
    if(!file || !filename) return

    let dirExists = false
    try {
        await stat(dir)
        dirExists = true
    } catch (e) {
        if(e.code === 'ENOENT') {
            try{
                await mkdir(dir)
                dirExists = true
            } catch (e) {
                console.error(e)
            }
        } else {
            console.error(e)
        }
    }
    if(dirExists)
        await writeFile(`${dir}/${filename}`, Buffer.from(await file.arrayBuffer()))
}

export const removePortrait = async id => {
    const item = await getChar(id)

    // no item found or not file
    if(!item?.ext) return

    const path = `${defaultDir}/${item.tree}/${item.id}.${item.ext}`

    try {
        await rm(path, { force: true })
    } catch (e) {
        console.error(e)
    }
}

// when a tree is deleted
export const removeTreePortraits = async tree => {
    const path = defaultDir + '/' + tree

    try {
        await rm(path, { recursive:true })
    } catch(e) {
        console.error(e)
    }
}