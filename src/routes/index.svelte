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
        })
        TreeName = ''
    }
</script>

<h1>Arbres</h1>

<form>
    <input type='text' name='name' id='name' placeholder="Nom de l'arbre" bind:value={TreeName} />
    <button on:click={onprout}>Prout</button>
</form>

<ul>{#each trees as tree}
    <li><a href='/tree/{tree.id}'>{tree.name}</a></li>
{/each}</ul>

<hr>
<h3>Welcome to SvelteKit</h3>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
