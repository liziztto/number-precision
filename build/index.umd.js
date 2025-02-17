(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.NP = {})));
}(this, (function (exports) { 'use strict';

/**
 * @desc 解决浮动运算问题，避免小数点后产生多位数和计算精度损失。
 * 问题示例：2.3 + 2.4 = 4.699999999999999，1.0 - 0.9 = 0.09999999999999998
 */
/**
 * 把错误的数据转正
 * strip(0.09999999999999998)=0.1
 */
function strip(num, precision) {
    if (precision === void 0) { precision = 12; }
    return +parseFloat(num.toPrecision(precision));
}
/**
 * Return digits length of a number
 * @param {*number} num Input number
 */
function digitLength(num) {
    // Get digit length of e
    var eSplit = num.toString().split(/[eE]/);
    var len = (eSplit[0].split('.')[1] || '').length - (+(eSplit[1] || 0));
    return len > 0 ? len : 0;
}
/**
 * 把小数转成整数，支持科学计数法。如果是小数则放大成整数
 * @param {*number} num 输入数
 */
function float2Fixed(num) {
    if (num.toString().indexOf('e') === -1) {
        return Number(num.toString().replace('.', ''));
    }
    var dLen = digitLength(num);
    return dLen > 0 ? strip(num * Math.pow(10, dLen)) : num;
}
/**
 * 检测数字是否越界，如果越界给出提示
 * @param {*number} num 输入数
 */
function checkBoundary(num) {
    if (_boundaryCheckingState) {
        if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
            console.warn(num + " is beyond boundary when transfer to integer, the results may not be accurate");
        }
    }
}
/**
 * 精确乘法
 */
function times(num1, num2) {
    var others = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        others[_i - 2] = arguments[_i];
    }
    if (others.length > 0) {
        return times.apply(void 0, [times(num1, num2), others[0]].concat(others.slice(1)));
    }
    var num1Changed = float2Fixed(num1);
    var num2Changed = float2Fixed(num2);
    var baseNum = digitLength(num1) + digitLength(num2);
    var leftValue = num1Changed * num2Changed;
    checkBoundary(leftValue);
    return leftValue / Math.pow(10, baseNum);
}
/**
 * 精确加法
 */
function plus(num1, num2) {
    var others = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        others[_i - 2] = arguments[_i];
    }
    if (others.length > 0) {
        return plus.apply(void 0, [plus(num1, num2), others[0]].concat(others.slice(1)));
    }
    var baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
    return (times(num1, baseNum) + times(num2, baseNum)) / baseNum;
}
/**
 * 精确减法
 */
function minus(num1, num2) {
    var others = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        others[_i - 2] = arguments[_i];
    }
    if (others.length > 0) {
        return minus.apply(void 0, [minus(num1, num2), others[0]].concat(others.slice(1)));
    }
    var baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
    return (times(num1, baseNum) - times(num2, baseNum)) / baseNum;
}
/**
 * 精确除法
 */
function divide(num1, num2) {
    var others = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        others[_i - 2] = arguments[_i];
    }
    if (others.length > 0) {
        return divide.apply(void 0, [divide(num1, num2), others[0]].concat(others.slice(1)));
    }
    var num1Changed = float2Fixed(num1);
    var num2Changed = float2Fixed(num2);
    checkBoundary(num1Changed);
    checkBoundary(num2Changed);
    return times((num1Changed / num2Changed), Math.pow(10, digitLength(num2) - digitLength(num1)));
}
/**
 * 四舍五入
 */
function round(num, ratio) {
    var base = Math.pow(10, ratio);
    return divide(Math.round(times(num, base)), base);
}
/**
 * 向上取整
 *
 * @param {number} num
 * @param {number} [percision=2]
 * @returns {number}
 */
function ceil(num, percision) {
    if (percision === void 0) { percision = 2; }
    var base = Math.pow(10, percision);
    return divide(Math.ceil(multiply(num, base)), base);
}
/**
 * 向下取整
 *
 * @param {number} num
 * @param {number} [percision=2]
 * @returns {number}
 */
function floor(num, percision) {
    if (percision === void 0) { percision = 2; }
    var base = Math.pow(10, percision);
    return divide(Math.floor(multiply(num, base)), base);
}
/**
 * 格式化显示
 * 123456789.999显示为123,456,789.999
 */
function formatNumber(num) {
    return +(num.toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
}
var _boundaryCheckingState = true;
/**
 * 是否进行边界检查，默认开启
 * @param flag 标记开关，true 为开启，false 为关闭，默认为 true
 */
function enableBoundaryChecking(flag) {
    if (flag === void 0) { flag = true; }
    _boundaryCheckingState = flag;
}
var index = { strip: strip, plus: plus, minus: minus, times: times, divide: divide, round: round, ceil: ceil, floor: floor, digitLength: digitLength, float2Fixed: float2Fixed, enableBoundaryChecking: enableBoundaryChecking, formatNumber: formatNumber };

exports.strip = strip;
exports.plus = plus;
exports.minus = minus;
exports.times = times;
exports.divide = divide;
exports.round = round;
exports.ceil = ceil;
exports.floor = floor;
exports.digitLength = digitLength;
exports.float2Fixed = float2Fixed;
exports.enableBoundaryChecking = enableBoundaryChecking;
exports.formatNumber = formatNumber;
exports['default'] = index;

Object.defineProperty(exports, '__esModule', { value: true });

})));
