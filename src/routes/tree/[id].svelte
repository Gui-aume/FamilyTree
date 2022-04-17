<script>
    import CreateForm from '/src/components/CreateForm.svelte'
    import Avatar from '/src/components/Avatar.svelte'
    import ChildTree from '/src/components/ChildTree.svelte'

    // populated with data from the endpoint
    /*
        [
            {id, firstname,lastname,parent1,parent2}
        ]
    */
    export let characters
    export let tree
    
    // selected character
    let selected
    let editing = false
    let sendingEdit = false

    // list characters printed in the tree to avoid infinite loop
    let treeCharList = []
    
    // ref on the current character object
    let currentChar
    let parent1
    let parent2
    let siblings

    // copy of selected character object for Edit form
    let tmpChar

    // toggle edit form
    const onEdit = () => {
        editing = !editing
    }

    // copy the selected character on selected change
    const updateChar = () => {
        tmpChar = {...characters.find(c => c.id === selected)}
    }
    // bind update function on selected change
    $: selected, updateChar()

    const sendEdit = () => {
        // Disable edit button
        sendingEdit = true
        fetch('/character/' + selected, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...tmpChar })
        }).then(res => {
            if(res.status === 200) {
                const index = characters.findIndex(c => c.id === selected)
                characters[index] = tmpChar
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
            if((parentNum === 1 && (tmpChar.parent2 === 0 || tmpChar.parent2 !== c.id)) || (parentNum === 2 && (tmpChar.parent1 === 0 || tmpChar.parent1 !== c.id)))
                avalaibleParent = true

            // childs can't be parents
            return avalaibleParent && !getAllChilds(selected).includes(c.id)
            return c.parent1 !== selected && c.parent2 !== selected && avalaibleParent
        })
        return eligibles
    }
    
    // Refresh tree when selected change (even from childs)
    $: if (selected) {
        currentChar = characters.find(c => c.id === selected)
        
        parent1 = currentChar && characters.find(c => c.id === currentChar.parent1)
        parent2 = currentChar && characters.find(c => c.id === currentChar.parent2)

        siblings = characters.filter(c => c.id !== currentChar.id && c.parent1 === currentChar.parent1 && c.parent2 === currentChar.parent2)
    }

</script>

<!-- FORM TO ADD A NEW CHARACTER -->
<CreateForm characters={characters} />

<center id='treeBody'>
    <!-- SELECT ACTIVE CHARACTER -->
    <label for='character'>Select a Character</label><select id='character' bind:value={selected} name="Afficher" size="1">
        <option style="display:none"></option>
        {#each characters as perso}
            <option value={perso.id}>{perso.firstname} {perso.lastname}</option>
        {/each}
    </select>
    {#if selected}
        <button id='editButton' on:click={onEdit}>{editing? 'Cacher' : 'Editer'}</button>
        <button id='deleteButton' on:click={onDelete}>Supprimer</button>
    {/if}

    <!-- EDIT FORM OF SELECTED CHAR -->
    {#if editing}
        <div>
            Prénom: <input type='text' bind:value={tmpChar.firstname} />
            Nom: <input type='text' bind:value={tmpChar.lastname} />
            Parent1:
            <select bind:value={tmpChar.parent1} name="parent1" size="1">
                <option value="0"> --- </option>
                {#each getPossibleParents(1) as perso}
                    <option value={perso.id}>{perso.firstname} {perso.lastname}</option>
                {/each}
		    </select>
            Parent2:
            <select bind:value={tmpChar.parent2} name="parent2" size="1">
                <option value="0"> --- </option>
                {#each getPossibleParents(2) as perso}
                    <option value={perso.id}>{perso.firstname} {perso.lastname}</option>
                {/each}
		    </select>
            <input type='submit' value='Save' on:click={sendEdit} disabled={sendingEdit} />
        </div>
    {/if}

    <!-- SHOW THE TREE FROM SELECTED CHARACTER -->
    {#if currentChar}
        <div class='tree'>
        <!-- Get parents & siblings (no half-siblings) -->
        {#if currentChar?.parent1 > 0 || currentChar?.parent2 > 0}
            <ul><li>
                <Avatar char1={parent1} char2={parent2} bind:selected />
                <ul>
                    {#if siblings?.length > 0}
                        {#each siblings as sibling}
                            <ChildTree parentID={sibling.id} characters={characters} bind:selected bind:treeCharList />
                        {/each}
                    {/if}
                    <ChildTree parentID={currentChar.id} characters={characters} bind:selected bind:treeCharList tree={tree} />
                </ul>
            </li></ul>
        {:else}
        <!-- No parents & siblings -->
            <ul>
                <ChildTree parentID={currentChar.id} characters={characters} bind:selected bind:treeCharList tree={tree} />
            </ul>
        {/if}
        </div>
    {/if}
</center>