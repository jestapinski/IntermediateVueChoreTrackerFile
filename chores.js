$(document).on('turbolinks:load', function() {
      //Code to instantiate a blank, new instance of Vue.JS

      function run_ajax(method, data, link, callback=function(res){chores.get_chores()}){
        $.ajax({
          method: method,
          data: data,
          url: link,
          success: function(res) {
            callback(res);
          },
          error: function(res) {
            console.log("error");
            // Will update with an error handling function later
          }
        })
      }

      Vue.component('chore-row', {
        // Defining where to look for the HTML template in the index view
        template: '#chore-row',

        // Passed elements to the component from the Vue instance
        props: {
          chore: Object,
          name: String,
          task: String
        },
        // Behaviors associated with this component
        methods: {
          remove_record: function(chore){
          },
          toggle_complete: function (chore){
          },
        }
      });

      var chores = new Vue({
        // Keys, values go here
        el: '#chores_list',
        data: {
          chores: [],
          tasks: [],
          children: [],
        },
        methods: {
          get_chores: function(){
            run_ajax('GET', {}, '/chores.json', function(res){chores.chores = res});
          },
          get_tasks: function(){
            run_ajax('GET', {}, '/tasks.json', function(res){chores.tasks = res;});
          },
          get_children: function(){
            run_ajax('GET', {}, '/children.json', function(res){chores.children = res;});      
          },
          /* 
          Since we are not iterating over an ActiveRecord collection, we must perform
          A join operation ourselves using javascript for child and task to display
          */
          find_child_name: function(chore){
            var desired_id = chore.child_id;
            for (var child = 0; child < this.children.length; child += 1){
              if (this.children[child]['id'] == desired_id){
                return this.children[child]['first_name'].concat(' ', this.children[child]['last_name']);
              }
            }
            return "No name"
          },
          find_task_name: function(chore){
            var desired_id = chore.task_id;
            for (var task = 0; task < this.tasks.length; task += 1){
              if (this.tasks[task]['id'] == desired_id){
                return this.tasks[task]['name'];
              }
            }
            return "No task"
          }
        },
        mounted: function(){
          this.get_chores();
          this.get_tasks(); 
          this.get_children();
        }
      });
    }
  );
