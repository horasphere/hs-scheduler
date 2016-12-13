import ReactDOM, { findDOMNode } from 'react-dom'

export function mount (markup, node = null) {
  if(node !== null) {
    unmount(node);
  }

  node = document.createElement('div')

  // Unless we attach the mount-node to body, getBoundingClientRect() won't work
  document.body.appendChild(node)

  const component = ReactDOM.render(markup, node);

  return {
    component,
    componentNode: findDOMNode(component),
    node
  }
}

export function unmount (node) {
  ReactDOM.unmountComponentAtNode(node)
  document.body.removeChild(node)
}

