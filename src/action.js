import { compose, id } from '@most/prelude'
import { addTodo, removeTodo, updateComplete, updateAllComplete, removeComplete, updateDescription } from './todos'

const toDataId = ({ target }) => {
  while (target !== null) {
    const id = target.getAttribute('data-id')
    if (id) {
      return id
    }
    target = target.parentNode
  }
  return -1
}

const toChecked = e => e.target.checked

const toIdAndComplete = e =>
  ({ id: toDataId(e), complete: toChecked(e) })

const toIdAndDescription = e =>
  ({ id: toDataId(e), description: e.target.value.trim() })

// -------------------------------------------------------
// App state
const setTodos = f => ({ todos, editing, view }) =>
  ({ todos: f(todos), editing, view })

const viewFromHash = hash => hash.replace(/^.*#\/?/, '') || 'all'

const seq = (...fs) => fs.reduceRight(compose)

const resetForm = ([value, form]) => (form.reset(), value)

const withFirstValue = e => [e.target.elements[0].value, e.target]
export const addTodoAction = seq(withFirstValue, resetForm, addTodo, setTodos)

export const removeTodoAction = seq(toDataId, removeTodo, setTodos)

export const updateTodoAction = seq(toIdAndComplete, updateComplete, setTodos)

export const updateAllAction = seq(toChecked, updateAllComplete, setTodos)

export const clearCompleteAction = () => setTodos(removeComplete)

const updateView = view => ({ todos, editing }) => ({ todos, editing, view })
export const updateViewAction = seq(e => e.newURL, viewFromHash, updateView)

const beginEdit = editing => ({ todos, view }) => ({ todos, editing, view })
export const beginEditAction = seq(toDataId, beginEdit)

const editTodo = f => ({ todos, view }) =>
  ({ todos: f(todos), editing: '', view })

const abortEdit = () => id
export const abortEditAction = seq(toDataId, abortEdit, editTodo)

const endEdit = ({ id, description }) =>
  description.length === 0 ? removeTodo(id) : updateDescription(id, description)

export const endEditAction = seq(toIdAndDescription, endEdit, editTodo)
