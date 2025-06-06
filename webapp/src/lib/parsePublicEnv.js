var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
export var parsePublicEnv = function (env) {
    return Object.entries(env).reduce(function (acc, _a) {
        var _b;
        var key = _a[0], value = _a[1];
        if (key.startsWith('VITE_') || ['NODE_ENV', 'HOST_ENV', 'SOURCE_VERSION'].includes(key)) {
            return __assign(__assign({}, acc), (_b = {}, _b[key] = value, _b));
        }
        return acc;
    }, {});
};
