var dataService = {
  init: function(){
    backand.init(
      {appName: 'reactnativetodoexample', 
       signUpToken: '4c128c04-7193-4eb1-8f19-2b742a2a7bba',
       anonymousToken: '2214c4be-d1b1-4023-bdfd-0d83adab8235', 
       runSocket: false
      }
    );   
  },
  getList: function(){
        var params =  {
          sort: backand.helpers.sort.create('creationDate', backand.helpers.sort.orders.desc),
          exclude: backand.helpers.exclude.options.all,
          pageSize: 10,
          pageNumber: 1,
          filter: backand.helpers.filter.create('completionDate', backand.helpers.filter.operators.date.empty, '')
        };
        return backand.object.getList('todos',params);
  },
  create:function(text){
    return backand.object.create('todos',
          {"text":text,"creationDate":new Date()});
  },
  update:function(text, id){
    return backand.object.update('todos', id,
          {"text":text,"completionDate":new Date()});
  }
}

$(document).ready(
    function(){
      var prependTodo = function(text){
          var li = $('<li>' + text + '</li>');
          $('ol').prepend(li);
          return li;
      };
      
      var appendTodo = function(text, id){
          $('ol').append('<li bkId="' + id + '">' + text + '</li>');
      };
        
      dataService.init();
        
      var loadList = function(){
         $('ol').empty();
        dataService.getList().then(function(response){
            $.each(response.data, function(i, todo){
              appendTodo(todo.text,todo.id);
            })
         })
      }
      
      loadList();
      
      $('#button').click(
          function(){
            var text = $('input[name=ListItem]').val();
            var li = prependTodo(text);
            dataService.create(text).then(function(response){
              li.attr('bkId',response.data.__metadata.id);
            }).catch(function(err){
              alert(JSON.stringify(err));
              loadList();
            });
            
      });
       
      $("input[name=ListItem]").keyup(function(event){
          if(event.keyCode == 13){
            $("#button").click();
          }         
      });
      
      $(document).on('dblclick','li', function(){
        $(this).toggleClass('strike').fadeOut('slow');    
        var text = $(this).text();
        var id = $(this).attr('bkId');
        dataService.update(text, id).then(function(response){
          
        }).catch(function(err){
          loadList();
        })
      });
      
      $('input').focus(function() {
        $(this).val('');
      });
      
      $('ol').sortable();  
      
    }
);