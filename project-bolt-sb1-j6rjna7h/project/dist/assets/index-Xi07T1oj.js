(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const n of a.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function l(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerPolicy&&(a.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?a.credentials="include":t.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(t){if(t.ep)return;t.ep=!0;const a=l(t);fetch(t.href,a)}})();const $="todo-app-items",E={high:{label:"高",color:"#ef4444"},medium:{label:"中",color:"#f59e0b"},low:{label:"低",color:"#22c55e"}};function k(){try{const o=localStorage.getItem($);return(o?JSON.parse(o):[]).map(l=>({...l,priority:l.priority||"medium"}))}catch{return[]}}function p(o){localStorage.setItem($,JSON.stringify(o))}const e={todos:k(),filter:"all",editingId:null},m=document.querySelector("#app");function c(){const o=e.todos.length,i=e.todos.filter(t=>t.done).length,l=o-i,s=e.todos.filter(t=>e.filter==="active"?!t.done:e.filter==="completed"?t.done:!0);m.innerHTML=`
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
        <button class="filter-btn ${e.filter==="all"?"active":""}" data-filter="all">全部</button>
        <button class="filter-btn ${e.filter==="active"?"active":""}" data-filter="active">未完成</button>
        <button class="filter-btn ${e.filter==="completed"?"active":""}" data-filter="completed">已完成</button>
      </div>

      <ul class="todo-list">
        ${s.map(t=>I(t)).join("")}
        ${s.length===0?q():""}
      </ul>

      <footer class="todo-footer">
        <span class="counter">未完成 <strong>${l}</strong></span>
        <span class="counter">已完成 <strong>${i}</strong></span>
        <div class="footer-actions">
          ${i>0?'<button class="btn-clear" data-action="clear-completed">🗑️ 清空已完成</button>':""}
          ${o>0?'<button class="btn-clear-all" data-action="clear-all">⚠️ 全部清空</button>':""}
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
  `,x()}function I(o){const i=E[o.priority]||E.medium;return e.editingId===o.id?`
      <li class="todo-item editing" data-id="${o.id}">
        <span class="priority-dot" style="background:${i.color}" title="${i.label}优先级"></span>
        <input
          type="text"
          class="edit-input"
          value="${S(o.text)}"
          maxlength="120"
          data-action="save-edit"
        />
        <div class="item-actions">
          <button class="btn-icon btn-save" data-action="save-edit" aria-label="保存">✓</button>
          <button class="btn-icon btn-cancel" data-action="cancel-edit" aria-label="取消">✕</button>
        </div>
      </li>
    `:`
    <li class="todo-item ${o.done?"done":""} priority-${o.priority}" data-id="${o.id}">
      <span class="priority-dot" style="background:${i.color}" title="${i.label}优先级"></span>
      <label class="checkbox-wrap">
        <input type="checkbox" class="todo-check" ${o.done?"checked":""} />
        <span class="checkmark"></span>
        <span class="todo-text">${S(o.text)}</span>
      </label>
      <div class="item-actions">
        <button class="btn-icon btn-edit" data-action="edit" aria-label="编辑任务">✎</button>
        <button class="btn-icon btn-delete" data-action="delete" aria-label="删除任务">✕</button>
      </div>
    </li>
  `}function q(){const o=e.todos.length>0,i=o?e.filter==="completed"?"还没有已完成的任务":"没有未完成的任务，太棒了！":"还没有任何任务，快来添加第一个吧！";return`
    <li class="empty">
      <div class="empty-icon">${o?"🎉":"📝"}</div>
      <p class="empty-text">${i}</p>
    </li>
  `}function S(o){const i=document.createElement("div");return i.textContent=o,i.innerHTML}function x(){const o=document.querySelector("#add-form"),i=document.querySelector("#todo-input"),l=document.querySelector("#priority-select");o.addEventListener("submit",n=>{n.preventDefault();const d=i.value.trim();d&&(e.todos.unshift({id:Date.now()+Math.random(),text:d,done:!1,priority:l.value}),p(e.todos),c())}),m.querySelectorAll(".filter-btn").forEach(n=>{n.addEventListener("click",()=>{e.filter=n.dataset.filter,c()})}),m.querySelectorAll(".todo-item").forEach(n=>{const d=parseFloat(n.dataset.id),y=n.querySelector(".todo-check");y&&y.addEventListener("change",r=>{const u=e.todos.find(f=>f.id===d);u&&(u.done=r.target.checked,p(e.todos),c())}),n.querySelectorAll("[data-action]").forEach(r=>{const u=r.dataset.action;if(u==="delete")r.addEventListener("click",()=>{e.todos=e.todos.filter(f=>f.id!==d),p(e.todos),c()});else if(u==="edit")r.addEventListener("click",()=>{e.editingId=d,c()});else if(u==="save-edit"){const f=()=>{const h=n.querySelector(".edit-input").value.trim();if(h){const g=e.todos.find(L=>L.id===d);g&&(g.text=h,p(e.todos))}e.editingId=null,c()};r.addEventListener("click",f);const b=n.querySelector(".edit-input");b&&(b.addEventListener("keydown",v=>{v.key==="Enter"&&f(),v.key==="Escape"&&(e.editingId=null,c())}),b.focus(),b.select())}else u==="cancel-edit"&&r.addEventListener("click",()=>{e.editingId=null,c()})})});const s=m.querySelector('[data-action="clear-completed"]');s&&s.addEventListener("click",()=>{e.todos=e.todos.filter(n=>!n.done),p(e.todos),c()});const t=m.querySelector("#confirm-modal"),a=m.querySelector('[data-action="clear-all"]');a&&a.addEventListener("click",()=>{t.hidden=!1}),t.querySelector('[data-action="cancel-clear"]').addEventListener("click",()=>{t.hidden=!0}),t.querySelector('[data-action="confirm-clear"]').addEventListener("click",()=>{e.todos=[],p(e.todos),t.hidden=!0,c()}),t.addEventListener("click",n=>{n.target===t&&(t.hidden=!0)}),e.editingId===null&&i.focus()}c();
