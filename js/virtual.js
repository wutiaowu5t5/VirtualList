/*
 * @Description: 虚拟列表js逻辑
 * @Author: 5t5
 * @Time: 2024/5/13 10:49
 */
const container = document.getElementById('container')
const totalItems = 10000 // 总列表项数量
const itemHeight = 60 // 每个列表项的高度
const buffer = 2 // 缓冲区大小
let scrollTop = 0 // 初始化滚动位置
const itemsCache = {}; // 用于缓存列表项的容器

// 初始渲染时设置一个合适的高度以确保滚动条存在
container.style.height = `${Math.min(buffer * itemHeight * 3 + itemHeight, totalItems * itemHeight)}px`

function createItem(i) {
    if (!itemsCache[i]) {
        // 创建一个新的列表项并添加到缓存中
        const item = document.createElement('div')
        item.className = 'item'
        item.style.top = `${i * itemHeight}px`
        item.textContent = `Item ${i + 1}`
        itemsCache[i] = item
    }
    return itemsCache[i]
}

function renderVirtualList(scrollTop) {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer)
    const endIndex = Math.min(totalItems, startIndex + Math.ceil(container.offsetHeight / itemHeight) + buffer * 2)
    const newFragment = document.createDocumentFragment()
    
    for (let i = startIndex; i < endIndex; i++) {
        newFragment.appendChild(createItem(i))
    }
    
    //更新DOM前，移除已有的子元素
    [...container.childNodes].forEach(child => {
        const index = parseInt(child.style.top) / itemHeight
        if (index < startIndex || index >= endIndex) {
            container.removeChild(child)
        }
    })
    
    container.appendChild(newFragment)
}

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

container.addEventListener('scroll', throttle(debounce(() => {
    scrollTop = container.scrollTop
    requestAnimationFrame(() => renderVirtualList(scrollTop))
}, 30), 100))

// 首次渲染虚拟列表
renderVirtualList(scrollTop)