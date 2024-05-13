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
    if (itemsCache[i]) {
        // 如果列表项已存在于缓存中，直接返回它
        return itemsCache[i]
    }
    // 否则创建一个新的列表项并添加到缓存中
    const item = document.createElement('div')
    item.className = 'item'
    item.style.top = `${i * itemHeight}px`
    item.textContent = `Item ${i + 1}`
    itemsCache[i] = item
    return item
}

function renderVirtualList(scrollTop) {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer)
    const endIndex = Math.min(totalItems, startIndex + Math.ceil(container.offsetHeight / itemHeight) + buffer * 2)
    
    const fragment = document.createDocumentFragment()
    for (let i = startIndex; i < endIndex; i++) {
        fragment.appendChild(createItem(i))
    }
    container.innerHTML = ''
    container.appendChild(fragment)
}

// 防抖函数
function debounce(func, delay) {
    let timeoutId
    return function(...args) {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => func.apply(this, args), delay)
    }
}

// 监听滚动事件
container.addEventListener('scroll', debounce(() => {
    scrollTop = container.scrollTop
    requestAnimationFrame(() => renderVirtualList(scrollTop))
}, 30))

// 首次渲染虚拟列表
renderVirtualList(scrollTop)