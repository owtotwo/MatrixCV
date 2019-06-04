// cv.js文件

//引入lowdb模块
const lowdb = require('lowdb')

//定义数据模型，可以看到，我们下面创建了一个表，表中的数据有name、age、sex等字段，并且这些字段的数据类型也定义了，最后将model导出即可
const heroSchema = mongoose.Schema({
  name :String,
  age : String,
  sex : String,
  address : String,
  dowhat : String,
  imgArr:[],
  favourite:String,
  explain:String
}, { collection: 'myhero'})
//这里mongoose.Schema最好要写上第二个参数，明确指定到数据库中的哪个表取数据，我这里写了myhreo，目的就是为了以后操作数据要去myhreo表中。
这里不写第二个参数的话，后面你会遇到坑。

//导出model模块
const Hero = module.exports = mongoose.model('hero',heroSchema);

作者：newArray
链接：https://juejin.im/post/5aabc2caf265da239376d5ff
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。