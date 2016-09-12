import { compose, id } from '@most/prelude'
import { addTodo, removeTodo, updateComplete, updateAllComplete, removeComplete, updateDescription } from './todos'

const toDataId = ({ target }) => findDataId(target)
const findDataId = node => node == null ? ''
  : node.getAttribute('data-id') || findDataId(node.parentNode)

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

const pipe = (...fs) => fs.reduceRight(compose)

const resetForm = ([value, form]) => (form.reset(), value) // eslint-disable-line no-sequences

const withFirstValue = e => [e.target.elements[0].value, e.target]
export const addTodoAction = pipe(withFirstValue, resetForm, addTodo, setTodos)

export const removeTodoAction = pipe(toDataId, removeTodo, setTodos)

export const updateTodoAction = pipe(toIdAndComplete, updateComplete, setTodos)

export const updateAllAction = pipe(toChecked, updateAllComplete, setTodos)

export const clearCompleteAction = () => setTodos(removeComplete)

const updateView = view => ({ todos, editing }) => ({ todos, editing, view })
export const updateViewAction = pipe(e => e.newURL, viewFromHash, updateView)

const beginEdit = editing => ({ todos, view }) => ({ todos, editing, view })
export const beginEditAction = pipe(toDataId, beginEdit)

const editTodo = f => ({ todos, view }) =>
  ({ todos: f(todos), editing: '', view })

const abortEdit = () => id
export const abortEditAction = pipe(toDataId, abortEdit, editTodo)

const endEdit = ({ id, description }) =>
  description.length === 0 ? removeTodo(id) : updateDescription(id, description)

export const endEditAction = pipe(toIdAndDescription, endEdit, editTodo)
