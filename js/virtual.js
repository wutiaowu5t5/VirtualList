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

// 初始渲染时设置一个合适的高度以确保滚动条存在
container.style.height = `${Math.min(buffer * itemHeight * 3 + itemHeight, totalItems * itemHeight)}px`

function renderVirtualList(scrollTop) {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer)
    const endIndex = Math.min(totalItems, startIndex + Math.ceil(container.offsetHeight / itemHeight) + buffer * 2)
    
    container.innerHTML = ''
    
    for (let i = startIndex; i < endIndex; i++) {
        const item = document.createElement('div')
        item.className = 'item'
        item.style.top = `${i * itemHeight}px`
        item.textContent = `Item ${i + 1}`
        container.appendChild(item)
    }
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

// 确保在页面加载完成后调整容器高度为实际高度，但不再更新minHeight
window.addEventListener('load', () => {
    requestAnimationFrame(() => {
        // 这里不再更新minHeight，因为我们希望保持滚动条的存在
    })
})