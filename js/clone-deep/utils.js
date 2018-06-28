/**
 * 判断一个对象是不是字面量对象，即判断这个对象是不是由{}或者new Object类似方式创建
 * @param {*} obj 
 * @returns {boolean} 
 */
function isPlain(obj) {
    let hasOwnProperty = Object.prototype.hasOwnProperty;
    let key;
    if (!obj || 
        // 一般情况下直接用Object.prototype.toString.call
        Object.prototype.toString.call(obj) !== '[object Object]' ||
        // isPrototypeOf 挂在 Object.prototype 上的，因此所有的字面量都应该会有这个属性
        // 对于在 window 上挂了 isPrototypeOf 属性的情况，直接忽略不考虑
        !('isPrototypeOf' in obj)
        ) {
            return false;
    }
    // 判断new fun()自定义对象的情况
    // constructor不是继承自原型链的
    // 并且原型中有 isPrototypeOf 方法才是 Object
    if (obj.constructor && 
        ! hasOwnProperty.call(obj, 'constructor') &&
        ! hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')
        ) {
            return false;
    }
    // 判断有继承的情况
    // 如果有一项是继承过来的，那么一定不是字面量 Object
    // OwnProperty 会首先被遍历，为了加速遍历过程，直接看最后一项
    for ( key in obj ) {}
    return key === undefined || hasOwnProperty.call( obj, key );
}

function cloneObject(source) {
    var result = source, len, i;
    // null, undefined, 或者通过 new Number, new String, new Boolean 创建
    if (!source ||
        source instanceof Number ||
        source instanceof String ||
        source instanceof Boolean
    ){
        return result;
    }
    var type = Object.prototype.toString.call(source);
    switch (type) {
        case '[object Array]':
            result = [];
            var resultLen = 0;
            for (i = 0, len = source.length; i < len; i++) {
                result[resultLen++] = cloneObject(source[i]);
            }
            break;
        case '[object Date]':
            result = new Date(source.getTime());
            break;
        case '[object RegExp]':
            result = new RegExp(source);
            break;
        default: 
            if (isPlain(source)) {
                result = {};
                for (key in source) {
                    if (source.hasOwnProperty(key)) {
                        result[key] = cloneObject(source[key]);
                    }
                }
            }
    }
    return result;
}
