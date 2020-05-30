/** 
 * 格式化 - 工具
 * @author LiQingSong
 */

 /**
 * 二维数组 返回对应的 字符串 , 链接
 * @param  val        array 下拉框的值
 * @returns Object
 * @author LiQingSong
 */
export function Array2dToString(val) {
    let obj = {
        idStr: '',
        idsStr: ''
    };
    if (!val) {
        return obj;
    }

    const array = val;
    const arrLen = array.length;
    let idArr = [];
    let idsArr = [];
    for (let index = 0; index < arrLen; index++) {
        const element = array[index];
        const eleLen = element.length;
        if (eleLen > 0) {
            idArr.push(element[eleLen - 1]);
            idsArr.push(element.join('-'));
        }        
    }

    obj['idStr'] = idArr.join(',');
    obj['idsStr'] = idsArr.join(',');

    return obj;
   
}

/**
 * 字符串 转 二维数组
 * @param  val        String 下拉框的值
 * @returns Array     [[]]
 * @author LiQingSong
 */
export function StringToArray2d(val) {
    if (!val) {
        return [];
    }

    const array = val.split(',');
    const arrLen = array.length;
    let arr = [];
    for (let index = 0; index < arrLen; index++) {
        const element = array[index];
        const eleArr = element.split('-');
        const eArr = eleArr.map(item => {
            return item * 1;
        });
        arr.push(eArr);    
    }

    return arr;
   
}

 /**
 * 格式化element-ui 层级数据
 * @param  data      Array     需要格式化的数据
 * @param  value     String    data 对应的 value 字段名
 * @param  label     String    data 对应的 label 字段名
 * @param  pid       String    data 对应的 pid 字段名
 * @param  pidVal    String    起始 pid 值
 * @returns Array
 * @author LiQingSong
 */
export function formatEleUiLevelData(data, value, label, pid, pidVal) {
    const len = data.length;
    if (len < 1) {
      return null;
    }
    let newData = [];
    for (let index = 0; index < len; index++) {
      const element = data[index];
      if (element[pid] === pidVal) {
        newData.push({
            value: element[value],
            label: element[label],
            children: formatEleUiLevelData(data, value, label, pid, element[value])
        });
      }
    }
    
    return newData.length > 0 ? newData : null;
}