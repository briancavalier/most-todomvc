import { merge, map, chain, tap, filter, scan, startWith, take } from 'most'
import { submit, change, click, dblclick, keyup, focusout, hashchange } from '@most/dom-event'

import snabbdom from 'snabbdom'
import props from 'snabbdom/modules/props'
import attrs from 'snabbdom/modules/attributes'
import clss from 'snabbdom/modules/class'

import { render } from './view'
import {
  addTodoAction, removeTodoAction, updateTodoAction, updateAllAction,
  clearCompleteAction, updateViewAction,
  beginEditAction, endEditAction, abortEditAction
} from './action'

const applyAction = (state, action) => action(state)

const preventDefault = s => tap(doPreventDefault, s)
const doPreventDefault = e => e.preventDefault()

const isKey = (code, s) => filter(e => e.keyCode === code, s)
const match = (query, s) => filter(e => e.target.matches(query), s)

const ENTER_KEY = 13
const ESC_KEY = 27

const listActions = el => {
  const clicks = click(el)
  const changes = change(el)

  const add = map(addTodoAction, preventDefault(match('.add-todo', submit(el))))
  const remove = map(removeTodoAction, match('.destroy', clicks))
  const complete = map(updateTodoAction, match('.toggle', changes))
  const all = map(updateAllAction, match('.toggle-all', changes))
  const clear = map(clearCompleteAction, match('.clear-completed', clicks))

  return merge(add, remove, complete, all, clear)
}

const editActions = el =>
  chain(editTodo(el), match('label', dblclick(el)))

const editTodo = el => e => {
  const editKey = match('.edit', keyup(el))
  const enter = isKey(ENTER_KEY, editKey)
  const blurEdit = match('.edit', focusout(el))
  const saveEdit = map(endEditAction, merge(enter, blurEdit))

  const escape = isKey(ESC_KEY, editKey)
  const abortEdit = map(abortEditAction, escape)

  const endEdit = take(1, merge(saveEdit, abortEdit))
  return startWith(beginEditAction(e), endEdit)
}

const filterActions = window =>
  map(updateViewAction, hashchange(window))

const todos = (window, container, initialState) => {
  const actions = merge(listActions(container), editActions(container), filterActions(window))
  return scan(applyAction, initialState, actions)
}

const root = document.querySelector('.todoapp')
const container = root.parentNode

const patch = snabbdom.init([props, attrs, clss])
const updateApp = (node, state) => patch(node, render(state))

const initialState = { todos: [], editing: '', view: 'all' }

todos(window, container, initialState).reduce(updateApp, root)
