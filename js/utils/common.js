/*
 * @Description: 公共函数抽取
 * @Author: 5t5
 * @Time: 2024/5/13 14:35
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

export {
    debounce,
    throttle
}