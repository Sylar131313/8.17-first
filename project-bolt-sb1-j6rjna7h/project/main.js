import './style.css'

const STORAGE_KEY = 'todo-app-items'

const PRIORITIES = {
  high: { label: '高', color: '#ef4444' },
  medium: { label: '中', color: '#f59e0b' },
  low: { label: '低', color: '#22c55e' },
}

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list = raw ? JSON.parse(raw) : []
    return list.map((t) => ({ ...t, priority: t.priority || 'medium' }))
  } catch {
    return []
  }
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

const state = {
  todos: loadTodos(),
  filter: 'all',
  editingId: null,
}

const app = document.querySelector('#app')

function render() {
  const total = state.todos.length
  const completed = state.todos.filter((t) => t.done).length
  const active = total - completed

  const filtered = state.todos.filter((t) => {
    if (state.filter === 'active') return !t.done
    if (state.filter === 'completed') return t.done
    return true
  })

  app.innerHTML = `
    <div class="todo-app">
      <header class="todo-header">
        <h1><span class="header-icon">📋</span> 我的待办清单</h1>
        <p class="subtitle">高效管理每一天</p>
      </header>

      <form id="add-form" class="add-form">
        <input
          id="todo-input"
          class="todo-input"
          type="text"
          placeholder="今天要做什么？"
          autocomplete="off"
          maxlength="120"
        />
        <select id="priority-select" class="priority-select">
          <option value="high">🔴 高优先级</option>
          <option value="medium" selected>🟡 中优先级</option>
          <option value="low">🟢 低优先级</option>
        </select>
        <button type="submit" class="btn-add">➕ 添加任务</button>
      </form>

      <div class="filters">
        <button class="filter-btn ${state.filter === 'all' ? 'active' : ''}" data-filter="all">全部</button>
        <button class="filter-btn ${state.filter === 'active' ? 'active' : ''}" data-filter="active">未完成</button>
        <button class="filter-btn ${state.filter === 'completed' ? 'active' : ''}" data-filter="completed">已完成</button>
      </div>

      <ul class="todo-list">
        ${filtered.map((t) => renderTodoItem(t)).join('')}
        ${filtered.length === 0 ? renderEmptyState() : ''}
      </ul>

      <footer class="todo-footer">
        <span class="counter">未完成 <strong>${active}</strong></span>
        <span class="counter">已完成 <strong>${completed}</strong></span>
        <div class="footer-actions">
          ${completed > 0 ? '<button class="btn-clear" data-action="clear-completed">🗑️ 清空已完成</button>' : ''}
          ${total > 0 ? '<button class="btn-clear-all" data-action="clear-all">⚠️ 全部清空</button>' : ''}
        </div>
      </footer>
    </div>

    <div id="confirm-modal" class="modal-overlay" hidden>
      <div class="modal">
        <div class="modal-icon">⚠️</div>
        <h3 class="modal-title">确认全部清空</h3>
        <p class="modal-text">这将删除所有任务，且无法恢复。确定继续吗？</p>
        <div class="modal-actions">
          <button class="btn-modal-cancel" data-action="cancel-clear">取消</button>
          <button class="btn-modal-confirm" data-action="confirm-clear">确认清空</button>
        </div>
      </div>
    </div>
  `

  bindEvents()
}

function renderTodoItem(t) {
  const p = PRIORITIES[t.priority] || PRIORITIES.medium
  const isEditing = state.editingId === t.id

  if (isEditing) {
    return `
      <li class="todo-item editing" data-id="${t.id}">
        <span class="priority-dot" style="background:${p.color}" title="${p.label}优先级"></span>
        <input
          type="text"
          class="edit-input"
          value="${escapeHtml(t.text)}"
          maxlength="120"
          data-action="save-edit"
        />
        <div class="item-actions">
          <button class="btn-icon btn-save" data-action="save-edit" aria-label="保存">✓</button>
          <button class="btn-icon btn-cancel" data-action="cancel-edit" aria-label="取消">✕</button>
        </div>
      </li>
    `
  }

  return `
    <li class="todo-item ${t.done ? 'done' : ''} priority-${t.priority}" data-id="${t.id}">
      <span class="priority-dot" style="background:${p.color}" title="${p.label}优先级"></span>
      <label class="checkbox-wrap">
        <input type="checkbox" class="todo-check" ${t.done ? 'checked' : ''} />
        <span class="checkmark"></span>
        <span class="todo-text">${escapeHtml(t.text)}</span>
      </label>
      <div class="item-actions">
        <button class="btn-icon btn-edit" data-action="edit" aria-label="编辑任务">✎</button>
        <button class="btn-icon btn-delete" data-action="delete" aria-label="删除任务">✕</button>
      </div>
    </li>
  `
}

