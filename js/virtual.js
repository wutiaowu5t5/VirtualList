/*
 * @Description: virtual.js
 * @Author: 5t5
 * @Time: 2024/5/13 10:49
 */
const container = document.getElementById('container')
const totalItems = 10000 // 总列表项数量
const itemHeight = 60 // 每个列表项的高度
const buffer = 2 // 缓冲区大小
let scrollTop = 0 // 初始化滚动位置

// 初始渲染时设置一个合适的高度以确保滚动条存在
container.style.height = `${Math.min(buffer * itemHeight * 3 + itemHeight, totalItems * itemHeight)}px`

// 添加缓存对象
const cache = {}

// 更新渲染函数
function renderVirtualList(scrollTop) {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer)
    const endIndex = Math.min(totalItems, startIndex + Math.ceil(container.offsetHeight / itemHeight) + buffer * 2)

    // 从缓存中查找并插入已存在的元素
    for (let i = startIndex; i < endIndex; i++) {
        const cachedItem = cache[i]
        if (cachedItem) {
            container.insertBefore(cachedItem, container.children[startIndex])
        } else {
            const item = document.createElement('div')
            item.className = 'item'
            item.style.top = `${i * itemHeight}px`
            item.textContent = `Item ${i + 1}`
            container.appendChild(item)
            cache[i] = item
        }
    }

    // 移除超出视口的元素
    while (container.children.length > endIndex) {
        const lastItem = container.lastChild
        if (!cache[lastItem.dataset.index]) {
            cache[lastItem.dataset.index] = lastItem
        }
        container.removeChild(lastItem)
    }
}

// 更新防抖函数
function debounce(func, delay) {
    let timeoutId
    return function(...args) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            if (typeof requestIdleCallback === 'function') {
                requestIdleCallback(() => func.apply(this, args))
            } else {
                requestAnimationFrame(() => func.apply(this, args))
            }
        }, delay)
    }
}

// ...（其他部分保持不变）


// 监听滚动事件
container.addEventListener('scroll', debounce(() => {
    scrollTop = container.scrollTop
    requestAnimationFrame(() => renderVirtualList(scrollTop))
}, 30))

// 首次渲染虚拟列表
renderVirtualList(scrollTop)

// 确保在页面加载完成后调整容器高度为实际高度，但不再更新minHeight
window.addEventListener('load', () => {
    requestAnimationFrame(() => {
        // 这里不再更新minHeight，因为我们希望保持滚动条的存在
    })
})