<svelte:head>
    <title>Arbres</title>
</svelte:head>
<script>
    export let trees

    let TreeName
    
    // Need to refresh => find a solution
    const onprout = () => {
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
</script>

<center id='treeBody'>
<form>
    <label for='treename'>Ajouter un Arbre: </label><input id='treename' type='text' name='name' placeholder="Nom de l'arbre" bind:value={TreeName} />
    <button on:click={onprout}>Prout</button>
</form>
<br />
<ul>{#each trees as tree}
    <li><a href='/tree/{tree.id}'>{tree.name}</a></li>
{/each}</ul>

</center>