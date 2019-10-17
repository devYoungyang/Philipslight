/**
 * @module MIOT/Utils
 * 
 * 
 * 
 */
import {
    Platform,
} from 'react-native'
import { Package, Device, DeviceEvent, Service, Host, API_LEVEL, } from "miot";
const deviceId = Device.deviceID;
const storage = {
    save(obj) {
        this.saveItem(obj);
    },

    saveItem(obj) {
        const params = Object.entries(obj).map(val => {
            val[0] = deviceId + val[0];
            return val
        })
        const entries = {};
        params.forEach(val => {
            entries[val[0]] = val[1]
        })
        Host.storage.save(entries);
    },

    getItem(props) {
        const keys = props.map(prop => {
            return deviceId + prop;
        })
        return Host.storage.load(keys).then(resp => {
            const result = {};
            props.forEach((val, key) => {
                result[val] = resp[key];
            })
            return result
        })
    },
    load(props) {
        const keys = props.map(prop => {
            return deviceId + prop;
        });
        return Host.storage.load(keys);
    }
}


/**
 * 
 */
function UUID() {
    //考虑由原生生成
    return "...";
}

/**
 * @function format
 * @param str 
 * @param args
 * @returns string
 * @description 格式化文本, 按照参数顺序号将文本中的{n}替换为args[n]
 * @example
 * Utils.format("a{1}b{1}//{2}", 100, "hello")
 * Utils.format("a{1}", {"none":0,"one":1,"more":v=>v>1000})
 * Utils.format("a{1}", "{1}")
 */

function format(str, ...args) {
    if (!str) return "";
    const max = args.length;
    if (max < 1) return str;
    return str.replace(/[{][1-9][0-9]?[}]/g, w => {
        const idx = parseInt(w.substring(1, w.length - 1));
        return (idx < 1 || idx > max) ? w : args[idx - 1];
    })
}

/**
 * @export 
 * @function typeName
 * @param {*} obj 
 * @description 获取对象的类型名称
 */
function typeName(obj) {
    const name = Object.prototype.toString.call(obj);
    return name.substr(8, name.length - 9).toLowerCase();
}

/**
 * @function setReadonly
 * @param {*} obj 
 * @param {*} key 
 * @param {*} val 
 * @description 设置某一个属性为只读
 */
function setReadonly(obj, key, val) {
    return Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: false,
        get: () => val,
        set: () => { }
    });
}

/**
 * @export
 * @function formats
 * @param {*} obj 
 * @description 构建格式化文本集合
 * @example 
const strs=formats({
	t1:"tttttttt",
	t2:["tt{1}"],
    t3:["tt{1},{2}", [0, "zero"], [1, "one"], [2, "two,{2}", 1], [v=>v>100, "more"]],
	t4:{
		t5:[()=>"akjasdkljflkasdjf"],
		t6:["yyy{1}"]
	}
})

strs.t4.t6(1000)

 */
function formats(obj) {
    Object.keys(obj).forEach(function (key) {
        const arr = obj[key];
        if (!Array.isArray(arr)) {
            if (arr && typeName(arr) === "object") {
                formats(arr);
            }
            return;
        }
        switch (arr.length) {
            case 0:
                obj[key] = "";
                return;
            case 1:
                {
                    const val = arr[0];
                    setReadonly(obj, key,
                        (typeof (val) === "function") ? val
                            : (...args) => format(val, ...args)
                    )
                }
                return;
        }
        setReadonly(obj, key, (...args) => {
            let str = arr[0];
            if (args.length > 0) {
                for (let i = 1; i < arr.length; i++) {
                    const def = arr[i];
                    if (!Array.isArray(def) || def.length < 2) {
                        continue;
                    }
                    const chk = def[0];
                    if (typeof (chk) === "function") {
                        if (!chk(...args)) {
                            continue;
                        }
                    } else if (args[0] != chk) {
                        continue;
                    }
                    //found  
                    str = def[1];
                    if (def.length < 3 || !def[2]) {
                        return str;
                    }
                }
            }
            //format str
            return format(str, ...args);
        })
    });
    return obj;
}
/**
 * if the obj={}
 */
function isEmpty(obj) {
    for (var key in obj) {
        if (!obj[key]) return false;
    }
    return true;
}

function passMethodRet(props, res) {
    if (res.code !== 0 || !res.result || res.result.length == 0) {
        console.warn("get_props result:" + JSON.stringify(res));
        return null;
    }
    let retValues = res.result;
    let valueLen = retValues.length;
    let pairs = {};
    for (let i = 0; i < props.length; i++) {
        if (i >= valueLen)
            break;
        pairs[props[i]] = retValues[i];
    }
    return pairs;
}

function pairBind(props, res) {
    if (!res || res.length == 0) {
        console.warn("get_props result:" + JSON.stringify(res));
        return null;
    }
    let valueLen = Math.min(res.result.length, props.length);
    let pairs = {};
    for (let i = 0; i < valueLen; i++) {
        pairs[props[i]] = res[i];
    }
    console.warn(pairs)
    return pairs;
}

function formatPair(props, res) {
    if (!res) {
        return null
    }
    let valueLen = Math.min(res.length, props.length);
    let pairs = {};
    for (let i = 0; i < valueLen; i++) {
        pairs[props[i]] = res[i];
    }
    return pairs;
}

function isAndroid() {

    return Platform.OS == 'android';
}
function isIos() {
    return Platform.OS == 'ios';
}

export default {
    UUID,
    isIos,
    format,
    formats,
    typeName,
    setReadonly,
    isEmpty,
    passMethodRet,
    pairBind,
    formatPair,
    storage: storage
}