function renderEmptyState() {
  const hasAny = state.todos.length > 0
  const message = hasAny
    ? state.filter === 'completed'
      ? '还没有已完成的任务'
      : '没有未完成的任务，太棒了！'
    : '还没有任何任务，快来添加第一个吧！'

  return `
    <li class="empty">
      <div class="empty-icon">${hasAny ? '🎉' : '📝'}</div>
      <p class="empty-text">${message}</p>
    </li>
  `
}

function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

function bindEvents() {
  const form = document.querySelector('#add-form')
  const input = document.querySelector('#todo-input')
  const prioritySelect = document.querySelector('#priority-select')

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const text = input.value.trim()
    if (!text) return
    state.todos.unshift({
      id: Date.now() + Math.random(),
      text,
      done: false,
      priority: prioritySelect.value,
    })
    saveTodos(state.todos)
    render()
  })

  app.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.filter = btn.dataset.filter
      render()
    })
  })

  app.querySelectorAll('.todo-item').forEach((item) => {
    const id = parseFloat(item.dataset.id)

    const check = item.querySelector('.todo-check')
    if (check) {
      check.addEventListener('change', (e) => {
        const todo = state.todos.find((t) => t.id === id)
        if (todo) {
          todo.done = e.target.checked
          saveTodos(state.todos)
          render()
        }
      })
    }

    item.querySelectorAll('[data-action]').forEach((btn) => {
      const action = btn.dataset.action
      if (action === 'delete') {
        btn.addEventListener('click', () => {
          state.todos = state.todos.filter((t) => t.id !== id)
          saveTodos(state.todos)
          render()
        })
      } else if (action === 'edit') {
        btn.addEventListener('click', () => {
          state.editingId = id
          render()
        })
      } else if (action === 'save-edit') {
        const handler = () => {
          const editInput = item.querySelector('.edit-input')
          const text = editInput.value.trim()
          if (text) {
            const todo = state.todos.find((t) => t.id === id)
            if (todo) {
              todo.text = text
              saveTodos(state.todos)
            }
          }
          state.editingId = null
          render()
        }
        btn.addEventListener('click', handler)
        const editInput = item.querySelector('.edit-input')
        if (editInput) {
          editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handler()
            if (e.key === 'Escape') {
              state.editingId = null
              render()
            }
          })
          editInput.focus()
          editInput.select()
        }
      } else if (action === 'cancel-edit') {
        btn.addEventListener('click', () => {
          state.editingId = null
          render()
        })
      }
    })
  })

  const clearCompletedBtn = app.querySelector('[data-action="clear-completed"]')
  if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener('click', () => {
      state.todos = state.todos.filter((t) => !t.done)
      saveTodos(state.todos)
      render()
    })
  }

  const modal = app.querySelector('#confirm-modal')
  const clearAllBtn = app.querySelector('[data-action="clear-all"]')
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      modal.hidden = false
    })
  }

  modal.querySelector('[data-action="cancel-clear"]').addEventListener('click', () => {
    modal.hidden = true
  })
  modal.querySelector('[data-action="confirm-clear"]').addEventListener('click', () => {
    state.todos = []
    saveTodos(state.todos)
    modal.hidden = true
    render()
  })
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.hidden = true
  })

  if (state.editingId === null) {
    input.focus()
  }
}

render()
