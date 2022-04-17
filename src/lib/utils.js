import { mkdir, stat, writeFile} from 'fs/promises'
import { Buffer } from 'buffer'

export const savePortrait = async (file, filename, dir='src/portraits') => {
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