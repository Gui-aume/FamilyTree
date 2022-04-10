import { writeFile} from 'fs/promises'
import { Buffer } from 'buffer';

export async function get() {
  const items = [1,2,3]
 
  return {
    body: { items }
  };
}
 
export async function post({request}) {
    const body = await request.formData()
    const item = Object.fromEntries(body)
    console.log(item)
    console.log(item.file?.size)

    await writeFile('DB/'+item.file.name, Buffer.from(await item.file.arrayBuffer()))

    
  // redirect to the newly created item
  return {
    status: 303,
    headers: {
      location: `/test`
    }
  };
}