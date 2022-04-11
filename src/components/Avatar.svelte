<script>
    import Portrait from './Portrait.svelte'
    export let char1
    export let char2 = undefined
    export let selected

    $: isChar1 = !!char1
    $: isChar2 = !!char2

    const getPath = char => {
        return char.ext ? `/src/portraits/${char.tree}/${char.id}.${char.ext}`
        : '/src/portraits/default.jpg'
    }

    const selectChar = (e,id) => {
        e.preventDefault()
        selected = id
    }
</script>

{#if isChar1 || isChar2 }
    <h3>
        {#if isChar1 && isChar2 }
            <Portrait path={getPath(char1)} />
            <Portrait path={getPath(char2)} />
            <br /><br />
            <a href='.' on:click={e => selectChar(e, char1.id)}>{char1.firstname}</a>
            & <a href='.' on:click={e => selectChar(e, char2.id)}>{char2.firstname}</a>
            {char1.lastname}
        {:else }
            <Portrait path={getPath(isChar1 ? char1 : char2)} />
            <br />
            <a href='.' on:click={e => selectChar(e, isChar1 ? char1.id : char2.id)}>
                {isChar1 ? char1.firstname : char2.firstname} {isChar1 ? char1.lastname : char2.lastname}
            </a>
        {/if}
    </h3>
{/if}