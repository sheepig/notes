function add(n) {
    var args = [].slice.call(arguments); // 闭包存储args
    
    var fn = function() {
        var fn_args = [].slice.call(arguments); // 合并参数
        return add.apply(null, args.concat(fn_args));
    }
    fn.valueOf = function() {
        return args.reduce((a, b) =>  a + b );
    }
    return fn;
}