<script>
    export let path

    function placeholder() {
        this.src = '/src/portraits/default.jpg'
    }
</script>

<img src={path} on:error={placeholder} alt='avatar' width='100px' />