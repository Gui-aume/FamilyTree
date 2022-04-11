<svelte:head>
    <title>Arbres</title>
</svelte:head>
<script>
    export let trees

    let TreeName
    
    // Need to refresh => find a solution
    const validateForm = () => {
        fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: TreeName
            })
        }).then(res => {
            if(res.status === 200)
                location.reload()
            else console.error(res)
        })
        TreeName = ''
    }

    const deleteTree = e => {
        if(!window.confirm('Do you really want to delete the tree ?')) return
        
        const id = e.target.id 
        fetch('.', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tree: id
            })
        }).then(res => {
            if(res.status === 200)
                location.reload()
            else console.error(res)
        })
    }
</script>

<center id='treeBody'>
<form>
    <label for='treename'>Ajouter un Arbre: </label><input id='treename' type='text' name='name' placeholder="Nom de l'arbre" bind:value={TreeName} />
    <button on:click={validateForm}>Créer</button>
</form>
<br />
<ul>{#each trees as tree}
    <li><a href='/tree/{tree.id}'>{tree.name}</a> <button id={tree.id} on:click={deleteTree}>Delete</button></li>
{/each}</ul>

</center>