<script>
export default {
    name: "button-counter-container",
    data() {
        return {
            count: 0
        };
    },
    methods: {
        onChange(val) {
            console.log(val)
            this.count = val.target.value;
        }
    },
    render() {
        const { count, onChange } = this;
        return (
            <div>
                <input type="text" onInput={onChange}/>
                <span>{count}dddddd</span>
            </div>
        );
    }
};
</script>