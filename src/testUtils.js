import ReactDOM from 'react-dom'

export function mount(markup) {
    const div = document.createElement('div')

    // Unless we attach the mount-node to body, getBoundingClientRect() won't work
    document.body.appendChild(div)

    return {
        component: ReactDOM.render(markup, div),
        node: div
    }
}

export function unmount(node) {
    ReactDOM.unmountComponentAtNode(node);
}

