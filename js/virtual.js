/*
 * @Description: 虚拟列表js逻辑
 * @Author: 5t5
 * @Time: 2024/5/13 10:49
 */

// 初始化容器和相关变量
const container = document.getElementById('container')
const totalItems = 10000 // 总项目数
const itemHeight = 60 // 单个项目高度
const buffer = 2 // 缓冲区大小
let scrollTop = 0 // 容器滚动位置
const itemsCache = {} // 缓存已创建的项目

// 设置容器高度
container.style.height = `${Math.min(buffer * itemHeight * 3 + itemHeight, totalItems * itemHeight)}px`

/**
 * 创建一个项目元素，并缓存。
 * @param {number} i - 项目的索引
 * @returns {HTMLElement} 创建的或缓存的项目元素
 */
function createItem(i) {
    if (!itemsCache[i]) {
        // 如果项目不在缓存中，则创建并添加到缓存
        const item = document.createElement('div')
        item.className = 'item'
        item.style.top = `${i * itemHeight}px`
        item.textContent = `Item ${i + 1}`
        itemsCache[i] = item
    }
    return itemsCache[i]
}

/**
 * 渲染虚拟列表。
 * @param {number} scrollTop - 当前滚动位置
 */
function renderVirtualList(scrollTop) {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer) // 计算可见项目的起始索引
    const endIndex = Math.min(totalItems, startIndex + Math.ceil(container.offsetHeight / itemHeight) + buffer * 2) // 计算可见项目的结束索引
    const newFragment = document.createDocumentFragment() // 创建一个文档片段，用于批量添加项目
    
    // 创建并添加可见项目到文档片段
    for (let i = startIndex; i < endIndex; i++) {
        newFragment.appendChild(createItem(i))
    }
    
    // 清理不在可见区域的项目
    [...container.childNodes].forEach(child => {
        const index = parseInt(child.style.top) / itemHeight
        if (index < startIndex || index >= endIndex) {
            container.removeChild(child)
        }
    })
    
    // 更新DOM，替换为新的项目集合
    container.appendChild(newFragment)
}

/**
 * 函数去抖动。
 * @param {Function} func - 需要去抖动的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 去抖动后的函数
 */
function debounce(func, delay) {
    let timeoutId
    return function(...args) {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}

/**
 * 函数节流。
 * @param {Function} func - 需要节流的函数
 * @param {number} limit - 限制时间（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit) {
    let inThrottle
    return function() {
        const args = arguments
        const context = this
        if (!inThrottle) {
            func.apply(context, args)
            inThrottle = true
            setTimeout(() => (inThrottle = false), limit)
        }
    }
}

// 绑定滚动事件处理程序，使用节流和去抖动来优化性能
container.addEventListener('scroll', throttle(debounce(() => {
    scrollTop = container.scrollTop
    requestAnimationFrame(() => renderVirtualList(scrollTop))
}, 30), 100))

// 首次渲染虚拟列表
renderVirtualList(scrollTop)
