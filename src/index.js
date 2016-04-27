import { merge, map, tap, filter, scan } from 'most'
import { submit, change, click, dblclick, keyup, focusout, hashchange } from '@most/dom-event'

import snabbdom from 'snabbdom'
import props from 'snabbdom/modules/props'
import attrs from 'snabbdom/modules/attributes'
import clss from 'snabbdom/modules/class'

import { render } from './view'
import { addTodoAction, removeTodoAction, updateTodoAction } from './action'

const applyActions = (initial, actions) => scan(applyAction, initial, actions)
const applyAction = (state, action) => action(state)

const preventDefault = s => tap(doPreventDefault, s)
const doPreventDefault = e => e.preventDefault()

const isKey = code => s => filter(e => e.keyCode === code, s)
const match = (query, s) => filter(e => e.target.matches(query), s)

const ENTER_KEY = 13
const ESC_KEY = 27

const listActions = el => {
  const add = map(addTodoAction, preventDefault(match('.add-todo', submit(el))))
  const remove = map(removeTodoAction, match('.destroy', click(el)))
  const complete = map(updateTodoAction, match('.toggle', change(el)))

  return merge(add, remove, complete)

	//
  // const all = map(updateAllAction, match('.toggle-all', change(el)))
	//
  // const clear = map(clearCompleteAction, match('.clear-completed', click(el)))
	//
  // return merge(add, remove, complete, all, clear)
}
//
// const editActions = el => {
//   const beginEdit = map(beginEditAction, match('label', dblclick(el)))
//
//   const editKey = match('.edit', keyup(el))
//   const blurEdit = match('.edit', focusout(el))
//   const enter = isKey(ENTER_KEY, editKey)
//   const saveEdit = map(endEditAction, merge(enter, blurEdit))
//
//   const abortEdit = map(abortEditAction, isKey(ESC_KEY, editKey))
//
//   return merge(beginEdit, saveEdit, abortEdit)
// }
//
// const filterActions = window =>
//   map(updateViewAction, hashchange(window))

const todos = (window, container, initialState) => {
  // const actions = merge(listActions(container),
  //         editActions(container),
  //         filterActions(window))

  const actions = listActions(container)
  return applyActions(initialState, actions)
}

const root = document.querySelector('.todoapp')
const container = root.parentNode

const patch = snabbdom.init([props, attrs, clss])
const updateApp = (node, state) => {
  console.log(node, state)
  return patch(node, render({ todos: state, editing: '', view: 'all' }))
}

todos(window, container, []).scan(updateApp, root).drain()
