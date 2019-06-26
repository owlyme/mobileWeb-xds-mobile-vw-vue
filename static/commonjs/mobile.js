/**
 * [isMobile 判断平台]
 * @param test: 0:iPhone    1:Android
 */
function ismobile(test) {
  let u = navigator.userAgent,
  app = navigator.appVersion
  if (/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))) {
   if (window.location.href.indexOf("?mobile") < 0) {
    try {
     if (/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)) {
      return '0'
     }
      return '1'
    } catch (e) {}
   }
  } else if (u.indexOf('iPad') > -1) {
      return '0'
  } else {
      return '1'
  }
}

if (ismobile()) {
  // focusin和focusout支持冒泡，对应focus和blur, 使用focusin和focusout的原因是focusin和focusout可以冒泡，focus和blur不会冒泡，这样就可以使用事件代理，处理多个输入框存在的情况。
  document.body.addEventListener('focusin', () => {
    // 软键盘弹出的事件处理
  })
  document.body.addEventListener('focusout', () => {
  // 软键盘收起的事件处理
    window.scrollBy({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  })
} else {
  // 获取原窗口的高度
  const originalHeight = document.documentElement.clientHeight || document.body.clientHeight
  window.onresize = function () {
      // 键盘弹起与隐藏都会引起窗口的高度发生变化
        const resizeHeight = document.documentElement.clientHeight || document.body.clientHeight
          if (resizeHeight - 0 < originalHeight - 0) {
          // 当软键盘弹起，在此处操作
          } else {
          // 当软键盘收起，在此处操作
            window.scrollBy(
              {
                top: 0,
                left: 0,
                behavior: 'smooth'
              }
            )
          }
  }
}

