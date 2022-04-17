<script>
    export let characters
    export let selected

    // copy of selected character object for Edit form
    export let editedChar
    let editing = false

    // toggle edit form
    const onEdit = () => {
        editing = !editing
    }

    // parentNum : 1 ou 2
    const getPossibleParents = (id, parentNum) => {
        const parent = 'parent' + parentNum
        characters.filter(c => c.id !== editedChar.id && (c.id !== editedChar.parent2 || editedChar.parent2 === 0))
    }

    const sendEdit = () => {
        // Disable edit button
        onEdit()
        fetch('/character/' + selected, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ editedChar })
        }).then(res => {
            if(res.status === 200) {
                const index = characters.findIndex(c => c.id === selected)
                characters[index] = editedChar
            }
            // Enable edit button
            onEdit()
        }).catch(e => {
            console.error(e)
            // Enable edit button
            onEdit()
        })
    }

</script>

<!-- EDIT FORM OF SELECTED CHAR -->
<button id='editButton' on:click={onEdit}>{editing? 'Cacher' : 'Editer'}</button>

{#if editing}
<div>
    Prénom: <input type='text' bind:value={editedChar.firstname} />
    Nom: <input type='text' bind:value={editedChar.lastname} />
    Parent1:
    <select bind:value={editedChar.parent1} name="parent1" size="1">
        <option value="0"> --- </option>
        {#each characters.filter(c => c.id !== editedChar.id && (c.id !== editedChar.parent2 || editedChar.parent2 === 0)) as perso}
            <option value={perso.id}>{perso.firstname} {perso.lastname}</option>
        {/each}
    </select>
    Parent2:
    <select bind:value={editedChar.parent2} name="parent2" size="1">
        <option value="0"> --- </option>
        {#each characters.filter(c => c.id !== editedChar.id && (c.id !== editedChar.parent1 || editedChar.parent1 === 0)) as perso}
            <option value={perso.id}>{perso.firstname} {perso.lastname}</option>
        {/each}
    </select>
    <!-- <input type='file' name='file' /> -->

    <!-- TODO : block submit button if nothing is edited ? -->

    <input type='submit' value='Save' on:click={sendEdit} />
</div>
{/if}