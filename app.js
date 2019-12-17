const clickHandle = withHooks((e) => {
    const [state, setState] = useState(0)
    setState(state + 1)
    e.target.innerHTML = e.target.innerHTML.replace(/(\w+)(?: \d+)?/, `$1 ${state}`)
})

addEventListener('DOMContentLoaded', () => {
    document.querySelector('#foo').addEventListener('click', clickHandle);
})