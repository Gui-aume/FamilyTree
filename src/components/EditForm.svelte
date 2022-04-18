<script>
    export let characters
    export let selected

    // copy of selected character object for Edit form
    let editedChar
    let editing = false
    let sendingEdit = false

    // toggle edit form
    const onEdit = () => {
        editing = !editing
    }

    // copy the selected character on selected change
    const updateChar = () => {
        editedChar = {...characters.find(c => c.id === selected)}
    }
    // bind update function on selected change
    $: selected, updateChar()

    // Get all descent list
    const getAllChilds = (id, familly=[]) => {
        const childs = []
        characters.forEach(c => {
            if(c.id === id) return
            if(familly.indexOf(c.id) < 0 && (c.parent1 === id || c.parent2 === id)) {
                familly.push(c.id)
                childs.push(c.id, ...getAllChilds(c.id, familly))
            }
        })
        return childs
    }

    // parentNum : 1 ou 2
    $: getPossibleParents = parentNum => {
        // IMPROVMENT : remove grand childs and all descendants
        const eligibles = characters.filter(c => {
            if(c.id === selected) return false

            // remove the other parent from the list
            let avalaibleParent = false
            if((parentNum === 1 && (editedChar.parent2 === 0 || editedChar.parent2 !== c.id)) || (parentNum === 2 && (editedChar.parent1 === 0 || editedChar.parent1 !== c.id)))
                avalaibleParent = true

            // childs can't be parents
            return avalaibleParent && !getAllChilds(selected).includes(c.id)
            return c.parent1 !== selected && c.parent2 !== selected && avalaibleParent
        })
        return eligibles
    }
    
    const sendEdit = () => {
        // Disable edit button
        sendingEdit = true
        fetch('/character/' + selected, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...editedChar })
        }).then(res => {
            if(res.status === 200) {
                const index = characters.findIndex(c => c.id === selected)
                characters[index] = editedChar
            }
        }).catch(console.error)
        .finally(() => {
            sendingEdit = false
            onEdit()
        })
    }

    // delete char request
    const onDelete = () => {
        fetch('/character/' + selected, {
            method: 'DELETE'
        }).then(res => {
            if(res.status === 200) {
                const index = characters.findIndex(c => c.id === selected)
                delete characters[index]
            }
        }).catch(console.error)
    }

</script>

<!-- EDIT FORM OF SELECTED CHAR -->
<button id='editButton' on:click={onEdit}>{editing? 'Cacher' : 'Editer'}</button>
<button id='deleteButton' on:click={onDelete}>Supprimer</button>

{#if editing}
<div>
    Prénom: <input type='text' bind:value={editedChar.firstname} />
    Nom: <input type='text' bind:value={editedChar.lastname} />
    Parent1:
    <select bind:value={editedChar.parent1} name="parent1" size="1">
        <option value="0"> --- </option>
        {#each getPossibleParents(1) as perso}
            <option value={perso.id}>{perso.firstname} {perso.lastname}</option>
        {/each}
    </select>
    Parent2:
    <select bind:value={editedChar.parent2} name="parent2" size="1">
        <option value="0"> --- </option>
        {#each getPossibleParents(2) as perso}
            <option value={perso.id}>{perso.firstname} {perso.lastname}</option>
        {/each}
    </select>
    <input type='submit' value='Save' on:click={sendEdit} disabled={sendingEdit} />
</div>
{/if}