<script>
    // Manage the displayed box for character and portrait edition

    import Portrait from './Portrait.svelte'
    export let char1
    export let char2 = undefined
    export let selected
    export let tree = undefined

    // For replacement of the portrait
    let files
    let sendingFile = false

    $: isChar1 = !!char1
    $: isChar2 = !!char2

    // character is selected by user
    $: isSelected = isChar1 && char1.id === selected

    const getPath = char => {
        // Selected Character: check if we changed the portrait
        return char.newPortrait ? char.newPortrait :
            char.ext ? `/src/portraits/${char.tree}/${char.id}.${char.ext}`
            : '/src/portraits/default.jpg'
    }

    const selectChar = (e,id) => {
        e.preventDefault()
        selected = id
    }

    // Send new portrait to server on file selection
    const newPortrait = () => {
        if(sendingFile && files?.length < 1) return

        sendingFile = true

        const formData = new FormData()
        formData.append('file', files[0])
        formData.append('tree', tree)

        fetch('/portrait/' + selected, {
            method: 'POST',
            body: formData
        }).then(res => {
            if(res.status === 200) {
                // Generate URL for the file
                char1.newPortrait = URL.createObjectURL(files[0])
                sendingFile = false
            }
        }).catch(() => sendingFile = false)
    }
</script>

{#if isChar1 || isChar2 }
    <h3 class:selected={isSelected}>
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
        {#if isSelected}
            <br />
            <label for='portrait-change' class='portrait-upload'>New Portrait</label>
            <input id='portrait-change' type='file' bind:files on:change={newPortrait} disabled={sendingFile} />
        {/if}
    </h3>
{/if}

<style>
    .selected {
        background-color: #ced6e0;
    }
    input[type="file"] {
        display: none;
    }
    .portrait-upload {
        border: 1px solid #aaa;
        display: inline-block;
        padding: 6px 12px;
        cursor: pointer;
    }
</style>