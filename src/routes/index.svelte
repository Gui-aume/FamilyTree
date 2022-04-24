<svelte:head>
    <title>Arbres</title>
</svelte:head>
<script>
    // Show the trees list
    export let trees

    let TreeName
    
    // Add a new tree
    const validateForm = e => {
        e.preventDefault()
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

    // delete a tree
    const deleteTree = e => {
        if(!window.confirm('Etes-vous sûr de vouloir supprimer l\arbre ?')) return
        
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
    <li><a href='/tree/{tree.id}'>{tree.name}</a> <button id={tree.id} on:click={deleteTree}>Supprimer</button></li>
{/each}</ul>

</center>

<style>
    li {
        text-decoration: none;
        padding: 5px;
    }
</style>