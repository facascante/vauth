var mongoq = require('mongoq');
config = require('../../config/local.js');

var db = mongoq(config.MONGO_URL);

module.exports = {
    
    read : function(content,cb){
      db.collection(content.collection)
      .find(contet.filter,content.columns)
      .sort(content.sorting).skip(content.page || 0)
      .limit(content.rows || 0).toArray()
      .done(function(result){   
          cb(null,result);
      })
      .fail( function( err ) { 
          cb(err);
      });    

    },
    create : function(content,cb){
      db.collection(content.collection)
      .insert(content.record, {safe: true})
      .done(function(result){   
        cb(null,result);
      })
      .fail( function( err ) { 
        cb(err);
      });    
    },
    update : function(content,cb){
        db.collection(content.collection)
        .update(content.filter, content.record, {safe: true, upsert:true})
        .done(function(result){   
            cb(null,result);
        })
        .fail( function( err ) { 
            cb(err);
        });   
    },
    remove : function(content,cb){
        db.collection(content.collection)
        .remove(content.filter, {safe: true})
        .done(function(result){   
            cb(null,result);
        })
        .fail( function( err ) { 
            cb(err);
        });
    }
    
}
