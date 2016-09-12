import h from 'snabbdom/h'
import hh from 'hyperscript-helpers'
import { isComplete } from './todos'

const { section, header, h1, form, input, label,
  ul, li, div, span, a, strong, button, footer } = hh(h)

export const render = ({ todos, editing, view }) =>
  renderApp(todos, editing, view, count(todos))

export const renderApp = (todos, editing, view, { remaining, complete }) =>
  section('.todoapp', { class: stateClasses(todos.length, remaining, complete, view) }, [
  	renderHeader(),
	  renderTodos(todos, editing),
	  renderFooter(remaining, complete)
  ])

export const renderHeader = () =>
  header('.header', [
    h1('todos'),
    form('.add-todo', [
      input('.new-todo', { attrs: { placeholder: 'What needs to be done?', autofocus: true } })
    ])
  ])

export const renderTodos = (todos, editing) =>
  section('.main', [
    input('.toggle-all',
      { props: { type: 'checkbox', checked: todos.every(isComplete) } }),
    label({ attrs: { for: 'toggle-all' } }),
    ul('.todo-list', todos.map(renderTodo(editing)))
  ])

export const renderTodo = editing => ({ id, description, complete }) =>
  li({ class: {completed: complete, editing: editing === id}, attrs: {'data-id': id} }, [
    div('.view', [
      input('.toggle', {props: {type: 'checkbox', checked: complete}}),
      label(description),
      button('.destroy')
    ]),
    input('.edit', {props: {value: editing === id ? description : ''}})
  ])

export const renderFooter = remaining =>
  footer('.footer', [
    span('.todo-count', [
      strong(remaining),
      remaining === 1 ? ' item left' : ' items left'
    ]),
    ul('.filters', [
      li([ a({ attrs: { href: '#/' } }, 'All') ]),
      li([ a({ attrs: { href: '#/active' } }, 'Active') ]),
      li([ a({ attrs: { href: '#/completed' } }, 'Completed') ])
    ]),
    button('.clear-completed', 'Clear completed')
  ])

const count = todos => {
  const complete = todos.reduce((n, todo) => todo.complete ? n + 1 : n, 0)
  return { complete, remaining: todos.length - complete }
}

const cardinality = (name, n) => {
  // FIXME: Buble errors on computed property names here
  // Error parsing /Users/brian/Projects/cujojs/@most/todomvc/src/view.js:
  // Unexpected token (88:46) in /Users/brian/Projects/cujojs/@most/todomvc/src/view.js
  const classes = {}
  classes[`${name}-0`] = n === 0
  classes[`${name}-1`] = n === 1
  classes[`${name}-n`] = n > 1
  return classes
}

const stateClasses = (total, remaining, complete, view) =>
  Object.assign(
    { all: view === 'all', active: view === 'active', complete: view === 'completed' },
    cardinality('todos', total),
    cardinality('complete', complete),
    cardinality('remaining', remaining)
  )
