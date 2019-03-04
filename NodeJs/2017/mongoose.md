#### mongoose连表
* mongoose通过Model来创建mongodb中对应的collection
```
mongoose.model('User', UserScheme);
```
* 在相应的数据库中创建一个collection时，第一反应肯定会推断在对应的数据库中会建立一个‘User’的collection，但是事实却与推断完全不一样，mongoose在内部创建collection时将我们传递的collection名小写化，同时如果小写化的名称后面没有字母——s,则会在其后面添加一s,针对我们刚建的collection,则会命名为：users。 
* schema中:
```
xxschema = new Schema({ … }, {collection: “your collection name”});
```
* model中
```
mongoose.model(‘User’, UserSchema, “your collection name”);
```