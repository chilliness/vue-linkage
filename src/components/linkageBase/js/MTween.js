let Tween = {
  linear(t, b, c, d) {
    return (c * t) / d + b;
  },
  easeIn(t, b, c, d) {
    return c * (t /= d) * t + b;
  },
  easeOut(t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  },
  easeBoth(t, b, c, d) {
    if ((t /= d / 2) < 1) {
      return (c / 2) * t * t + b;
    }
    return (-c / 2) * (--t * (t - 2) - 1) + b;
  },
  easeInStrong(t, b, c, d) {
    return c * (t /= d) * t * t * t + b;
  },
  easeOutStrong(t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  },
  easeBothStrong(t, b, c, d) {
    if ((t /= d / 2) < 1) {
      return (c / 2) * t * t * t * t + b;
    }
    return (-c / 2) * ((t -= 2) * t * t * t - 2) + b;
  },
  elasticIn(t, b, c, d, a, p) {
    let s;
    if (t === 0) {
      return b;
    }
    if ((t /= d) === 1) {
      return b + c;
    }
    if (!p) {
      p = d * 0.3;
    }
    if (!a || a < Math.abs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = (p / (2 * Math.PI)) * Math.asin(c / a);
    }
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t * d - s) * (2 * Math.PI)) / p)) + b;
  },
  elasticOut(t, b, c, d, a, p) {
    let s;
    if (t === 0) {
      return b;
    }
    if ((t /= d) === 1) {
      return b + c;
    }
    if (!p) {
      p = d * 0.3;
    }
    if (!a || a < Math.abs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = (p / (2 * Math.PI)) * Math.asin(c / a);
    }
    return a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) + c + b;
  },
  elasticBoth(t, b, c, d, a, p) {
    let s;
    if (t === 0) {
      return b;
    }
    if ((t /= d / 2) === 2) {
      return b + c;
    }
    if (!p) {
      p = d * (0.3 * 1.5);
    }
    if (!a || a < Math.abs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = (p / (2 * Math.PI)) * Math.asin(c / a);
    }
    if (t < 1) {
      return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t * d - s) * (2 * Math.PI)) / p)) + b;
    }
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) * 0.5 + c + b;
  },
  backIn(t, b, c, d, s) {
    if (typeof s === 'undefined') {
      s = 1.70158;
    }
    return c * (t /= d) * t * ((s + 1) * t - s) + b;
  },
  backOut(t, b, c, d, s) {
    if (typeof s === 'undefined') {
      s = 2.70158; // 回缩的距离
    }
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
  },
  backBoth(t, b, c, d, s) {
    if (typeof s === 'undefined') {
      s = 1.70158;
    }
    if ((t /= d / 2) < 1) {
      return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
    }
    return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
  },
  bounceIn(t, b, c, d) {
    return c - Tween['bounceOut'](d - t, 0, c, d) + b;
  },
  bounceOut(t, b, c, d) {
    if ((t /= d) < 1 / 2.75) {
      return c * (7.5625 * t * t) + b;
    } else if (t < 2 / 2.75) {
      return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
    } else if (t < 2.5 / 2.75) {
      return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
    }
    return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
  },
  bounceBoth(t, b, c, d) {
    if (t < d / 2) {
      return Tween['bounceIn'](t * 2, 0, c, d) * 0.5 + b;
    }
    return Tween['bounceOut'](t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
  }
};

export function cssTransform(el, attr, val) {
  if (!el.transform) {
    el.transform = {};
  }
  if (typeof val === 'undefined') {
    if (typeof el.transform[attr] === 'undefined') {
      switch (attr) {
        case 'scale':
        case 'scaleX':
        case 'scaleY':
          el.transform[attr] = 100;
          break;
        default:
          el.transform[attr] = 0;
      }
    }
    return el.transform[attr];
  } else {
    let transformVal = '';
    el.transform[attr] = Number(val);
    for (let s in el.transform) {
      switch (s) {
        case 'rotate':
        case 'rotateX':
        case 'rotateY':
        case 'rotateZ':
        case 'skewX':
        case 'skewY':
          transformVal += ' ' + s + '(' + el.transform[s] + 'deg)';
          break;
        case 'translateX':
        case 'translateY':
        case 'translateZ':
          transformVal += ' ' + s + '(' + el.transform[s] + 'px)';
          break;
        case 'scale':
        case 'scaleX':
        case 'scaleY':
          transformVal += ' ' + s + '(' + el.transform[s] / 100 + ')';
          break;
      }
    }
    el.style.WebkitTransform = el.style.transform = transformVal;
  }
}

export function css(el, attr, val) {
  if (['rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'skewX', 'skewY', 'translateX', 'translateY', 'translateZ'].includes(attr)) {
    return cssTransform(el, attr, val);
  }
  if (arguments.length === 2) {
    let val = getComputedStyle(el)[attr];
    if (attr === 'opacity') {
      val = Math.round(val * 100);
    }
    return parseFloat(val);
  }
  if (attr === 'opacity') {
    el.style.opacity = val / 100;
  } else {
    el.style[attr] = val + 'px';
  }
}

export function MTween(init) {
  let [t, b, c, d] = [0, {}, {}, init.time / 20];
  for (let s in init.target) {
    b[s] = css(init.el, s);
    c[s] = init.target[s] - b[s];
  }
  clearInterval(init.el.timer);
  init.el.timer = setInterval(() => {
    t++;
    if (t > d) {
      clearInterval(init.el.timer);
      init.callBack && init.callBack.call(init.el);
    } else {
      init.callIn && init.callIn.call(init.el);
      for (let s in b) {
        let val = Tween[init.type](t, b[s], c[s], d).toFixed(2);
        css(init.el, s, val);
      }
    }
  }, 20);
}

export default MTween;
